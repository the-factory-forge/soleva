import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import postgres from "postgres";

// Run explicitly with `node scripts/local-database.test.mjs`; requires Docker.
const directory = mkdtempSync(join(tmpdir(), "forge-local-db-"));
const site = `forge-${randomUUID()}-e2e`;
const environment = { ...process.env };
for (const key of Object.keys(environment)) {
  if (/^(COMPOSE_|_+VARLOCK)|^(DATABASE_URL|SITE_NAME|BETTER_AUTH_SECRET)$/.test(key)) {
    delete environment[key];
  }
}

function run(command, args, overrides = {}) {
  return execFileSync(command, args, {
    cwd: directory,
    env: { ...environment, ...overrides },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

mkdirSync(join(directory, "scripts"));
for (const file of ["docker-compose.yml", ".env.schema", "scripts/local-database.mjs"]) {
  copyFileSync(new URL(`../${file}`, import.meta.url), join(directory, file));
}
writeFileSync(
  join(directory, ".env.local"),
  `SITE_NAME=${site}\nBETTER_AUTH_SECRET=local-database-test-only\nDATABASE_URL=exec("node scripts/local-database.mjs")\n`,
);

const varlock = fileURLToPath(
  new URL("../node_modules/varlock/dist/cli/cli-executable.mjs", import.meta.url),
);
let sql;
try {
  // An explicit deployment URL must bypass Docker entirely.
  run(process.execPath, [varlock, "load", "--agent"], {
    DATABASE_URL: "postgresql://example:example@db.example.test:5432/site",
    DOCKER_HOST: "unix:///nonexistent-forge-test.sock",
    DOCKER_CONTEXT: "",
  });

  // A normal Varlock load must start the database through the local resolver.
  run(process.execPath, [varlock, "load", "--agent"]);
  const url = run(process.execPath, ["scripts/local-database.mjs"]);
  const parsed = new URL(url);
  assert.equal(parsed.hostname, "127.0.0.1");
  assert.ok(Number(parsed.port) > 0);
  assert.notEqual(parsed.port, "5432");
  assert.equal(parsed.pathname, `/${site}`);

  sql = postgres(url, { max: 1 });
  await sql`create table local_database_check (value text)`;
  await sql`insert into local_database_check values ('preserved')`;
  assert.equal(run(process.execPath, ["scripts/local-database.mjs"]), url);
  assert.equal((await sql`select value from local_database_check`)[0].value, "preserved");

  writeFileSync(
    join(directory, ".env.local"),
    `SITE_NAME=${site}\nBETTER_AUTH_SECRET=local-database-test-only\n`,
  );
  // These customer sites retain optional auth/database configuration.
  run(process.execPath, [varlock, "load", "--agent"], {
    DOCKER_HOST: "unix:///nonexistent-forge-test.sock",
    DOCKER_CONTEXT: "",
  });
  console.log(
    "Passed: automatic startup, assigned port, data reuse, deployment overrides, and database-free mode.",
  );
} finally {
  await sql?.end();
  try {
    run("docker", ["compose", "--env-file", ".env.local", "down", "--volumes"]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
