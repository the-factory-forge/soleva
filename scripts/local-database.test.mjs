import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  copyFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { hashPassword, verifyPassword } from "better-auth/crypto";
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
cpSync(new URL("../drizzle/", import.meta.url), join(directory, "drizzle"), { recursive: true });
symlinkSync(
  fileURLToPath(new URL("../node_modules/", import.meta.url)),
  join(directory, "node_modules"),
);
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
  let url = run(process.execPath, ["scripts/local-database.mjs"]);
  const parsed = new URL(url);
  assert.equal(parsed.hostname, "127.0.0.1");
  assert.ok(Number(parsed.port) > 0);
  assert.notEqual(parsed.port, "5432");
  const expectedDatabase = JSON.parse(
    run("docker", ["compose", "--env-file", ".env.local", "config", "--format", "json"]),
  ).services.db.environment.POSTGRES_DB;
  assert.equal(decodeURIComponent(parsed.pathname), `/${expectedDatabase}`);

  sql = postgres(url, { max: 1 });
  const [admin] = await sql`SELECT * FROM "user"`;
  const [account] = await sql`SELECT * FROM account`;
  assert.equal(admin.email, "admin@example.com");
  assert.equal(admin.role, "admin");
  assert.equal(account.user_id, admin.id);
  assert.equal(account.provider_id, "credential");
  assert.equal(await verifyPassword({ hash: account.password, password: "admin" }), true);

  const password = await hashPassword("Changed-after-first-boot-123");
  await sql`UPDATE account SET password = ${password}`;
  await sql`UPDATE "user" SET role = 'user'`;
  await sql`create table local_database_check (value text)`;
  await sql`insert into local_database_check values ('preserved')`;
  await sql.end();
  run("docker", ["compose", "--env-file", ".env.local", "stop", "db"]);
  url = run(process.execPath, ["scripts/local-database.mjs"]);
  sql = postgres(url, { max: 1 });
  assert.equal((await sql`select value from local_database_check`)[0].value, "preserved");
  assert.deepEqual([...(await sql`SELECT id, role FROM "user"`)], [{ id: admin.id, role: "user" }]);
  assert.deepEqual([...(await sql`SELECT password FROM account`)], [{ password }]);

  await sql`DELETE FROM "user"`;
  assert.equal(run(process.execPath, ["scripts/local-database.mjs"]), url);
  assert.equal((await sql`SELECT * FROM "user"`).length, 0);
  assert.equal((await sql`SELECT * FROM account`).length, 0);

  const failingMigration = join(directory, "drizzle/20990101000000_test_failure");
  mkdirSync(failingMigration);
  writeFileSync(join(failingMigration, "migration.sql"), "SELECT missing_bootstrap_function();");
  assert.throws(
    () => run(process.execPath, ["scripts/local-database.mjs"]),
    (error) => error.status === 1 && error.stdout === "",
  );

  writeFileSync(
    join(directory, ".env.local"),
    `SITE_NAME=${site}\nBETTER_AUTH_SECRET=local-database-test-only\n`,
  );
  assert.throws(() => run(process.execPath, [varlock, "load", "--agent"]), /DATABASE_URL/);
  console.log(
    "Passed: automatic migration, admin login hash, preserved data and credentials, no reseeding, migration failure, deployment override.",
  );
} finally {
  await sql?.end();
  try {
    run("docker", ["compose", "--env-file", ".env.local", "down", "--volumes"]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
