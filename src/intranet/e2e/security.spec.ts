import { createHash, randomUUID } from "node:crypto";

import { expect, test, type APIRequestContext, type Response } from "@playwright/test";
import { hashPassword } from "better-auth/crypto";
import postgres from "postgres";

import { testDatabaseURL } from "./database";

const sql = postgres(testDatabaseURL, { max: 1 });
const password = "Security-test-password-123";
const users: string[] = [];

async function user() {
  const id = randomUUID();
  users.push(id);
  const email = `${id}@example.test`;
  await sql`INSERT INTO "user" (id, name, email, role) VALUES (${id}, 'Security tester', ${email}, 'user')`;
  await sql`INSERT INTO account (id, account_id, provider_id, user_id, password, updated_at) VALUES (${randomUUID()}, ${id}, 'credential', ${id}, ${await hashPassword(password)}, now())`;
  return { id, email };
}
async function replay(request: APIRequestContext, response: Response, data: string) {
  return request.post(response.url(), {
    headers: {
      "content-type": response.request().headers()["content-type"],
      "x-tsr-serverFn": "true",
      origin: new URL(response.url()).origin,
      "sec-fetch-site": "same-origin",
    },
    data,
  });
}

test.afterAll(async () => {
  for (const id of users) await sql`DELETE FROM "user" WHERE id = ${id}`;
  await sql.end();
});
test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ "x-forwarded-for": "192.0.2.40" });
  await context.route(
    /^https?:\/\/(?!(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:[/?#]|$))/,
    (route) => route.abort(),
  );
});

test("named encrypted keys can be created, expire and be deleted only by their owner", async ({
  page,
  request,
}) => {
  const owner = await user();
  await page.goto("/en/login");
  await page.getByLabel("Email", { exact: true }).fill(owner.email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect.poll(async () => page.url()).not.toContain("/login");
  await page.goto("/en/intranet");
  await page.getByRole("tab", { name: "Security", exact: true }).click();
  await expect(page.getByText("You signed in with Email and password")).toBeVisible();
  await page.getByRole("button", { name: "Reset password", exact: true }).click();
  await expect(page.getByRole("button", { name: "Reset email sent", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Create key", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name", { exact: true }).fill("Local integration");
  await dialog.getByLabel("Expiry date and time").fill("2020-01-01T12:00");
  await dialog.getByRole("button", { name: "Create key", exact: true }).click();
  await expect(dialog.getByRole("alert")).toBeVisible();
  const date = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 16);
  await dialog.getByLabel("Expiry date and time").fill(date);
  const createdResponse = page.waitForResponse(
    (r) => r.request().method() === "POST" && r.url().includes("/_serverFn/"),
  );
  await dialog.getByRole("button", { name: "Create key", exact: true }).click();
  const created = await createdResponse;
  const secret = await dialog.getByLabel("New agent key").inputValue();
  expect(secret).toMatch(/^forge_key_[A-Za-z0-9_-]{43}$/);
  const [key] = await sql`SELECT * FROM agent_key WHERE user_id = ${owner.id}`;
  expect(key.encrypted_token).not.toContain(secret);
  expect(key.token_hash).toBe(createHash("sha256").update(secret).digest("hex"));
  expect(key.last_used_at).toBeNull();
  expect((await replay(request, created, created.request().postData()!)).status()).toBe(401);
  await dialog.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByRole("row", { name: /Local integration Active/ })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Never", exact: true })).toBeVisible();
  await expect(page.getByLabel("New agent key")).toHaveCount(0);

  await sql`UPDATE agent_key SET expires_at = now() - interval '1 day', last_used_at = now() - interval '2 days' WHERE id = ${key.id}`;
  await page.reload();
  const keysResponse = page.waitForResponse(
    async (response) =>
      response.request().method() === "GET" &&
      response.url().includes("/_serverFn/") &&
      (await response.text()).includes(key.id),
  );
  await page.getByRole("tab", { name: "Security", exact: true }).click();
  const metadata = await (await keysResponse).text();
  for (const privateValue of [secret, key.token_hash, key.encrypted_token])
    expect(metadata).not.toContain(privateValue);
  await expect(page.getByRole("row", { name: /Local integration Expired/ })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Never", exact: true })).toHaveCount(0);

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: test.info().outputPath(`security-${width}.png`),
      fullPage: true,
      animations: "disabled",
    });
  }
  await page.getByRole("button", { name: "Delete Local integration", exact: true }).click();
  const deletedResponse = page.waitForResponse(
    (r) => r.request().method() === "POST" && r.url().includes("/_serverFn/"),
  );
  await page.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  const deleted = await deletedResponse;
  await expect(page.getByText("No agent keys yet.", { exact: false })).toBeVisible();
  expect(await sql`SELECT id FROM agent_key WHERE id = ${key.id}`).toHaveLength(0);
  const other = await user();
  const otherKey = randomUUID();
  await sql`INSERT INTO agent_key (id, user_id, name, token_hash, encrypted_token, expires_at) VALUES (${otherKey}, ${other.id}, 'Private key', ${randomUUID()}, 'fixture', now() + interval '1 day')`;
  expect(
    (
      await replay(page.request, deleted, deleted.request().postData()!.replace(key.id, otherKey))
    ).ok(),
  ).toBe(false);
  expect(await sql`SELECT id FROM agent_key WHERE id = ${otherKey}`).toHaveLength(1);
  for (const [locale, tab, heading] of [
    ["fr", "Sécurité", "Clés d’agent"],
    ["de", "Sicherheit", "Agentenschlüssel"],
    ["it", "Sicurezza", "Chiavi agente"],
  ]) {
    await page.goto(`/${locale}/intranet`);
    await page.getByRole("tab", { name: tab, exact: true }).click();
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test("older OAuth sessions load and can revoke other owned sessions without exposing credentials", async ({
  page,
}) => {
  const owner = await user();
  await page.goto("/en/login");
  await page.getByLabel("Email", { exact: true }).fill(owner.email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect.poll(async () => page.url()).not.toContain("/login");
  await page.goto("/en/intranet");
  await expect(page.getByRole("tab", { name: "Security", exact: true })).toBeVisible();
  await sql`UPDATE account SET provider_id = 'github', password = null WHERE user_id = ${owner.id}`;
  await sql`UPDATE session SET created_at = now() - interval '2 days', updated_at = now(), sign_in_method = null WHERE user_id = ${owner.id}`;
  const [current] = await sql`SELECT id FROM session WHERE user_id = ${owner.id}`;
  const otherSession = randomUUID();
  const otherToken = randomUUID();
  await sql`INSERT INTO session (id, token, user_id, expires_at, updated_at, user_agent) VALUES (${otherSession}, ${otherToken}, ${owner.id}, now() + interval '3 days', now(), 'Second device')`;
  const securityResponse = page.waitForResponse(
    async (response) =>
      response.request().method() === "GET" &&
      response.url().includes("/_serverFn/") &&
      (await response.text()).includes("providers"),
  );
  await page.getByRole("tab", { name: "Security", exact: true }).click();
  const metadata = await (await securityResponse).text();
  expect(metadata).toContain(otherSession);
  expect(metadata).not.toContain(otherToken);
  await expect(page.getByText("GitHub", { exact: true })).toBeVisible();
  await expect(
    page.getByText("This session predates sign-in tracking.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset password", exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Current password", { exact: true })).toHaveCount(0);
  const nativeList = await page.request.get("/api/auth/list-sessions");
  expect(nativeList.status()).toBe(403);
  expect((await nativeList.json()).code).toBe("SESSION_NOT_FRESH");
  const revokeResponse = page.waitForResponse(
    (r) => r.request().method() === "POST" && r.url().includes("/_serverFn/"),
  );
  await page.getByRole("tabpanel").getByRole("button", { name: "Sign out", exact: true }).click();
  const revoked = await revokeResponse;
  expect(revoked.ok()).toBe(true);
  await expect(page.getByText("Second device", { exact: true })).toHaveCount(0);
  expect(await sql`SELECT id FROM session WHERE id = ${otherSession}`).toHaveLength(0);
  expect(
    (
      await replay(
        page.request,
        revoked,
        revoked.request().postData()!.replace(otherSession, current.id),
      )
    ).ok(),
  ).toBe(false);
  expect(await sql`SELECT id FROM session WHERE id = ${current.id}`).toHaveLength(1);

  const other = await user();
  const foreignSession = randomUUID();
  await sql`INSERT INTO session (id, token, user_id, expires_at, updated_at) VALUES (${foreignSession}, ${randomUUID()}, ${other.id}, now() + interval '3 days', now())`;
  expect(
    (
      await replay(
        page.request,
        revoked,
        revoked.request().postData()!.replace(otherSession, foreignSession),
      )
    ).ok(),
  ).toBe(false);
  expect(await sql`SELECT id FROM session WHERE id = ${foreignSession}`).toHaveLength(1);
  await sql`UPDATE session SET sign_in_method = 'github' WHERE id = ${current.id}`;
  await page.reload();
  await page.getByRole("tab", { name: "Security", exact: true }).click();
  await expect(page.getByText("You signed in with GitHub", { exact: true })).toBeVisible();
  await sql`UPDATE session SET impersonated_by = ${other.id} WHERE id = ${current.id}`;
  await page.reload();
  await page.getByRole("tab", { name: "Security", exact: true }).click();
  await expect(page.getByRole("button", { name: "Create key", exact: true })).toBeDisabled();
  await expect(
    page.getByText("Could not load your account security.", { exact: false }),
  ).toBeVisible();
});
