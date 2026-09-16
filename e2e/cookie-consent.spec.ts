import { expect, test } from "@playwright/test";

import fr from "../src/lib/i18n/fr.json" with { type: "json" };

test("cookie preferences persist, cancel safely and gate analytics", async ({ page }, testInfo) => {
  const tags: string[] = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "www.googletagmanager.com") tags.push(url.href);
    return url.hostname === "localhost" ? route.continue() : route.abort();
  });
  const savedConsent = () =>
    page.evaluate(() => JSON.parse(localStorage.getItem("soleva-cookie-consent") ?? "null"));
  const cookies = page.getByRole("dialog", { name: "Cookies" });
  const customize = () =>
    cookies.getByRole("button", { name: fr.cookies.customize, exact: true }).click();
  const confirm = () =>
    cookies.getByRole("button", { name: fr.cookies.acceptSelection, exact: true }).click();
  const reopen = () =>
    page.getByRole("button", { name: fr.footer.manage_cookies, exact: true }).click();

  await page.goto("/fr/contact");
  await expect(cookies).toBeVisible();
  await expect(cookies.getByRole("checkbox")).toHaveCount(0);
  await cookies.screenshot({ path: testInfo.outputPath("cookie-banner.png") });
  expect(tags).toEqual([]);

  await customize();
  await expect(cookies.getByRole("checkbox", { name: fr.cookies.necessaryTitle })).toBeDisabled();
  await cookies.getByRole("checkbox", { name: fr.cookies.analyticsTitle }).check();
  await cookies.getByRole("button", { name: fr.cookies.cancel, exact: true }).click();
  expect(await savedConsent()).toBeNull();
  expect(tags).toEqual([]);

  await customize();
  await expect(
    cookies.getByRole("checkbox", { name: fr.cookies.analyticsTitle }),
  ).not.toBeChecked();
  await cookies.screenshot({ path: testInfo.outputPath("cookie-preferences.png") });
  await cookies.getByRole("checkbox", { name: fr.cookies.analyticsTitle }).check();
  await confirm();
  await expect(cookies).toBeHidden();
  expect(await savedConsent()).toEqual({ necessary: true, analytics: true, marketing: false });
  await expect.poll(() => tags.length).toBe(2);

  await page.reload();
  await expect.poll(() => tags.length).toBe(4);
  await expect(cookies).toBeHidden();
  await reopen();
  await customize();
  await expect(cookies.getByRole("checkbox", { name: fr.cookies.analyticsTitle })).toBeChecked();
  await expect(
    cookies.getByRole("checkbox", { name: fr.cookies.marketingTitle }),
  ).not.toBeChecked();
  await cookies.getByRole("checkbox", { name: fr.cookies.analyticsTitle }).uncheck();
  await confirm();
  expect(await savedConsent()).toEqual({ necessary: true, analytics: false, marketing: false });
  const consentUpdate = await page.evaluate(() => {
    const updates = window.dataLayer
      ?.map((entry) => Object.values(entry))
      .filter((entry) => entry[0] === "consent" && entry[1] === "update");
    return updates?.at(-1);
  });
  expect(consentUpdate).toEqual([
    "consent",
    "update",
    {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  ]);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(cookies).toBeHidden();
  expect(tags).toHaveLength(4);

  await reopen();
  await cookies.getByRole("button", { name: fr.cookies.acceptAll, exact: true }).click();
  expect(await savedConsent()).toEqual({ necessary: true, analytics: true, marketing: true });
  await expect.poll(() => tags.length).toBe(6);
});
