import { createHash, randomUUID } from "node:crypto";
import { readFile, unlink } from "node:fs/promises";

import { hashPassword } from "better-auth/crypto";
import postgres from "postgres";

import dict from "../i18n/en.json" with { type: "json" };
import { testDatabaseURL } from "./database";
import { expect, test, clientIP } from "./test";

const id = randomUUID();
const adminEmail = `invitation-admin-${id}@example.test`;
const email = `invitation-${id}@example.test`;
const password = "Invitation-test-password-123";
const sql = postgres(testDatabaseURL, { max: 1 });
const mailPath = `.cache/e2e-emails/${createHash("sha256").update(email).digest("hex")}.json`;

async function readInvitation() {
  const message: { text: string; subject: string } = JSON.parse(await readFile(mailPath, "utf8"));
  expect(message.subject).toBe(dict.employees.invitationSubject);
  const url = new URL(
    message.text.match(/https?:\/\/[^\s]*\/api\/auth\/reset-password\/[^\s]+/)![0],
  );
  expect(new URL(url.searchParams.get("callbackURL")!).pathname).toBe("/en/reset-password");
  return { url: url.toString(), token: url.pathname.split("/").at(-1)! };
}

test.beforeAll(async () => {
  await sql`insert into "user" (id, name, email, email_verified, role) values (${id}, 'Invitation admin', ${adminEmail}, true, 'admin')`;
  await sql`insert into account (id, account_id, provider_id, user_id, password, updated_at) values (${randomUUID()}, ${id}, 'credential', ${id}, ${await hashPassword(password)}, now())`;
});
test.afterAll(async () => {
  await sql`delete from verification where value in (select id from "user" where email like ${`%${id}@example.test`})`;
  await sql`delete from "user" where email like ${`%${id}@example.test`}`;
  await sql.end();
  await unlink(mailPath).catch(() => {});
});

test("invitations report delivery failure, expire, replace old links and accept only once", async ({
  page,
  browser,
  baseURL,
}) => {
  await page.context().setExtraHTTPHeaders({ "x-forwarded-for": clientIP("192.0.2.70") });
  expect(
    (
      await page.request.post("/api/auth/sign-in/email", { data: { email: adminEmail, password } })
    ).ok(),
  ).toBe(true);
  await page.goto("/en/intranet/employees");
  await page.getByRole("button", { name: dict.employees.add, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: dict.employees.add, exact: true });
  await expect(dialog.locator('input[type="password"]')).toHaveCount(0);
  await dialog
    .getByRole("textbox", { name: dict.employees.name, exact: true })
    .fill("Pending invitation");
  await dialog
    .getByRole("textbox", { name: dict.employees.email, exact: true })
    .fill(`delivery-failure-${id}@example.test`);
  await dialog.getByRole("button", { name: dict.employees.save, exact: true }).click();
  await expect(dialog.getByRole("alert")).toHaveText(dict.employees.invitationFailed);
  await expect(dialog.locator("form")).toHaveCount(0);
  await dialog.getByRole("button", { name: dict.employees.close, exact: true }).last().click();
  const [invitee] =
    await sql`select id, must_change_password from "user" where email = ${`delivery-failure-${id}@example.test`}`;
  expect(invitee.must_change_password).toBe(true);
  expect(await sql`select id from account where user_id = ${invitee.id}`).toHaveLength(0);
  expect(
    (
      await page.request.post("/api/auth/admin/update-user", {
        headers: { origin: baseURL! },
        data: { userId: invitee.id, data: { email } },
      })
    ).ok(),
  ).toBe(true);
  await page.reload();
  const row = page.getByRole("row").filter({ hasText: email });
  const resend = row.getByRole("button", {
    name: `${dict.employees.sendInvitation} Pending invitation`,
    exact: true,
  });
  await resend.click();
  await expect.poll(async () => readFile(mailPath, "utf8").catch(() => "")).not.toBe("");
  const first = await readInvitation();
  const [stored] =
    await sql`select expires_at at time zone 'UTC' as expires_at from verification where identifier = ${`reset-password:${first.token}`}`;
  expect(new Date(stored.expires_at).getTime() - Date.now()).toBeGreaterThan(50 * 60 * 1000);
  expect(new Date(stored.expires_at).getTime() - Date.now()).toBeLessThanOrEqual(60 * 60 * 1000);
  const recipient = await browser.newContext({
    baseURL,
    extraHTTPHeaders: { "x-forwarded-for": clientIP("192.0.2.71") },
  });
  try {
    const accept = (token: string) =>
      recipient.request.post("/api/auth/reset-password", {
        data: { token, newPassword: password },
      });
    expect((await accept("invalid-invitation")).ok()).toBe(false);
    await sql`update verification set expires_at = now() - interval '1 minute' where identifier = ${`reset-password:${first.token}`}`;
    expect((await accept(first.token)).ok()).toBe(false);
    await resend.click();
    await expect.poll(async () => (await readInvitation()).token).not.toBe(first.token);
    const second = await readInvitation();
    await resend.click();
    await expect.poll(async () => (await readInvitation()).token).not.toBe(second.token);
    const third = await readInvitation();
    expect((await accept(second.token)).ok()).toBe(false);
    expect(
      (
        await page.request.post("/api/auth/admin/update-user", {
          headers: { origin: baseURL! },
          data: { userId: invitee.id, data: { name: "Pending invitation" } },
        })
      ).ok(),
    ).toBe(true);
    expect((await accept(third.token)).ok()).toBe(false);
    await resend.click();
    await expect.poll(async () => (await readInvitation()).token).not.toBe(third.token);
    const final = await readInvitation();
    expect(
      (
        await recipient.request.post("/api/auth/reset-password", {
          data: { token: final.token, newPassword: "short" },
        })
      ).ok(),
    ).toBe(false);
    expect(
      (await sql`select email_verified from "user" where id = ${invitee.id}`)[0].email_verified,
    ).toBe(false);
    const results = await Promise.all([accept(final.token), accept(final.token)]);
    expect(results.filter((result) => result.ok())).toHaveLength(1);
    expect((await accept(final.token)).ok()).toBe(false);
    const [activated] =
      await sql`select role, must_change_password, email_verified from "user" where id = ${invitee.id}`;
    expect(activated).toMatchObject({
      role: "user",
      must_change_password: false,
      email_verified: true,
    });
    expect(
      (await recipient.request.post("/api/auth/sign-in/email", { data: { email, password } })).ok(),
    ).toBe(true);
    expect((await recipient.request.get("/api/auth/admin/list-users")).status()).toBe(403);
  } finally {
    await recipient.close();
  }
});

test("failed automatic sign-in preserves activation and allows manual login", async ({ page }) => {
  for (const failure of ["response", "network"] as const) {
    const userId = randomUUID();
    const token = randomUUID();
    const recipientEmail = `fallback-${failure}-${id}@example.test`;
    await sql`insert into "user" (id, name, email, email_verified, role, must_change_password) values (${userId}, 'Invitation fallback', ${recipientEmail}, false, 'user', true)`;
    await sql`insert into verification (id, identifier, value, expires_at) values (${randomUUID()}, ${`reset-password:${token}`}, ${userId}, now() + interval '1 hour')`;
    await page.route("**/api/auth/sign-in/email", (route) =>
      failure === "network"
        ? route.abort()
        : route.fulfill({
            status: 429,
            contentType: "application/json",
            body: JSON.stringify({ message: "Try signing in again" }),
          }),
    );
    await page.goto(`/en/reset-password?invitation=true&token=${token}`);
    await page.getByLabel(dict.auth.newPassword, { exact: true }).fill(password);
    await page.getByRole("button", { name: dict.auth.invitationSubmit, exact: true }).click();
    await expect(page.getByText(dict.auth.invitationSuccess, { exact: true })).toBeVisible();
    expect(
      (await sql`select must_change_password from "user" where id = ${userId}`)[0]
        .must_change_password,
    ).toBe(false);
    expect(
      await sql`select id from verification where identifier = ${`reset-password:${token}`}`,
    ).toHaveLength(0);
    expect(await sql`select id from session where user_id = ${userId}`).toHaveLength(0);
    await page.unroute("**/api/auth/sign-in/email");
    expect(
      (
        await page.request.post("/api/auth/sign-in/email", {
          data: { email: recipientEmail, password },
        })
      ).ok(),
    ).toBe(true);
    expect((await (await page.request.get("/api/auth/get-session")).json()).user).toMatchObject({
      id: userId,
      emailVerified: true,
    });
    await page.context().clearCookies();
  }
});

test("invalid invitation lookups cannot reset a password or create a session", async ({ page }) => {
  const userId = randomUUID();
  const token = randomUUID();
  const recipientEmail = `invalid-lookup-${id}@example.test`;
  await sql`insert into "user" (id, name, email, email_verified, role, must_change_password) values (${userId}, 'Invalid invitation', ${recipientEmail}, false, 'user', true)`;
  await sql`insert into verification (id, identifier, value, expires_at) values (${randomUUID()}, ${`reset-password:${token}`}, ${userId}, now() - interval '1 hour')`;
  const authRequests: string[] = [];
  page.on("request", (request) => {
    if (
      request.url().includes("/api/auth/reset-password") ||
      request.url().includes("/api/auth/sign-in/email")
    )
      authRequests.push(request.url());
  });
  for (const state of ["unknown", "expired", "banned", "activated"] as const) {
    if (state === "banned") {
      await sql`update verification set expires_at = now() + interval '1 hour' where value = ${userId}`;
      await sql`update "user" set banned = true where id = ${userId}`;
    }
    if (state === "activated")
      await sql`update "user" set banned = false, must_change_password = false where id = ${userId}`;
    await page.goto(
      `/en/reset-password?invitation=true&token=${state === "unknown" ? "unknown-token" : token}`,
    );
    await page.getByLabel(dict.auth.newPassword, { exact: true }).fill(password);
    await page.getByRole("button", { name: dict.auth.invitationSubmit, exact: true }).click();
    await expect(page.getByRole("alert")).toContainText(dict.auth.resetError);
  }
  expect(authRequests).toEqual([]);
  expect(
    (await sql`select email_verified from "user" where id = ${userId}`)[0].email_verified,
  ).toBe(false);
  expect(await sql`select id from account where user_id = ${userId}`).toHaveLength(0);
  expect(await sql`select id from session where user_id = ${userId}`).toHaveLength(0);
});
