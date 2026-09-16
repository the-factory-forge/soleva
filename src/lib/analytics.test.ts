import { afterEach, expect, test, vi } from "vite-plus/test";

import { trackAdsConversion } from "./analytics";

vi.mock("varlock/env", () => ({
  ENV: {
    VITE_GOOGLE_ADS_ID: "AW-TEST",
    VITE_ADS_CONVERSION_LABEL: "/default",
    VITE_ADS_PHONE_LABEL: "",
    VITE_ADS_MAIL_LABEL: "/mail",
  },
}));

afterEach(() => vi.unstubAllGlobals());

test("empty optional labels use the fallback while per-action labels retain their destination", () => {
  const gtag = vi.fn();
  vi.stubGlobal("window", { gtag });

  for (const [action, destination] of [
    ["phone", "AW-TEST/default"],
    ["email", "AW-TEST/mail"],
    ["other", "AW-TEST/default"],
  ]) {
    trackAdsConversion(action);
    expect(gtag).toHaveBeenLastCalledWith("event", "conversion", {
      send_to: destination,
      event_category: "engagement",
      event_label: action,
    });
  }
});
