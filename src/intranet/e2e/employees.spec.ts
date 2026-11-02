import { createHash, randomUUID } from "node:crypto";
import { readFile, unlink } from "node:fs/promises";

import { type Page } from "@playwright/test";
import { hashPassword } from "better-auth/crypto";
import postgres from "postgres";

import { testDatabaseURL } from "./database";
import { expect, test, clientIP } from "./test";

const id = randomUUID();
const adminEmail = `admin-${id}@example.test`;
const password = "Temporary-test-password-123";
const newPassword = "Replacement-test-password-456";
const sql = postgres(testDatabaseURL, { max: 1 });

async function login(page: Page, email: string, value = password) {
  await page.goto("/en/login");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(value);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}

test.beforeAll(async () => {
  await sql`insert into "user" (id, name, email, email_verified, role) values (${id}, 'Test administrator', ${adminEmail}, true, 'admin')`;
  await sql`insert into account (id, account_id, provider_id, user_id, password, updated_at) values (${randomUUID()}, ${id}, 'credential', ${id}, ${await hashPassword(password)}, now())`;
});

test.afterAll(async () => {
  await sql`delete from "user" where email like ${`%${id}@example.test`}`;
  await sql.end();
});

test.beforeEach(async ({ context }) => {
  await context.route(
    /^https?:\/\/(?!(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:[/?#]|$))/,
    (route) => route.abort(),
  );
});

test("login is localized and public registration is disabled", async ({ page, request }) => {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/fr\/login$/);
  await expect(page.getByRole("heading", { name: "Content de vous revoir" })).toBeVisible();
  await expect(page.locator('a[href*="signup"]')).toHaveCount(0);
  const signup = await request.post("/api/auth/sign-up/email", {
    data: { name: "Uninvited", email: `uninvited-${id}@example.test`, password },
  });
  expect(signup.ok()).toBe(false);
  const list = await request.get("/api/auth/admin/list-users");
  expect(list.status()).toBe(401);
});

test("admins invite employees; onboarding and disabling access are enforced", async ({
  page,
  browser,
  baseURL,
}) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  await login(page, adminEmail);
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  await page.getByRole("link", { name: "Employees", exact: true }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await page.goto("/en/intranet/employees/new");
  await expect(page).toHaveURL(/\/en\/intranet\/employees\/?$/);
  const create = page.getByRole("button", { name: "Invite user", exact: true });
  await create.click();
  await page
    .getByRole("dialog", { name: "Invite user", exact: true })
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(create).toBeFocused();

  for (const role of ["user", "admin"]) {
    const email = `${role}-employee-${id}@example.test`;
    const name = `New ${role}`;
    await page.getByRole("button", { name: "Invite user", exact: true }).click();
    await page.getByRole("textbox", { name: "Name", exact: true }).fill(name);
    await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
    if (role === "user") {
      const creation = page.getByRole("dialog", { name: "Invite user", exact: true });
      await creation.getByRole("textbox", { name: "Email", exact: true }).fill(adminEmail);
      await creation.getByRole("button", { name: "Send invitation", exact: true }).click();
      await expect(creation.getByRole("alert")).toContainText("Could not add this employee.");
      await expect(creation.getByRole("textbox", { name: "Name", exact: true })).toHaveValue(name);
      await creation.getByRole("textbox", { name: "Email", exact: true }).fill(email);
    }
    // The ordinary employee role is selected without any extra action.
    await expect(page.getByLabel("Role", { exact: true })).toHaveValue("user");
    if (role === "admin") await page.getByLabel("Role", { exact: true }).selectOption("admin");
    await page
      .getByRole("dialog", { name: "Invite user", exact: true })
      .getByRole("button", { name: "Send invitation", exact: true })
      .click();
    await expect(page.getByRole("dialog", { name: "Invite user", exact: true })).toHaveCount(0);
    const row = page.getByRole("row").filter({ hasText: email });
    await expect(row).toBeVisible();
    await expect(
      row.getByRole("cell", { name: role === "admin" ? "Admin" : "User", exact: true }),
    ).toBeVisible();

    const employee = await browser.newContext({
      baseURL,
      // Model separate clients without sharing Better Auth's per-IP login limit.
      extraHTTPHeaders: {
        "x-forwarded-for": clientIP(role === "admin" ? "192.0.2.2" : "192.0.2.3"),
      },
    });
    const employeePage = await employee.newPage();
    const message: { text: string; html: string } = JSON.parse(
      await readFile(
        `.cache/e2e-emails/${createHash("sha256").update(email).digest("hex")}.json`,
        "utf8",
      ),
    );
    expect(message.html).toContain("Soleva");
    expect(message.html).toContain("#ff803e");
    expect(message.html).toContain("/images/soleva-icon.png");
    const invitationURL = message.text.match(
      /https?:\/\/[^\s]*\/api\/auth\/reset-password\/[^\s]+/,
    )![0];
    const [invited] = await sql`select id from "user" where email = ${email}`;
    expect(await sql`select id from account where user_id = ${invited.id}`).toHaveLength(0);
    expect((await employee.request.get("/api/auth/admin/list-users")).status()).toBe(401);
    await employeePage.goto(invitationURL);
    await expect(employeePage.locator('input[type="password"]')).toHaveCount(1);
    await employeePage.getByLabel("New password", { exact: true }).fill(newPassword);
    await employeePage.getByRole("button", { name: "Activate account", exact: true }).click();
    await expect(employeePage).toHaveURL(/\/en\/intranet\/?$/);
    await expect
      .poll(
        async () =>
          (await sql`SELECT must_change_password FROM "user" WHERE email = ${email}`)[0]
            ?.must_change_password,
      )
      .toBe(false);
    await employeePage.reload();
    await expect(employeePage).toHaveURL(/\/en\/intranet\/?$/);

    expect((await (await employee.request.get("/api/auth/get-session")).json()).user).toMatchObject(
      { id: invited.id, emailVerified: true },
    );
    await page.reload();
    await expect(row.getByRole("button", { name: "Email verified", exact: true })).toBeVisible();

    const list = await employee.request.get("/api/auth/admin/list-users");
    expect(list.status()).toBe(role === "admin" ? 200 : 403);
    if (role === "user") {
      await expect(employeePage.getByRole("link", { name: "Employees", exact: true })).toHaveCount(
        0,
      );
      for (const locale of ["en", "fr", "de"]) {
        for (const path of ["employees", "employees/new"]) {
          await employeePage.goto(`/${locale}/intranet/${path}`);
          await expect(employeePage).toHaveURL(new RegExp(`/${locale}/access-denied$`));
          await expect(employeePage.getByRole("table")).toHaveCount(0);
          await expect(employeePage.locator("#employee-email")).toHaveCount(0);
        }
      }
      await expect(row.getByRole("button", { name: /Enable access|Disable access/ })).toHaveCount(
        0,
      );
      const [target] = await sql`select id from "user" where email = ${email}`;
      // Access changes remain a server operation, separate from list actions.
      expect(
        (
          await page.request.post("/api/auth/admin/ban-user", {
            data: { userId: target.id },
            headers: { origin: new URL(page.url()).origin },
          })
        ).ok(),
      ).toBe(true);
      await page.reload();
      await expect(row.getByRole("cell", { name: "Disabled", exact: true })).toBeVisible();
      expect(await (await employee.request.get("/api/auth/get-session")).json()).toBeNull();
      await employeePage.goto("/en/intranet");
      await expect(employeePage).toHaveURL(/\/en\/login$/);
      expect(
        (
          await page.request.post("/api/auth/admin/unban-user", {
            data: { userId: target.id },
            headers: { origin: new URL(page.url()).origin },
          })
        ).ok(),
      ).toBe(true);
      await page.reload();
      await expect(row.getByRole("cell", { name: "Active", exact: true })).toBeVisible();
      await login(employeePage, email, newPassword);
      await expect(employeePage).toHaveURL(/\/en\/intranet\/?$/);
    }
    await employee.close();
  }
  await page.screenshot({ path: test.info().outputPath("employees.png"), fullPage: true });
  expect(browserErrors).toEqual([]);
});

test("admins edit, verify and delete users without losing verification on unrelated edits", async ({
  page,
  browser,
  baseURL,
}) => {
  const email = `managed-${id}@example.test`;
  const changedEmail = `changed-${id}@example.test`;
  const mailPath = `.cache/e2e-emails/${createHash("sha256").update(email).digest("hex")}.json`;
  await login(page, adminEmail);
  await expect(page).toHaveURL(/\/en\/intranet\/?$/);
  await page.goto("/en/intranet/employees");
  const self = page.getByRole("row").filter({ hasText: adminEmail });
  await expect(self.getByRole("button", { name: "Email verified", exact: true })).toBeVisible();
  await expect(self.getByRole("button", { name: "Delete Test administrator" })).toBeDisabled();
  await self.getByRole("button", { name: "Edit Test administrator", exact: true }).click();
  await expect(
    page
      .getByRole("dialog", { name: "Edit user", exact: true })
      .getByLabel("Role", { exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();

  const managedId = randomUUID();
  await sql`insert into "user" (id, name, email, email_verified, role) values (${managedId}, 'Managed user', ${`delivery-failure-${id}@example.test`}, false, 'user')`;
  await sql`insert into account (id, account_id, provider_id, user_id, password, updated_at) values (${randomUUID()}, ${managedId}, 'credential', ${managedId}, ${await hashPassword(password)}, now())`;
  await page.reload();
  let row = page.getByRole("row").filter({ hasText: `delivery-failure-${id}@example.test` });
  await expect(row.getByRole("button", { name: "Email not verified", exact: true })).toBeVisible();
  await row.getByRole("button", { name: "Send verification email to Managed user" }).click();
  await expect(
    page.getByText("Could not send the email. Please try again.", { exact: true }),
  ).toBeVisible();

  await row.getByRole("button", { name: "Edit Managed user", exact: true }).click();
  let dialog = page.getByRole("dialog", { name: "Edit user", exact: true });
  await dialog.getByRole("textbox", { name: "Name", exact: true }).fill("Updated user");
  await dialog.getByRole("textbox", { name: "Email", exact: true }).fill(email);
  await dialog.getByRole("button", { name: "Save changes" }).click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  row = page.getByRole("row").filter({ hasText: email });
  await expect(row.getByText("Updated user", { exact: true })).toBeVisible();
  await row.getByRole("button", { name: "Send verification email to Updated user" }).click();
  await expect(page.getByText("Verification email sent.", { exact: true })).toBeVisible();
  const message: { to: string[]; subject: string; text: string; html: string } = JSON.parse(
    await readFile(mailPath, "utf8"),
  );
  expect(message.to).toEqual([email]);
  expect(message.subject).toBe("Verify your email address");
  expect(message.html).toContain("Soleva");
  expect(message.html).toContain("#ff803e");
  expect(message.html).toContain("/images/soleva-icon.png");
  const verificationURL = message.text.match(/https?:\/\/[^\s]+/)![0];
  expect(new URL(verificationURL).origin).toBe(baseURL);
  const recipient = await browser.newContext({
    baseURL,
    extraHTTPHeaders: { "x-forwarded-for": clientIP("192.0.2.4") },
  });
  try {
    const recipientPage = await recipient.newPage();
    await recipientPage.goto(verificationURL);
    await expect(recipientPage).toHaveURL(/\/en\/login\?/);
    await expect(recipientPage.getByRole("textbox", { name: "Email", exact: true })).toHaveValue(
      email,
    );
    await expect(
      recipientPage.getByText("Your email address has been verified.", { exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(row.getByRole("button", { name: "Email verified", exact: true })).toBeVisible();
    await expect(row.getByRole("button", { name: /Send verification email/ })).toBeDisabled();

    await row.getByRole("button", { name: "Edit Updated user", exact: true }).click();
    dialog = page.getByRole("dialog", { name: "Edit user", exact: true });
    await dialog.getByRole("textbox", { name: "Name", exact: true }).fill("Renamed user");
    await dialog.getByLabel("Role", { exact: true }).selectOption("admin");
    await dialog.getByRole("button", { name: "Save changes" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(row.getByRole("cell", { name: "Admin", exact: true })).toBeVisible();
    await expect(row.getByRole("button", { name: "Email verified", exact: true })).toBeVisible();

    await row.getByRole("button", { name: "Edit Renamed user", exact: true }).click();
    dialog = page.getByRole("dialog", { name: "Edit user", exact: true });
    await dialog.getByRole("textbox", { name: "Email", exact: true }).fill(adminEmail);
    await dialog.getByRole("button", { name: "Save changes" }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not save changes.");
    await dialog.getByRole("textbox", { name: "Email", exact: true }).fill(changedEmail);
    await dialog.getByLabel("Role", { exact: true }).selectOption("user");
    await dialog.getByRole("button", { name: "Save changes" }).click();
    await expect(dialog).toHaveCount(0);
    row = page.getByRole("row").filter({ hasText: changedEmail });
    await expect(
      row.getByRole("button", { name: "Email not verified", exact: true }),
    ).toBeVisible();
    await expect(row.getByRole("button", { name: /Send verification email/ })).toBeVisible();

    const signedIn = await recipient.request.post("/api/auth/sign-in/email", {
      data: { email: changedEmail, password },
    });
    expect(signedIn.ok()).toBe(true);
    const [target] = await sql`select id from "user" where email = ${changedEmail}`;
    for (const path of ["update-user", "remove-user"]) {
      const denied = await recipient.request.post(`/api/auth/admin/${path}`, {
        data: { userId: id, data: { name: "Unauthorized edit" } },
      });
      expect(denied.status()).toBe(403);
    }

    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await page.screenshot({
      path: test.info().outputPath("employees-dark.png"),
      fullPage: true,
      animations: "disabled",
    });
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await page.screenshot({
      path: test.info().outputPath("employees-light.png"),
      fullPage: true,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: test.info().outputPath("employees-mobile.png"), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
    await page.setViewportSize({ width: 1280, height: 720 });

    await row.getByRole("button", { name: "Delete Renamed user", exact: true }).click();
    dialog = page.getByRole("dialog", { name: "Delete user", exact: true });
    await expect(dialog).toContainText("Delete Renamed user?");
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: "Delete Renamed user", exact: true }).click();
    await page
      .getByRole("dialog", { name: "Delete user", exact: true })
      .getByRole("button", { name: "Delete", exact: true })
      .click();
    await expect(row).toHaveCount(0);
    await page.reload();
    await expect(row).toHaveCount(0);
    expect(await (await recipient.request.get("/api/auth/get-session")).json()).toBeNull();
    expect(await sql`select id from account where user_id = ${target.id}`).toHaveLength(0);
    expect(await sql`select id from session where user_id = ${target.id}`).toHaveLength(0);
  } finally {
    await recipient.close();
    await unlink(mailPath).catch(() => {});
  }
});

test("directory search spans pages and bulk deletion retries only failed rows", async ({
  page,
  request,
}) => {
  const group = `sync-${id}`;
  const records = Array.from({ length: 27 }, (_, index) => ({
    id: randomUUID(),
    name: `${group} ${String(index).padStart(2, "0")}`,
    email: `sync-${index}-${id}@example.test`,
    email_verified: true,
    role: "user",
  }));
  await sql`insert into "user" ${sql(records)}`;
  try {
    await login(page, adminEmail);
    await expect(page).toHaveURL(/\/en\/intranet\/?$/);
    const directoryResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        response.url().includes("/_serverFn/") &&
        response.url().includes(group),
    );
    await page.goto(`/en/intranet/employees?q=${group}`);
    const directory = await directoryResponse;
    expect(
      (
        await request.get(directory.url(), {
          headers: {
            "x-tsr-serverFn": "true",
            "sec-fetch-site": "same-origin",
            origin: new URL(directory.url()).origin,
          },
        })
      ).status(),
    ).toBe(401);
    await expect(page.getByRole("cell", { name: records[0].name, exact: true })).toBeVisible();
    await expect(page.getByRole("cell", { name: records[26].name, exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page).toHaveURL(/offset=25/);
    await page.reload();
    await expect(page.getByRole("cell", { name: records[26].name, exact: true })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("cell", { name: records[0].name, exact: true })).toBeVisible();
    await page.goForward();
    await expect(page.getByRole("cell", { name: records[26].name, exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Search employees", exact: true }).click();
    const search = page.getByRole("searchbox", { name: "Search employees", exact: true });
    await search.fill(records[26].email);
    await expect(page).not.toHaveURL(/offset=/);
    await expect(page.getByRole("cell", { name: records[26].name, exact: true })).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(2);
    await search.fill("%");
    await expect(page.getByText("No employees match your search.", { exact: true })).toBeVisible();
    await search.fill(group);
    await expect(page.getByRole("cell", { name: records[0].name, exact: true })).toBeVisible();
    for (const record of records.slice(0, 2))
      await page.getByRole("checkbox", { name: `Select row: ${record.name}`, exact: true }).check();
    const attempts: string[] = [];
    let fail = true;
    await page.route("**/_serverFn/**", async (route) => {
      const request = route.request();
      const record = records.slice(0, 2).find((row) => request.postData()?.includes(row.id));
      if (request.method() === "POST" && record) {
        attempts.push(record.id);
        if (record.id === records[1].id && fail) {
          fail = false;
          await route.abort();
          return;
        }
      }
      await route.continue();
    });
    await page.getByRole("button", { name: "Delete selected items (2)", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Delete selected items?", exact: true });
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(dialog.getByRole("alert")).toBeVisible();
    expect(await sql`select id from "user" where id = ${records[0].id}`).toHaveLength(0);
    expect(await sql`select id from "user" where id = ${records[1].id}`).toHaveLength(1);
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    expect(attempts).toEqual([records[0].id, records[1].id, records[1].id]);
    expect(
      await sql`select id from "user" where id in ${sql(records.slice(0, 2).map((row) => row.id))}`,
    ).toHaveLength(0);
  } finally {
    await sql`delete from "user" where id in ${sql(records.map((row) => row.id))}`;
  }
});
