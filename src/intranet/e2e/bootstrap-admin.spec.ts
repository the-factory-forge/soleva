import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import postgres from "postgres";

import { testDatabaseURL } from "./database";

const sql = postgres(testDatabaseURL, { max: 1 });
const baseline = await readFile(
  new URL("../../../drizzle/20260926103351_baseline/migration.sql", import.meta.url),
  "utf8",
);
const bootstrapMarker = "-- Drizzle runs this migration in a transaction.";
if (!baseline.includes(bootstrapMarker)) throw new Error("Missing bootstrap SQL in baseline");
const bootstrapMigration = baseline.slice(baseline.indexOf(bootstrapMarker));
const migration = bootstrapMigration;
function applyBootstrap(sql: postgres.Sql) {
  return sql.begin((tx) => tx.unsafe(bootstrapMigration));
}

test.afterAll(() => sql.end());

test("bootstrap only seeds an empty intranet and preserves changed credentials", async () => {
  await sql.begin(async (tx) => {
    // Temporary tables shadow the real tables without changing the E2E users.
    await tx`CREATE TEMP TABLE "user" (LIKE public."user" INCLUDING ALL) ON COMMIT DROP`;
    await tx`CREATE TEMP TABLE "account" (LIKE public."account" INCLUDING ALL) ON COMMIT DROP`;
    await tx.unsafe(migration);

    const [admin] = await tx`SELECT * FROM "user"`;
    const [account] = await tx`SELECT * FROM "account"`;
    expect(admin).toMatchObject({
      name: "admin",
      email: "admin@example.com",
      role: "admin",
      must_change_password: false,
    });
    expect(account).toMatchObject({
      account_id: admin.id,
      user_id: admin.id,
      provider_id: "credential",
    });
    expect(await verifyPassword({ hash: account.password, password: "admin" })).toBe(true);

    const changedPassword = await hashPassword("Changed-during-handover-123");
    await tx`UPDATE "account" SET password = ${changedPassword}`;
    await tx.unsafe(migration);
    expect(await tx`SELECT id FROM "user"`).toHaveLength(1);
    expect(await tx`SELECT password FROM "account"`).toEqual([{ password: changedPassword }]);

    await tx`TRUNCATE "account", "user"`;
    await tx`INSERT INTO "user" (id, name, email) VALUES ('existing', 'Existing user', 'existing@example.com')`;
    await tx.unsafe(migration);
    expect(await tx`SELECT id FROM "user"`).toEqual([{ id: "existing" }]);
    expect(await tx`SELECT id FROM "account"`).toHaveLength(0);
  });
});

test("SQL bootstrap only seeds an empty intranet and is atomic, repeatable, and concurrency safe", async () => {
  const schema = `bootstrap_${randomUUID().replaceAll("-", "")}`;
  const isolated = postgres(testDatabaseURL, { max: 2, connection: { search_path: schema } });
  await sql`CREATE SCHEMA ${sql(schema)}`;
  try {
    await isolated`CREATE TABLE "user" (LIKE public."user" INCLUDING ALL)`;
    await isolated`CREATE TABLE account (LIKE public.account INCLUDING ALL)`;
    await Promise.all([applyBootstrap(isolated), applyBootstrap(isolated)]);

    const users = await isolated`SELECT * FROM "user"`;
    const accounts = await isolated`SELECT * FROM account`;
    expect(users).toHaveLength(1);
    expect(accounts).toHaveLength(1);
    expect(users[0]).toMatchObject({
      email: "admin@example.com",
      role: "admin",
      email_verified: true,
      must_change_password: false,
    });
    expect(accounts[0]).toMatchObject({
      account_id: users[0].id,
      user_id: users[0].id,
      provider_id: "credential",
    });
    expect(await verifyPassword({ hash: accounts[0].password, password: "admin" })).toBe(true);

    const changedPassword = await hashPassword("Changed-during-handover-123");
    await isolated`UPDATE account SET password = ${changedPassword}`;
    await applyBootstrap(isolated);
    expect(await isolated`SELECT * FROM "user"`).toEqual(users);
    expect(await isolated`SELECT password FROM account`).toEqual([{ password: changedPassword }]);

    await isolated`TRUNCATE account, "user"`;
    await isolated`INSERT INTO "user" (id, name, email, role) VALUES ('employee', 'Employee', 'employee@example.test', 'user')`;
    await applyBootstrap(isolated);
    expect(await isolated`SELECT id FROM "user"`).toEqual([{ id: "employee" }]);
    expect(await isolated`SELECT id FROM account`).toHaveLength(0);

    await isolated`TRUNCATE "user"`;
    // Failure inserting the credential must not leave a user who cannot sign in.
    await isolated`ALTER TABLE account ADD CONSTRAINT reject_seed CHECK (provider_id <> 'credential')`;
    await expect(applyBootstrap(isolated)).rejects.toMatchObject({ code: "23514" });
    expect(await isolated`SELECT id FROM "user"`).toHaveLength(0);
    await isolated`ALTER TABLE account DROP CONSTRAINT reject_seed`;
    await applyBootstrap(isolated);
    expect(await isolated`SELECT email FROM "user"`).toEqual([{ email: "admin@example.com" }]);
    expect(await isolated`SELECT id FROM account`).toHaveLength(1);
  } finally {
    await isolated.end();
    await sql`DROP SCHEMA ${sql(schema)} CASCADE`;
  }
});

test("initial admin signs in without a forced password change", async ({ page, context }) => {
  await context.setExtraHTTPHeaders({ "x-forwarded-for": "192.0.2.4" });
  await context.route(
    /^https?:\/\/(?!(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:[/?#]|$))/,
    (route) => route.abort(),
  );
  await page.goto("/en/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("admin");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  await page.getByRole("link", { name: "Employees", exact: true }).click();
  await expect(page.getByRole("table")).toBeVisible();
  expect((await page.request.get("/api/auth/admin/list-users")).status()).toBe(200);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle navigation", exact: true }).click();
  const navigation = page.getByRole("dialog", { name: "Workspace navigation" });
  await expect(navigation.getByRole("link", { name: "Employees", exact: true })).toBeVisible();
  await navigation.getByRole("link", { name: "Profile settings", exact: true }).click();
  await expect(navigation).toBeHidden();
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
});
