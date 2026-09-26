import { afterEach, expect, test, vi } from "vite-plus/test";

import { applyCookieConsent, trackAdsConversion } from "./analytics";

vi.mock("varlock/env", () => ({
  ENV: {
    VITE_GOOGLE_ADS_ID: "AW-123456789",
    VITE_ADS_CONVERSION_LABEL: "/default",
    VITE_ADS_PHONE_LABEL: "",
    VITE_ADS_MAIL_LABEL: "/mail",
  },
}));
afterEach(() => vi.unstubAllGlobals());

test("conversion labels preserve their destinations and require marketing consent", async () => {
  const gtag = vi.fn();
  vi.stubGlobal("window", { gtag });
  vi.stubGlobal("document", {
    createElement: () => ({ dataset: {} }),
    head: {
      appendChild: (script: { onload: () => void }) => queueMicrotask(() => script.onload()),
    },
  });
  expect(trackAdsConversion("phone")).toBe(false);
  applyCookieConsent({ analytics: false, marketing: true });
  await vi.waitFor(() => expect(trackAdsConversion("phone")).toBe(true));
  for (const [action, destination] of [
    ["phone", "AW-123456789/default"],
    ["email", "AW-123456789/mail"],
    ["other", "AW-123456789/default"],
  ]) {
    expect(trackAdsConversion(action)).toBe(true);
    expect(gtag).toHaveBeenLastCalledWith("event", "conversion", {
      send_to: destination,
      event_category: "engagement",
      event_label: action,
    });
  }
  applyCookieConsent({ analytics: false, marketing: false });
  expect(trackAdsConversion("phone")).toBe(false);
});
