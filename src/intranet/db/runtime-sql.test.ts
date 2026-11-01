import { readFile, readdir } from "node:fs/promises";

import { expect, test } from "vite-plus/test";

function hasRuntimeSql(path: string, source: string) {
  if (/(?:^|\/)schema(?:\/|\.ts$)/.test(path) || /(?:\.test\.|\/e2e\/)/.test(path)) return false;
  return /import\s*\{[^}]*\bsql\b[^}]*\}\s*from\s*["']drizzle-orm["']|\.(?:sql|raw|unsafe)\s*[(\x60]|\.execute\(\s*[^)\s]|\b[\w$.]+\s*\x60(?:select|insert|update|delete|with|alter|create|drop)\b/i.test(
    source,
  );
}

test("schema expressions are allowed without excluding installed runtime queries", () => {
  const sqlImport = 'import { sql as query } from "drizzle-orm";';
  for (const path of [
    "intranet/db/schema/auth.schema.ts",
    "components/plugins/reservations/server/schema.ts",
    "intranet/components/forge/plugins/blogs/server/schema.ts",
  ]) {
    expect(hasRuntimeSql(path, sqlImport), path).toBe(false);
  }
  for (const path of [
    "intranet/blogs/functions.ts",
    "components/plugins/reservations/server/storage.ts",
    "intranet/components/forge/plugins/blogs/server/storage.server.ts",
    "intranet/db/schema-queries.ts",
  ]) {
    expect(hasRuntimeSql(path, sqlImport), path).toBe(true);
    expect(hasRuntimeSql(path, "db.select().from(users).where(eq(users.id, id));"), path).toBe(
      false,
    );
  }
});

test("application database access uses typed queries", async () => {
  const root = new URL("../../", import.meta.url);
  for (const path of await readdir(root, { recursive: true })) {
    if (!/\.tsx?$/.test(path)) continue;
    const source = await readFile(new URL(path, root), "utf8");
    expect(hasRuntimeSql(path, source), path).toBe(false);
  }
});
