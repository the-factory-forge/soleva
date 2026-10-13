import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

function compose(...args) {
  return execFileSync("docker", ["compose", "--env-file", ".env.local", ...args], {
    encoding: "utf8",
    // Only the resolved URL belongs on stdout, which Varlock captures.
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

try {
  const { environment } = JSON.parse(compose("config", "--format", "json")).services.db;
  compose("up", "--detach", "--wait", "--wait-timeout", "60", "db");

  const url = new URL(`postgresql://${compose("port", "db", "5432")}`);
  url.username = environment.POSTGRES_USER;
  url.password = environment.POSTGRES_PASSWORD;
  url.pathname = `/${environment.POSTGRES_DB}`;

  const sql = postgres(url.href, { max: 1, onnotice: () => {} });
  try {
    // Concurrent environment loads must not apply the same migrations twice.
    await sql`SELECT pg_advisory_lock(hashtext('forge-local-migrations'))`;
    await migrate(drizzle({ client: sql }), {
      migrationsFolder: fileURLToPath(new URL("../drizzle/", import.meta.url)),
    });
  } finally {
    await sql.end();
  }
  process.stdout.write(url.href);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
