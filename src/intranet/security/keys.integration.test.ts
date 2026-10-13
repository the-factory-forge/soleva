import { randomUUID } from "node:crypto";

import { symmetricDecrypt } from "better-auth/crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it, vi } from "vite-plus/test";

vi.mock("@tanstack/react-start/server-only", () => ({}));
vi.mock("varlock/env", () => ({
  ENV: { BETTER_AUTH_SECRET: "isolated-security-test-secret-at-least-32" },
}));
vi.mock("#/intranet/db", () => ({ db: drizzle({ client: sql }) }));

const databaseURL = process.env.SECURITY_TEST_DATABASE_URL;
const target = databaseURL ? new URL(databaseURL) : null;
if (
  target &&
  (!["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) ||
    !target.pathname.endsWith("_e2e"))
) {
  throw new Error("Security tests require an isolated local _e2e database");
}
const sql = postgres(databaseURL ?? "postgresql://test:test@localhost:1/not-configured_e2e", {
  max: 1,
});
const id = randomUUID();

describe.skipIf(!databaseURL)("persisted agent key authentication", () => {
  beforeAll(async () => {
    await sql`INSERT INTO "user" (id, name, email, role) VALUES (${id}, 'Security test', ${`${id}@example.test`}, 'user')`;
  });
  afterAll(async () => {
    await sql`DELETE FROM "user" WHERE id = ${id}`;
    await sql.end();
  });
  it("encrypts keys, records real use and rejects expired, deleted or disabled-owner credentials", async () => {
    const { createAgentKey, authenticateAgentKey, hashAgentKey } = await import("./keys.server");
    const { token } = await createAgentKey(id, {
      name: "Integration",
      expiresAt: new Date(Date.now() + 86_400_000),
    });
    const [stored] = await sql`SELECT * FROM agent_key WHERE user_id = ${id}`;
    expect(stored.token_hash).toBe(hashAgentKey(token));
    expect(stored.encrypted_token).not.toContain(token);
    expect(
      await symmetricDecrypt({
        key: "isolated-security-test-secret-at-least-32:agent-keys",
        data: stored.encrypted_token,
      }),
    ).toBe(token);
    expect(stored.last_used_at).toBeNull();
    expect(await authenticateAgentKey(token)).toEqual({ id, role: "user" });
    expect(
      (
        await sql`SELECT last_used_at > timezone('UTC', now()) - interval '10 seconds' AS recent FROM agent_key WHERE user_id = ${id}`
      )[0].recent,
    ).toBe(true);
    await expect(authenticateAgentKey(`${token.slice(0, -1)}!`)).rejects.toThrow(
      "Invalid or expired",
    );
    await sql`UPDATE "user" SET banned = true WHERE id = ${id}`;
    await expect(authenticateAgentKey(token)).rejects.toThrow("Invalid or expired");
    await sql`UPDATE "user" SET banned = false, must_change_password = true WHERE id = ${id}`;
    await expect(authenticateAgentKey(token)).rejects.toThrow("Invalid or expired");
    await sql`UPDATE "user" SET must_change_password = false, role = 'admin' WHERE id = ${id}`;
    expect(await authenticateAgentKey(token)).toEqual({ id, role: "admin" });
    await sql`UPDATE agent_key SET expires_at = now() - interval '1 minute' WHERE user_id = ${id}`;
    await expect(authenticateAgentKey(token)).rejects.toThrow("Invalid or expired");
    await sql`DELETE FROM agent_key WHERE user_id = ${id}`;
    await expect(authenticateAgentKey(token)).rejects.toThrow("Invalid or expired");
  });
});
