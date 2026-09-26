import { ENV } from "varlock/env";

import {
  createConsentAnalytics,
  type AnalyticsConsent,
} from "#/components/utils/consent-analytics";

// Keep one controller across public route changes. IDs remain host configuration.
const analytics = createConsentAnalytics({
  measurementId: ENV.VITE_GA_MEASUREMENT_ID,
  adsId: ENV.VITE_GOOGLE_ADS_ID,
  adsConversionLabel: ENV.VITE_ADS_CONVERSION_LABEL,
});

export function applyCookieConsent(consent: AnalyticsConsent): void {
  void analytics.updateConsent(consent).catch(() => {
    // Consent remains saved; confirming preferences again retries a failed load.
    console.error("Could not load analytics.");
  });
}

export const trackEvent = analytics.trackEvent;
const actionLabels: Record<string, string | undefined> = {
  phone: ENV.VITE_ADS_PHONE_LABEL,
  email: ENV.VITE_ADS_MAIL_LABEL,
};
export const trackAdsConversion = (action: string) =>
  analytics.trackAdsConversion(action, actionLabels[action] || ENV.VITE_ADS_CONVERSION_LABEL);
