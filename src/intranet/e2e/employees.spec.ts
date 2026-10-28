import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import { expect, test, type Page } from "@playwright/test";
import { hashPassword } from "better-auth/crypto";
import postgres from "postgres";

import { testDatabaseURL } from "./database";

const id = randomUUID();
const adminEmail = `admin-${id}@example.test`;
const password = "Temporary-test-password-123";
const newPassword = "Replacement-test-password-456";
const sql = postgres(testDatabaseURL, { max: 1 });

async function login(page: Page, email = adminEmail, value = password) {
  await page.goto("/en/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(value);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
}

async function invitationURL(email: string) {
  const key = createHash("sha256").update(email).digest("hex");
  const message = JSON.parse(await readFile(`.cache/e2e-emails/${key}.json`, "utf8"));
  expect(message.to).toEqual([email]);
  return message.text.split("\n\n").at(-1);
}

async function invite(page: Page, email: string, name = "Invited employee") {
  await page.getByRole("button", { name: "Invite employee", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Invite employee", exact: true });
  await dialog.getByRole("textbox", { name: "Name", exact: true }).fill(name);
  await dialog.getByRole("textbox", { name: "Email", exact: true }).fill(email);
  await expect(dialog.getByLabel("Temporary password")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Send invitation", exact: true }).click();
  return dialog;
}

async function activate(page: Page, url: string, automatic = true) {
  await page.goto(url);
  await expect(
    page.getByRole("heading", { name: "Set up your account", exact: true }),
  ).toBeVisible();
  const token = new URL(page.url()).searchParams.get("token");
  await page.getByLabel("New password", { exact: true }).fill(newPassword);
  await page.getByRole("button", { name: "Activate account", exact: true }).click();
  if (automatic) {
    await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  } else {
    await expect(
      page.getByRole("status").filter({ hasText: "Your account is ready." }),
    ).toBeVisible();
    await expect(page.getByLabel("New password", { exact: true })).toHaveCount(0);
  }
  return token;
}

test.beforeAll(async () => {
  await sql`insert into "user" (id, name, email, email_verified, role) values (${id}, 'Test administrator', ${adminEmail}, true, 'admin')`;
  await sql`insert into account (id, account_id, provider_id, user_id, password, updated_at) values (${randomUUID()}, ${id}, 'credential', ${id}, ${await hashPassword(password)}, now())`;
});

test.afterAll(async () => {
  await sql`delete from "user" where email like ${`%${id}@example.test`}`;
  await sql.end();
});

test.beforeEach(async ({ context }, testInfo) => {
  await context.setExtraHTTPHeaders({ "x-forwarded-for": `192.0.2.${(testInfo.line % 200) + 1}` });
  await context.route(
    /^https?:\/\/(?!(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:[/?#]|$))/,
    (route) => route.abort(),
  );
});

test("invitations activate once, resend invalidates previous links and employees remain unauthorized", async ({
  page,
  browser,
  baseURL,
}) => {
  const email = `invited-${id}@example.test`;
  await login(page);
  await page.goto("/en/intranet/employees");
  const self = page.getByRole("row").filter({ hasText: adminEmail });
  await expect(
    self.getByRole("button", { name: "Delete Test administrator", exact: true }),
  ).toBeDisabled();
  const dialog = await invite(page, email);
  await expect(dialog).toHaveCount(0);
  const row = page.getByRole("row").filter({ hasText: email });
  await expect(row).toBeVisible();
  const previous = await invitationURL(email);
  const [account] =
    await sql`select id, must_change_password, email_verified from "user" where email = ${email}`;
  expect(account.must_change_password).toBe(true);
  expect(
    await sql`select id from account where user_id = ${account.id} and password is not null`,
  ).toHaveLength(0);
  await row
    .getByRole("button", { name: "Resend invitation to Invited employee", exact: true })
    .click();
  await expect(page.getByText("Invitation sent.", { exact: true })).toBeVisible();
  const current = await invitationURL(email);
  expect(current).not.toBe(previous);
  const context = await browser.newContext({
    baseURL,
    extraHTTPHeaders: { "x-forwarded-for": "192.0.2.82" },
  });
  try {
    const recipient = await context.newPage();
    await recipient.goto(previous);
    await expect(recipient.getByRole("alert")).toBeVisible();
    const token = await activate(recipient, current);
    expect(
      (
        await context.request.post("/api/auth/reset-password", {
          data: { token, newPassword: password },
        })
      ).ok(),
    ).toBe(false);
    const signedIn = await (await context.request.get("/api/auth/get-session")).json();
    expect(signedIn.user.email).toBe(email);
    expect((await context.request.get("/api/auth/admin/list-users")).status()).toBe(403);
    await recipient.goto("/it/intranet/employees");
    await expect(recipient).toHaveURL(/\/it\/access-denied$/);
    expect(
      await sql`select must_change_password, email_verified from "user" where id = ${account.id}`,
    ).toEqual([{ must_change_password: false, email_verified: true }]);
  } finally {
    await context.close();
  }
});

test("delivery failure keeps the account for retry; editing, verification and deletion preserve security", async ({
  page,
  browser,
  baseURL,
}) => {
  const email = `managed-${id}@example.test`;
  const changedEmail = `changed-${id}@example.test`;
  await login(page);
  await page.goto("/en/intranet/employees");
  const dialog = await invite(page, `delivery-failure-${id}@example.test`, "Managed employee");
  await expect(dialog.getByRole("alert")).toContainText("The account was created");
  await expect(dialog.getByRole("button", { name: "Send invitation", exact: true })).toHaveCount(0);
  await dialog.getByRole("button", { name: "Close", exact: true }).last().click();
  let row = page.getByRole("row").filter({ hasText: `delivery-failure-${id}@example.test` });
  await row.getByRole("button", { name: "Edit Managed employee", exact: true }).click();
  let editor = page.getByRole("dialog", { name: "Edit employee", exact: true });
  await editor.getByRole("textbox", { name: "Email", exact: true }).fill(email);
  await editor.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(editor).toHaveCount(0);
  row = page.getByRole("row").filter({ hasText: email });
  await row
    .getByRole("button", { name: "Resend invitation to Managed employee", exact: true })
    .click();
  await expect(page.getByText("Invitation sent.", { exact: true })).toBeVisible();
  const context = await browser.newContext({
    baseURL,
    extraHTTPHeaders: { "x-forwarded-for": "192.0.2.83" },
  });
  try {
    const recipient = await context.newPage();
    await activate(recipient, await invitationURL(email));
    await page.reload();
    await expect(row.getByRole("img", { name: "Email verified", exact: true })).toBeVisible();
    await expect(
      row.getByRole("button", { name: "Send verification email to Managed employee", exact: true }),
    ).toBeDisabled();
    await row.getByRole("button", { name: "Edit Managed employee", exact: true }).click();
    editor = page.getByRole("dialog", { name: "Edit employee", exact: true });
    await editor.getByRole("textbox", { name: "Name", exact: true }).fill("Renamed employee");
    await editor.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(editor).toHaveCount(0);
    await expect(row.getByRole("img", { name: "Email verified", exact: true })).toBeVisible();
    await row.getByRole("button", { name: "Edit Renamed employee", exact: true }).click();
    await editor.getByRole("textbox", { name: "Email", exact: true }).fill(changedEmail);
    await editor.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(editor).toHaveCount(0);
    row = page.getByRole("row").filter({ hasText: changedEmail });
    await row
      .getByRole("button", { name: "Send verification email to Renamed employee", exact: true })
      .click();
    await expect(page.getByText("Verification email sent.", { exact: true })).toBeVisible();
    await context.clearCookies();
    await recipient.goto(await invitationURL(changedEmail));
    await expect(recipient).toHaveURL(/\/en\/login\?/);
    await expect(recipient.getByLabel("Email", { exact: true })).toHaveValue(changedEmail);
    await expect(
      recipient.getByText("Your email address has been verified.", { exact: true }),
    ).toBeVisible();
    await login(recipient, changedEmail, newPassword);
    const [account] = await sql`select id from "user" where email = ${changedEmail}`;
    await page.reload();
    await row.getByRole("button", { name: "Delete Renamed employee", exact: true }).click();
    const confirmation = page.getByRole("dialog", { name: "Delete employee", exact: true });
    await confirmation.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: "Delete Renamed employee", exact: true }).click();
    await confirmation.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(confirmation).toHaveCount(0);
    await expect(row).toHaveCount(0);
    expect(await sql`select id from account where user_id = ${account.id}`).toHaveLength(0);
    expect(await sql`select id from session where user_id = ${account.id}`).toHaveLength(0);
    expect(await (await context.request.get("/api/auth/get-session")).json()).toBeNull();
  } finally {
    await context.close();
  }
});

test("search filters the full directory before pagination and survives navigation", async ({
  page,
}) => {
  const entries = Array.from({ length: 27 }, (_, index) => ({
    id: randomUUID(),
    name: `Directory ${String(index).padStart(2, "0")}`,
    email: `directory-${index}-${id}@example.test`,
    role: "user",
    email_verified: true,
  }));
  entries.push({
    id: randomUUID(),
    name: "ZZZ 100%_literal",
    email: `literal-${id}@example.test`,
    role: "user",
    email_verified: true,
  });
  await sql`insert into "user" ${sql(entries)}`;
  await login(page);
  await page.goto("/en/intranet/employees?panel=retained#team");
  const retainedURL = () => {
    const url = new URL(page.url());
    return { panel: url.searchParams.get("panel"), hash: url.hash };
  };
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get("offset")).toBe("25");
  expect(retainedURL()).toEqual({ panel: "retained", hash: "#team" });
  await page.getByRole("button", { name: "Search employees", exact: true }).click();
  const search = page.getByRole("searchbox", { name: "Search employees", exact: true });
  await search.fill("100%_");
  await expect(page.getByRole("row").filter({ hasText: "ZZZ 100%_literal" })).toBeVisible();
  await expect(page).toHaveURL(/q=100%25_/);
  expect(retainedURL()).toEqual({ panel: "retained", hash: "#team" });
  await page.reload();
  await expect(search).toHaveValue("100%_");
  await expect(page.getByRole("row").filter({ hasText: "ZZZ 100%_literal" })).toBeVisible();
  await page.goBack();
  await expect.poll(() => new URL(page.url()).searchParams.get("q") ?? "").toBe("");
  expect(new URL(page.url()).searchParams.get("offset")).toBeNull();
  expect(retainedURL()).toEqual({ panel: "retained", hash: "#team" });
  await page.goForward();
  await expect(search).toHaveValue("100%_");
  expect(retainedURL()).toEqual({ panel: "retained", hash: "#team" });
  await search.fill("");
  await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBeNull();
  expect(retainedURL()).toEqual({ panel: "retained", hash: "#team" });
  await page.getByRole("button", { name: "Search employees", exact: true }).click();
  await search.fill("100%_");
  await expect(page.locator('[data-slot="loading-indicator"]')).toHaveCSS("top", "80px");
  await page.screenshot({ path: test.info().outputPath("employees-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('[data-slot="loading-indicator"]')).toHaveCSS("top", "64px");
  await page.screenshot({ path: test.info().outputPath("employees-mobile.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.setViewportSize({ width: 1280, height: 720 });
  await search.fill("Directory");
  await page.getByRole("checkbox", { name: "Select row: Directory 00", exact: true }).check();
  await page.getByRole("checkbox", { name: "Select row: Directory 01", exact: true }).check();
  await page.getByRole("button", { name: "Delete selected items (2)", exact: true }).click();
  const confirmation = page.getByRole("dialog", { name: "Delete selected items?", exact: true });
  let releaseDelete = () => {};
  let notifyBlocked = () => {};
  const released = new Promise<void>((resolve) => {
    releaseDelete = resolve;
  });
  const blocked = new Promise<void>((resolve) => {
    notifyBlocked = resolve;
  });
  await page.route("**/_serverFn/**", async (route) => {
    if (route.request().method() === "POST") {
      notifyBlocked();
      await released;
    }
    await route.continue();
  });
  await confirmation.getByRole("button", { name: "Delete", exact: true }).click();
  await blocked;
  try {
    await expect(page.locator("tbody tr").filter({ hasText: "Directory 00" })).toBeVisible();
    await expect(page.locator("tbody tr").filter({ hasText: "Directory 01" })).toBeVisible();
    await expect(
      confirmation.getByRole("button", { name: "Please wait…", exact: true }),
    ).toBeDisabled();
  } finally {
    releaseDelete();
  }
  await expect(confirmation).toHaveCount(0);
  expect(
    await sql`select id from "user" where email in (${`directory-0-${id}@example.test`}, ${`directory-1-${id}@example.test`})`,
  ).toHaveLength(0);
});

test("activated invitations offer login if only session creation fails", async ({
  page,
  browser,
  baseURL,
}) => {
  const email = `fallback-${id}@example.test`;
  await login(page);
  await page.goto("/en/intranet/employees");
  await expect(await invite(page, email, "Fallback employee")).toHaveCount(0);
  const context = await browser.newContext({
    baseURL,
    extraHTTPHeaders: { "x-forwarded-for": "192.0.2.84" },
  });
  try {
    const recipient = await context.newPage();
    await recipient.route("**/api/auth/sign-in/email", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ message: "Session temporarily unavailable" }),
      }),
    );
    const token = await activate(recipient, await invitationURL(email), false);
    expect(
      await sql`select id from verification where identifier = ${`reset-password:${token}`}`,
    ).toHaveLength(0);
    await recipient.unroute("**/api/auth/sign-in/email");
    await login(recipient, email, newPassword);
  } finally {
    await context.close();
  }
});
