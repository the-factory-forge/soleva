import { randomUUID } from "node:crypto";

import { expect, test } from "@playwright/test";
import { hashPassword } from "better-auth/crypto";
import postgres from "postgres";

import { testDatabaseURL } from "./database";

const id = randomUUID();
const email = `profile-${id}@example.test`;
const password = "Profile-test-password-123";
const replacementPassword = "Updated-profile-password-456";
const sql = postgres(testDatabaseURL, { max: 1 });

test.beforeAll(async () => {
  await sql`INSERT INTO "user" (id, name, email, role) VALUES (${id}, 'Profile tester', ${email}, 'user')`;
  await sql`INSERT INTO account (id, account_id, provider_id, user_id, password, updated_at) VALUES (${randomUUID()}, ${id}, 'credential', ${id}, ${await hashPassword(password)}, now())`;
});

test.afterAll(async () => {
  await sql`DELETE FROM "user" WHERE id = ${id}`;
  await sql.end();
});

test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ "x-forwarded-for": "192.0.2.5" });
  await context.route(
    /^https?:\/\/(?!(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:[/?#]|$))/,
    (route) => route.abort(),
  );
});

test("profile settings saves the current user's name and changes their password", async ({
  page,
  request,
}) => {
  await page.goto("/en/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Profile settings", exact: true })).toBeVisible();

  // The optional intranet shell must survive a direct public-page load and hydration.
  await page.goto("/en");
  await expect(page.getByRole("link", { name: "Profile settings", exact: true })).toBeVisible();
  await expect(page.getByText("Forged by The Corner Factory SA", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("link", { name: "Profile settings", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Profile settings", exact: true })).toBeVisible();

  await expect(page.getByRole("link", { name: "Dashboard", exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("readonly", "");

  await page.getByLabel("Full name", { exact: true }).fill("  Updated profile  ");
  const savedResponse = page.waitForResponse(
    (response) => response.request().method() === "POST" && response.url().includes("/_serverFn/"),
  );
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  const save = await savedResponse;
  expect(save.ok()).toBe(true);
  await expect(page.getByRole("heading", { name: "Updated profile", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue("Updated profile");
  expect(await sql`SELECT name, email, role FROM "user" WHERE id = ${id}`).toEqual([
    { name: "Updated profile", email, role: "user" },
  ]);

  // The mutation endpoint must enforce authentication independently of the page guard.
  const anonymousSave = await request.post(save.url(), {
    headers: {
      "content-type": save.request().headers()["content-type"],
      "x-tsr-serverFn": "true",
      origin: new URL(save.url()).origin,
      "sec-fetch-site": "same-origin",
    },
    data: save.request().postData() ?? "",
  });
  expect(anonymousSave.status()).toBe(401);

  await page.getByRole("tab", { name: "Security", exact: true }).click();
  await page.getByLabel("Current password", { exact: true }).fill("Incorrect-password-123");
  await page.getByLabel("New password", { exact: true }).fill(replacementPassword);
  await page.getByLabel("Confirm password", { exact: true }).fill(replacementPassword);
  await page.getByRole("button", { name: "Change password", exact: true }).click();
  await expect(
    page.getByText("Could not change the password. Check your current password."),
  ).toBeVisible();
  await page.getByLabel("Current password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Change password", exact: true }).click();
  await expect(page.getByText("Password changed successfully.")).toBeVisible();
  await expect(page.getByLabel("Current password", { exact: true })).toHaveValue("");
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);

  const login = await request.post("/api/auth/sign-in/email", {
    headers: { "x-forwarded-for": "192.0.2.6" },
    data: { email, password: replacementPassword },
  });
  expect(login.ok()).toBe(true);

  await page.goto("/fr/intranet");
  await expect(
    page.getByRole("heading", { name: "Paramètres du profil", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("profile-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByLabel("Nom complet", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: test.info().outputPath("profile-mobile.png"), fullPage: true });
});

test("employees can still replace their temporary password before entering profile settings", async ({
  page,
}) => {
  const employeeId = randomUUID();
  const employeeEmail = `onboarding-${employeeId}@example.test`;
  try {
    await sql`INSERT INTO "user" (id, name, email, role, must_change_password) VALUES (${employeeId}, 'New employee', ${employeeEmail}, 'user', true)`;
    await sql`INSERT INTO account (id, account_id, provider_id, user_id, password, updated_at) VALUES (${randomUUID()}, ${employeeId}, 'credential', ${employeeId}, ${await hashPassword(password)}, now())`;
    await page.goto("/en/login");
    await page.getByLabel("Email", { exact: true }).fill(employeeEmail);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/change-password$/);
    await page.getByLabel("Current password", { exact: true }).fill(password);
    await page.getByLabel("New password", { exact: true }).fill(replacementPassword);
    await page.getByLabel("Confirm password", { exact: true }).fill(replacementPassword);
    await page.getByRole("button", { name: "Change password", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Profile settings", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  } finally {
    await sql`DELETE FROM "user" WHERE id = ${employeeId}`;
  }
});
