import { expect, test } from "@playwright/test";

import de from "../src/lib/i18n/de.json" with { type: "json" };
import en from "../src/lib/i18n/en.json" with { type: "json" };
import fr from "../src/lib/i18n/fr.json" with { type: "json" };
import it from "../src/lib/i18n/it.json" with { type: "json" };

test("localized navigation, consent and brand survive the template update", async ({
  page,
}, testInfo) => {
  const pageErrors: string[] = [];
  const tags: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "www.googletagmanager.com") tags.push(url.href);
    return url.hostname === "localhost" ? route.continue() : route.abort();
  });

  for (const [locale, dict] of Object.entries({ fr, en, de, it })) {
    if (locale === "de") {
      await page.setViewportSize({
        width: testInfo.project.name === "mobile" ? 320 : 1024,
        height: 844,
      });
    }
    const response = await page.goto(`/${locale}/contact`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('main a[href="mailto:info@soleva.org"]').first()).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `http://localhost:3100/${locale}/contact`,
    );

    if (locale === "fr") {
      const cookies = page.getByRole("dialog", { name: "Cookies" });
      await expect(cookies).toBeVisible();
      expect(tags).toEqual([]);
      await expect(cookies.getByRole("checkbox")).toHaveCount(0);
      await cookies.getByRole("button", { name: dict.cookies.customize, exact: true }).click();
      await cookies
        .getByRole("button", { name: dict.cookies.acceptSelection, exact: true })
        .click();
      await expect(cookies).toBeHidden();
    }
    expect(tags).toEqual([]);
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(page.locator("h1")).toHaveCSS("font-family", /Montserrat/);

    const newsletterTrigger = page
      .locator("header")
      .getByRole("button", { name: dict.footer.newsletter_title, exact: true });
    const newsletter = page.getByRole("dialog", { name: dict.footer.newsletter_title });
    await expect(newsletter).toBeHidden();
    await expect(newsletterTrigger).toBeInViewport({ ratio: 1 });
    const triggerBounds = await newsletterTrigger.boundingBox();
    const languageBounds = await page
      .getByRole("button", { name: `${dict.nav.language} : ${locale.toUpperCase()}`, exact: true })
      .boundingBox();
    expect(triggerBounds!.x + triggerBounds!.width).toBeLessThanOrEqual(languageBounds!.x);
    expect(languageBounds!.x + languageBounds!.width).toBeLessThanOrEqual(
      page.viewportSize()!.width,
    );
    if (locale === "de") {
      const logoBounds = await page.locator('header a[aria-label="Soleva"] img').boundingBox();
      expect(logoBounds!.width / logoBounds!.height).toBeCloseTo(300 / 123, 1);
      await page.locator("header").screenshot({ path: testInfo.outputPath("navbar-narrow.png") });
    }
    await newsletterTrigger.click();
    await expect(newsletter).toBeVisible();
    await expect(newsletter.getByRole("heading", { name: dict.newsletter.title })).toBeVisible();
    await expect(newsletter.getByRole("textbox")).toBeDisabled();
    await expect(
      newsletter.getByRole("button", { name: dict.newsletter.comingSoon }),
    ).toBeDisabled();
    await expect(newsletter).toContainText(dict.newsletter.unavailable);
    if (locale === "fr") {
      await newsletter.screenshot({ path: testInfo.outputPath("newsletter.png") });
    }
    await newsletter.getByRole("button", { name: dict.nav.close, exact: true }).click();
    await expect(newsletter).toBeHidden();
    await expect(newsletterTrigger).toBeFocused();
    await newsletterTrigger.press("Enter");
    await expect(newsletter).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(newsletter).toBeHidden();
    await expect(newsletterTrigger).toBeFocused();
  }

  await page.goto("/fr/contact");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: fr.nav.menu, exact: true }).click();
    await page.getByRole("dialog").getByRole("link", { name: fr.nav.about, exact: true }).click();
  } else {
    await page.locator('footer a[href="/fr/a-propos"]').click();
  }
  await expect(page).toHaveURL(/\/fr\/a-propos$/);
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("button", { name: `${fr.nav.language} : FR`, exact: true }).click();
  await page.getByRole("menuitem", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/a-propos$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(tags).toEqual([]);
  expect(pageErrors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("soleva.png"), fullPage: true });
});

test("showcase auth stays disabled and public assets remain accessible", async ({ request }) => {
  for (const locale of ["fr", "en", "de", "it"]) {
    for (const route of ["login", "signup", "app"]) {
      const response = await request.get(`/${locale}/${route}`, { maxRedirects: 0 });
      expect(response.status()).toBe(307);
      expect(response.headers().location).toBe("/");
    }
  }
  expect((await request.get("/api/auth/get-session")).status()).toBe(404);

  const response = await request.get("/fr");
  const html = await response.text();
  const stylesheet = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/)?.[1];
  expect(stylesheet).toBeDefined();
  const css = await request.get(stylesheet!);
  expect(css.headers()["access-control-allow-origin"]).toBe("*");
  const source = await css.text();
  expect(source).toContain("--font-sans:");
  expect(source).toContain("--primary:#ff803e");
  const font = source.match(/url\(([^)]+\.woff2)\)/)?.[1];
  expect(font).toBeDefined();
  expect((await request.get(font!.replaceAll('"', ""))).status()).toBe(200);
  const logo = await request.get("/images/soleva-logo.webp");
  expect(logo.status()).toBe(200);
  expect(logo.headers()["access-control-allow-origin"]).toBe("*");
});
