import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { cp, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { expect, test } from "vite-plus/test";

const connection = process.env.SECURITY_TEST_DATABASE_URL;
if (connection) {
  const target = new URL(connection);
  if (
    !["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) ||
    !target.pathname.endsWith("_e2e")
  ) {
    throw new Error("Preflight tests require an isolated local _e2e database");
  }
}

test.skipIf(!connection)(
  "startup rejects stale history and incremental migrations preserve existing accounts",
  async () => {
    const root = postgres(connection!, { max: 1, onnotice: () => {} });
    const name = `preflight_${randomUUID().replaceAll("-", "")}`;
    const url = new URL(connection!);
    url.pathname = name;
    const pool = postgres(url.href, { max: 1, onnotice: () => {} });
    const folder = await mkdtemp(join(tmpdir(), "forge-preflight-"));
    const started = join(folder, "started");
    const cwd = fileURLToPath(new URL("../../../", import.meta.url));
    // Leave the real preflight intact; substitute migration invocation and the HTTP server.
    await writeFile(
      join(folder, "varlock"),
      `#!/bin/sh
shift
shift
if [ "$1" = "drizzle-kit" ]; then exit 0; fi
if [ "$2" = ".output/server/index.mjs" ]; then
  : > "$PREFLIGHT_TEST_STARTED_FILE"
  exit 0
fi
exec "$@"
`,
      { mode: 0o755 },
    );
    const start = () =>
      spawnSync("sh", ["docker-entrypoint.sh"], {
        cwd,
        encoding: "utf8",
        env: {
          ...process.env,
          DATABASE_URL: url.href,
          PATH: `${folder}:${process.env.PATH}`,
          PREFLIGHT_TEST_STARTED_FILE: started,
        },
      });
    try {
      await root`create database ${root(name)}`;
      expect(start().status).not.toBe(0);
      expect(existsSync(started)).toBe(false);
      const migrationsFolder = join(cwd, "drizzle");
      const firstMigration = (await readdir(migrationsFolder)).sort()[0]!;
      const baselineFolder = join(folder, "baseline");
      await cp(join(migrationsFolder, firstMigration), join(baselineFolder, firstMigration), {
        recursive: true,
      });
      const db = drizzle({ client: pool });
      await migrate(db, { migrationsFolder: baselineFolder });
      await pool`update account set password='existing-password-hash'`;
      await pool`insert into session (id, expires_at, token, updated_at, user_id)
        select 'existing-session', now() + interval '1 day', 'existing-session-token', now(), id
        from "user" limit 1`;
      const users = await pool`select * from "user" order by id`;
      const accounts = await pool`select * from account order by id`;
      const sessions = await pool`select id, token, user_id, expires_at from session order by id`;
      const baselineJournal = await pool`select * from drizzle.__drizzle_migrations order by id`;
      expect(users).toHaveLength(1);
      expect(accounts).toHaveLength(1);
      expect(sessions).toHaveLength(1);
      const pending = start();
      expect(pending.status).not.toBe(0);
      expect(pending.stderr).toContain("Project migrations are not current");
      expect(existsSync(started)).toBe(false);
      await migrate(db, { migrationsFolder });
      const journal = await pool`select * from drizzle.__drizzle_migrations order by id`;
      expect(journal).toHaveLength((await readdir(migrationsFolder)).length);
      expect(journal.slice(0, baselineJournal.length)).toEqual(baselineJournal);
      await migrate(db, { migrationsFolder });
      expect(await pool`select * from drizzle.__drizzle_migrations order by id`).toEqual(journal);
      expect(await pool`select * from "user" order by id`).toEqual(users);
      expect(await pool`select * from account order by id`).toEqual(accounts);
      expect(await pool`select id, token, user_id, expires_at from session order by id`).toEqual(
        sessions,
      );
      const ready = start();
      expect(ready.status, ready.stderr).toBe(0);
      expect(existsSync(started)).toBe(true);
      await rm(started);
      await pool`update drizzle.__drizzle_migrations set hash='changed'`;
      const stale = start();
      expect(stale.status).not.toBe(0);
      expect(stale.stderr).toContain("Project migrations are not current");
      expect(existsSync(started)).toBe(false);
    } finally {
      await pool.end();
      await root`drop database if exists ${root(name)}`;
      await root.end();
      await rm(folder, { recursive: true, force: true });
    }
  },
  30_000,
);
