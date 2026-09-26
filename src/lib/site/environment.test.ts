import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { expect, test } from "vite-plus/test";

test("Portless supplies the local origin while deployment overrides remain authoritative", () => {
  const directory = mkdtempSync(join(tmpdir(), "soleva-env-"));
  const environment = { ...process.env };
  delete environment.PORTLESS_URL;
  // Varlock types this as required in the app; this child tests resolving it from scratch.
  Reflect.deleteProperty(environment, "VITE_BASE_URL");
  // Ignore the parent Vite process's already-resolved environment.
  delete environment.__VARLOCK_ENV;
  // Resolve only the contract, never a developer's local credentials.
  copyFileSync(new URL("../../../.env.schema", import.meta.url), join(directory, ".env.schema"));
  try {
    for (const [portless, override, expected] of [
      ["", "", "http://localhost:3000"],
      ["https://soleva.localhost", "", "https://soleva.localhost"],
      ["http://soleva.localhost:1355", "", "http://soleva.localhost:1355"],
      ["https://soleva.localhost", "http://localhost:3000", "http://localhost:3000"],
    ]) {
      const result = spawnSync(
        "vp",
        ["exec", "varlock", "load", "--agent", "--path", directory, "--filter", "VITE_BASE_URL"],
        {
          encoding: "utf8",
          env: {
            ...environment,
            ...(portless ? { PORTLESS_URL: portless } : {}),
            ...(override ? { VITE_BASE_URL: override } : {}),
          },
        },
      );
      expect(result.status, result.stderr).toBe(0);
      expect(JSON.parse(result.stdout).VITE_BASE_URL).toBe(expected);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
