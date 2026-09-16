import { ENV } from "varlock/env";

// Google tag (gtag.js) is loaded lazily, ONLY after the visitor grants
// analytics/marketing consent in the cookie banner (nLPD: nothing is loaded,
// no cookies, no pings before consent). The inline dataLayer stub in __root
// queues gtag() calls; once the library loads they replay in order.
const GA4_ID = ENV.VITE_GA_MEASUREMENT_ID;
const ADS_ID = ENV.VITE_GOOGLE_ADS_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: object[];
    __gtagLoaded?: boolean;
  }
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer!.push(args);
    });
}

export function loadGtag() {
  if (typeof window === "undefined" || window.__gtagLoaded) return;
  window.__gtagLoaded = true;
  ensureDataLayer();

  for (const id of [GA4_ID, ADS_ID]) {
    if (!id) continue;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  }

  window.gtag!("js", new Date());
  if (GA4_ID) window.gtag!("config", GA4_ID);
  if (ADS_ID) window.gtag!("config", ADS_ID);
}

// Google Ads click conversions for phone / email links.
// Active only when VITE_GOOGLE_ADS_ID is set. The label is chosen per action:
//   "phone" -> VITE_ADS_PHONE_LABEL, "email" -> VITE_ADS_MAIL_LABEL,
//   anything else -> VITE_ADS_CONVERSION_LABEL (legacy fallback).
// Label format: "/XXXXXXXXX" (the conversion label from Google Ads).
const ADS_LABELS: Record<string, string | undefined> = {
  phone: ENV.VITE_ADS_PHONE_LABEL,
  email: ENV.VITE_ADS_MAIL_LABEL,
};

export function trackAdsConversion(action: string) {
  const label = ADS_LABELS[action] || ENV.VITE_ADS_CONVERSION_LABEL;
  if (!ADS_ID || !label) return;
  ensureDataLayer();
  window.gtag?.("event", "conversion", {
    send_to: `${ADS_ID}/${label.replace(/^\//, "")}`,
    event_category: "engagement",
    event_label: action,
  });
}
