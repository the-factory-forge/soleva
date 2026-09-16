import { expect, test } from "@playwright/test";

import fr from "../src/lib/i18n/fr.json" with { type: "json" };

test("background video respects motion preferences and keyboard playback controls", async ({ page }) => {
  await page.route("**/*", (route) => new URL(route.request().url()).hostname === "localhost" ? route.continue() : route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fr");
  const cookies = page.getByRole("dialog", { name: "Cookies" });
  await cookies.getByRole("button", { name: fr.cookies.customize, exact: true }).click();
  await cookies.getByRole("button", { name: fr.cookies.acceptSelection, exact: true }).click();

  const video = page.locator("video");
  await expect(video).toHaveJSProperty("paused", true);
  const play = page.getByRole("button", { name: fr.home.hero.play_video, exact: true });
  await play.focus();
  await play.press("Enter");
  await expect(video).toHaveJSProperty("paused", false);
  await expect.poll(() => video.evaluate((element) => element instanceof HTMLVideoElement ? element.currentTime : 0)).toBeGreaterThan(0);
  await page.getByRole("button", { name: fr.home.hero.pause_video, exact: true }).press("Enter");
  await expect(video).toHaveJSProperty("paused", true);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(video).toHaveJSProperty("paused", false);
  await expect(page.locator('iframe[src*="youtube"]')).toHaveCount(0);
  await page.getByRole("button", { name: `${fr.home.hero.play_video} : Soleva - L’aventure Soleva`, exact: true }).click();
  await expect(page.getByTitle("Soleva - L’aventure Soleva")).toHaveAttribute("src", /youtube-nocookie.com\/embed\/6ScnYhFPv5w\?autoplay=1/);
});

test("image preview keeps keyboard focus inside and restores it on Escape", async ({ page }) => {
  await page.route("**/*", (route) => new URL(route.request().url()).hostname === "localhost" ? route.continue() : route.abort());
  await page.goto("/fr");
  const cookies = page.getByRole("dialog", { name: "Cookies" });
  await cookies.getByRole("button", { name: fr.cookies.customize, exact: true }).click();
  await cookies.getByRole("button", { name: fr.cookies.acceptSelection, exact: true }).click();
  const trigger = page.getByRole("button", { name: "Click to enlarge", exact: true }).first();
  await trigger.focus();
  await trigger.press("Enter");
  const preview = page.getByRole("dialog", { name: "Click to enlarge", exact: true });
  await expect(preview).toBeVisible();
  const close = preview.getByRole("button", { name: "Close", exact: true });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(preview).toBeHidden();
  await expect(trigger).toBeFocused();
});
