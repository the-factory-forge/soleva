import { createHash, randomUUID } from "node:crypto";
import { readFile, unlink } from "node:fs/promises";

import { expect, test } from "@playwright/test";
import { hashPassword } from "better-auth/crypto";
import postgres from "postgres";

import { testDatabaseURL } from "./database";

const sql = postgres(testDatabaseURL, { max: 1 });
const id = randomUUID();
const email = `login-${id}@example.test`;
const resetId = randomUUID();
const resetEmail = `reset-${id}@example.test`;
const failedId = randomUUID();
const failedEmail = `delivery-failure-${id}@example.test`;
const password = "Login-test-password-123";
const newPassword = "Reset-test-password-456";
const mailPath = `.cache/e2e-emails/${createHash("sha256").update(resetEmail).digest("hex")}.json`;

async function resetURL() {
  const message: { subject: string; text: string } = JSON.parse(await readFile(mailPath, "utf8"));
  expect(message.subject).toBe("Reset your password");
  return message.text.split("\n\n").at(-1)!;
}

test.beforeAll(async () => {
  for (const [userId, userEmail] of [
    [id, email],
    [resetId, resetEmail],
    [failedId, failedEmail],
  ]) {
    await sql`INSERT INTO "user" (id, name, email, role, must_change_password) VALUES (${userId}, 'Login tester', ${userEmail}, 'user', ${userId === resetId})`;
    await sql`INSERT INTO account (id, account_id, provider_id, user_id, password, updated_at) VALUES (${randomUUID()}, ${userId}, 'credential', ${userId}, ${await hashPassword(password)}, now())`;
  }
});

test.afterAll(async () => {
  await sql`DELETE FROM verification WHERE value IN (${id}, ${resetId}, ${failedId})`;
  await sql`DELETE FROM "user" WHERE id IN (${id}, ${resetId}, ${failedId})`;
  await sql.end();
  await unlink(mailPath).catch(() => {});
});

test.beforeEach(async ({ context }, testInfo) => {
  await context.setExtraHTTPHeaders({
    "x-forwarded-for": testInfo.title.startsWith("password recovery") ? "192.0.2.22" : "192.0.2.20",
  });
  await context.route(
    /^https?:\/\/(?!(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:[/?#]|$))/,
    (route) => route.abort(),
  );
});

test("login is responsive, accessible in all languages, and remembers a session only when requested", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.addInitScript(() =>
    localStorage.setItem(
      "soleva-cookie-consent",
      JSON.stringify({ necessary: true, analytics: false, marketing: false }),
    ),
  );
  for (const [locale, heading, _loginLabel, capsLockLabel] of [
    ["fr", "Content de vous revoir", "Se connecter", "Verrouillage des majuscules activé"],
    ["de", "Willkommen zurück", "Anmelden", "Feststelltaste ist aktiviert"],
    ["en", "Welcome back", "Log in", "Caps Lock is on"],
    ["it", "Bentornato", "Accedi", "Blocco maiuscole attivo"],
  ]) {
    await page.goto(`/${locale}`);
    const footerLogin = page.locator(`footer a[href="/${locale}/intranet"]`);
    await expect(footerLogin).toHaveAttribute("href", `/${locale}/intranet`);
    await footerLogin.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/login$`));
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.locator("#main-content")).toBeVisible();
    const passwordField = page.locator("#password");
    await passwordField.focus();
    await passwordField.dispatchEvent("keydown", { key: "A", modifierCapsLock: true });
    await expect(page.locator("#password-caps-lock svg")).toBeVisible();
    await expect(passwordField).toHaveAccessibleDescription(capsLockLabel);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.screenshot({
      path: test.info().outputPath(`login-${locale}-mobile.png`),
      fullPage: true,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  await page.goto("/en/login");
  await page.screenshot({
    path: test.info().outputPath("login-desktop.png"),
    fullPage: true,
    animations: "disabled",
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.screenshot({
    path: test.info().outputPath("login-dark.png"),
    fullPage: true,
    animations: "disabled",
  });
  await page.getByLabel("Email", { exact: true }).fill(email);
  const passwordInput = page.getByLabel("Password", { exact: true });
  await passwordInput.fill("Incorrect-password");
  const capsLockIcon = page.locator("#password-caps-lock svg");
  await passwordInput.dispatchEvent("keydown", { key: "A", shiftKey: true });
  await expect(capsLockIcon).toHaveCount(0);
  await passwordInput.dispatchEvent("keydown", { key: "CapsLock", modifierCapsLock: true });
  await expect(capsLockIcon).toBeVisible();
  await passwordInput.dispatchEvent("keyup", { key: "CapsLock", modifierCapsLock: false });
  await expect(capsLockIcon).toHaveCount(0);
  await passwordInput.dispatchEvent("click", { modifierCapsLock: true });
  await expect(capsLockIcon).toBeVisible();
  await passwordInput.screenshot({ path: test.info().outputPath("password-caps-lock-dark.png") });
  await page.getByRole("button", { name: "Show password", exact: true }).click();
  await expect(capsLockIcon).toHaveCount(0);
  await expect(passwordInput).toHaveAttribute("type", "text");
  await passwordInput.focus();
  await passwordInput.dispatchEvent("keyup", { key: "A", modifierCapsLock: true });
  await expect(capsLockIcon).toBeVisible();
  await expect(passwordInput).toHaveValue("Incorrect-password");
  await page.getByRole("button", { name: "Hide password", exact: true }).click();
  await expect(passwordInput).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Unable to sign in.");
  await passwordInput.focus();
  await passwordInput.dispatchEvent("keydown", { key: "A", modifierCapsLock: true });
  await expect(passwordInput).toHaveAccessibleDescription(/Unable to sign in.*Caps Lock is on/);
  await expect(page).toHaveURL(/\/en\/login$/);
  await expect(page.getByLabel("Remember me", { exact: true })).not.toBeChecked();
  await passwordInput.fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  await page.goto("/en");
  await page.locator('footer a[href="/en/intranet"]').click();
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "better-auth.session_token")
      ?.expires,
  ).toBe(-1);
  await context.clearCookies();
  await page.goto("/en/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Remember me", { exact: true }).check();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "better-auth.session_token")
      ?.expires,
  ).toBeGreaterThan(Date.now() / 1000);
  await page.goto("/en/login");
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  expect(errors).toEqual([]);
});

test("password recovery uses single-use expiring links, preserves locale and revokes sessions", async ({
  page,
  request,
  baseURL,
}) => {
  if (!baseURL) throw new Error("Missing test base URL");
  const headers = {
    "x-forwarded-for": "192.0.2.21",
    origin: baseURL,
    "sec-fetch-site": "same-origin",
  };
  // Keep an old authenticated session to prove that recovery revokes it.
  expect(
    (
      await request.post("/api/auth/sign-in/email", {
        headers,
        data: { email: resetEmail, password },
      })
    ).ok(),
  ).toBe(true);
  await page.goto("/en/login");
  await page.getByRole("link", { name: "Forgot password?", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Forgot your password?", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill(resetEmail);
  await page.getByRole("button", { name: "Send reset link", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Check your email", exact: true })).toBeVisible();
  const url = await resetURL();
  expect(new URL(url).origin).toBe(baseURL);
  const identifier = `reset-password:${new URL(url).pathname.split("/").at(-1)}`;

  // Existing, unknown and undeliverable accounts receive the same public response.
  const unknown = await request.post("/api/auth/request-password-reset", {
    headers,
    data: { email: `unknown-${id}@example.test`, redirectTo: "/en/reset-password" },
  });
  const failed = await request.post("/api/auth/request-password-reset", {
    headers,
    data: { email: failedEmail, redirectTo: "/en/reset-password" },
  });
  expect(unknown.status()).toBe(200);
  expect(failed.status()).toBe(200);
  expect(await unknown.json()).toEqual(await failed.json());

  await page.goto(url);
  const token = new URL(page.url()).searchParams.get("token");
  expect(token).toBeTruthy();
  await page.getByRole("button", { name: /^Language/ }).click();
  await page.getByRole("menuitem", { name: "Deutsch", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Neues Passwort festlegen", exact: true }),
  ).toBeVisible();
  expect(new URL(page.url()).searchParams.get("token")).toBe(token);
  await page.getByRole("button", { name: /^Sprache/ }).click();
  await page.getByRole("menuitem", { name: "English", exact: true }).click();
  await page.getByLabel("New password", { exact: true }).fill(newPassword);
  await page.getByLabel("Confirm password", { exact: true }).fill("Different-password");
  await page.getByRole("button", { name: "Save new password", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Passwords do not match.");
  await page.getByLabel("Confirm password", { exact: true }).fill(newPassword);
  await page.getByRole("button", { name: "Save new password", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Your password has been reset." }),
  ).toBeVisible();
  expect(await (await request.get("/api/auth/get-session", { headers })).json()).toBeNull();
  expect(await sql`SELECT must_change_password FROM "user" WHERE id = ${resetId}`).toEqual([
    { must_change_password: false },
  ]);
  expect(await sql`SELECT id FROM verification WHERE identifier = ${identifier}`).toHaveLength(0);
  expect(
    (
      await request.post("/api/auth/reset-password", {
        headers,
        data: { token, newPassword: password },
      })
    ).ok(),
  ).toBe(false);
  expect(
    (
      await request.post("/api/auth/sign-in/email", {
        headers,
        data: { email: resetEmail, password },
      })
    ).ok(),
  ).toBe(false);
  await page.getByRole("link", { name: "Back to sign in", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill(resetEmail);
  await page.getByLabel("Password", { exact: true }).fill(newPassword);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);

  const expiredRequest = await request.post("/api/auth/request-password-reset", {
    headers,
    data: { email: resetEmail, redirectTo: "/en/reset-password" },
  });
  expect(expiredRequest.ok()).toBe(true);
  const expiredURL = await resetURL();
  const expiredToken = new URL(expiredURL).pathname.split("/").at(-1)!;
  await sql`UPDATE verification SET expires_at = now() - interval '1 minute' WHERE identifier = ${`reset-password:${expiredToken}`}`;
  await page.goto(expiredURL);
  await expect(page.getByRole("alert")).toContainText("This reset link is invalid or has expired.");
  const expiredReset = await request.post("/api/auth/reset-password", {
    headers,
    data: { token: expiredToken, newPassword: password },
  });
  expect(expiredReset.status()).toBe(400);
  expect(await expiredReset.json()).toMatchObject({ code: "INVALID_TOKEN" });
  const externalRedirect = await request.post("/api/auth/request-password-reset", {
    headers: { ...headers, "x-forwarded-for": "192.0.2.23" },
    data: { email: resetEmail, redirectTo: "https://untrusted.example/reset" },
  });
  expect(externalRedirect.status()).toBe(403);
});

test("sign-out failure retains the session and a successful retry revokes it", async ({
  page,
  context,
}) => {
  await context.setExtraHTTPHeaders({ "x-forwarded-for": "192.0.2.24" });
  await page.goto("/en/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  let calls = 0;
  await page.route("**/api/auth/sign-out", async (route) => {
    if (++calls === 1) {
      return route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ code: "UNAVAILABLE", message: "Try again" }),
      });
    }
    return route.continue();
  });
  await page.getByRole("button", { name: "Account menu", exact: true }).click();
  await page.getByRole("menuitem", { name: "Sign out", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Could not sign out");
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  expect(
    (await context.cookies()).some((cookie) => cookie.name === "better-auth.session_token"),
  ).toBe(true);
  await page.getByRole("button", { name: "Account menu", exact: true }).click();
  await page.getByRole("menuitem", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/login$/);
  expect(calls).toBe(2);
  expect(
    (await context.cookies()).some((cookie) => cookie.name === "better-auth.session_token"),
  ).toBe(false);
  await page.goto("/en/intranet");
  await expect(page).toHaveURL(/\/en\/login$/);
});

test("Google is the only social provider and a failed request can be retried", async ({
  page,
  request,
  baseURL,
}) => {
  test.skip(
    process.env.E2E_GOOGLE !== "1",
    "Run with E2E_GOOGLE=1 for local fake Google credentials.",
  );
  await page.goto("/fr/login");
  await expect(page.getByRole("button", { name: /GitHub/ })).toHaveCount(0);
  const google = page.getByRole("button", { name: "Continuer avec Google", exact: true });
  await expect(google).toBeVisible();
  const github = await request.post("/api/auth/sign-in/social", {
    headers: { origin: baseURL!, "sec-fetch-site": "same-origin" },
    data: { provider: "github", callbackURL: "/fr/intranet" },
  });
  expect(github.status()).toBe(404);
  expect((await github.json()).code).toBe("PROVIDER_NOT_FOUND");
  let calls = 0;
  await page.route("**/api/auth/sign-in/social", (route) => {
    expect(route.request().postDataJSON()).toMatchObject({
      provider: "google",
      callbackURL: "/fr/intranet",
    });
    if (++calls === 1) {
      return route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ code: "UNAVAILABLE", message: "Try again" }),
      });
    }
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ url: `${baseURL}/fr/login?google=fake`, redirect: true }),
    });
  });
  await google.click();
  await expect(page.getByRole("alert")).toContainText("Impossible de vous connecter avec Google");
  await expect(google).toBeEnabled();
  await google.click();
  await expect(page).toHaveURL(/\/fr\/login\?google=fake$/);
  expect(calls).toBe(2);
});
test("auth forms wait for hydration and keep POST fallbacks without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/fr/login");
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("readonly", "");
    await expect(page.getByLabel("Mot de passe", { exact: true })).toHaveAttribute("readonly", "");
    await expect(page.getByRole("button", { name: "Se connecter", exact: true })).toBeDisabled();
    await expect(page.locator("form")).toHaveAttribute("method", "post");
    await page.goto("/en/forgot-password");
    await expect(page.getByRole("button", { name: "Send reset link", exact: true })).toBeDisabled();
    await expect(page.locator("form")).toHaveAttribute("method", "post");
  } finally {
    await context.close();
  }
});
