import { afterEach, expect, test, vi } from "vite-plus/test";

import { createConsentAnalytics } from "./consent-analytics";

afterEach(() => vi.unstubAllGlobals());
test("events require their category and stop immediately after withdrawal", async () => {
  const gtag = vi.fn();
  vi.stubGlobal("window", { gtag });
  const loadScript = vi.fn(async () => {});
  const analytics = createConsentAnalytics({
    measurementId: "G-TEST123",
    adsId: "AW-123456",
    adsConversionLabel: "/conversion",
    loadScript,
  });
  expect(analytics.trackAdsConversion("phone")).toBe(false);
  await analytics.updateConsent({ analytics: true, marketing: false });
  expect(loadScript).toHaveBeenCalledTimes(1);
  expect(analytics.trackEvent("visit")).toBe(true);
  expect(analytics.trackAdsConversion("phone")).toBe(false);
  await analytics.updateConsent({ analytics: false, marketing: true });
  expect(analytics.trackEvent("visit")).toBe(false);
  expect(analytics.trackAdsConversion("phone")).toBe(true);
  await analytics.updateConsent({ analytics: false, marketing: false });
  expect(analytics.trackAdsConversion("phone")).toBe(false);
  expect(loadScript).toHaveBeenCalledTimes(1);
});
