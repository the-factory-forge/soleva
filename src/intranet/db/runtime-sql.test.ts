import { readFile, readdir } from "node:fs/promises";

import { expect, test } from "vite-plus/test";

test("application database access uses typed queries", async () => {
  const root = new URL("../../", import.meta.url);
  for (const path of await readdir(root, { recursive: true })) {
    if (
      !/\.tsx?$/.test(path) ||
      /\/schema\//.test(path) ||
      /(?:^|\/)[^/]*schema\.tsx?$/.test(path) ||
      /(?:\.test\.|\/e2e\/)/.test(path)
    )
      continue;
    const source = await readFile(new URL(path, root), "utf8");
    expect(source, path).not.toMatch(
      /import\s*\{[^}]*\bsql\b[^}]*\}\s*from\s*["']drizzle-orm["']|\.(?:sql|raw|unsafe)\s*[(\x60]|\.execute\(\s*[^)\s]|\b[\w$.]+\s*\x60(?:select|insert|update|delete|with|alter|create|drop)\b/i,
    );
  }
});
