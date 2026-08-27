"use client";

import { useEffect, useState, useCallback } from "react";

import { Link } from "@/components/ui/link";
import { loadGtag } from "@/lib/analytics";
import type { Dictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/navigation";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: object[];
  }
}

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function ensureGtag() {
  if (typeof window === "undefined") return;
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    });
}

function serialize(state: ConsentState): string {
  return JSON.stringify(state);
}

function deserialize(raw: string): ConsentState | null {
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.necessary === "boolean" &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.marketing === "boolean"
    ) {
      return parsed as ConsentState;
    }
    return null;
  } catch {
    return null;
  }
}

function applyConsent(state: ConsentState) {
  ensureGtag();
  window.gtag?.("consent", "update", {
    ad_storage: state.marketing ? "granted" : "denied",
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
  });
  // nLPD: the Google tag itself loads only once analytics/marketing consent is
  // granted (nothing loads for reject-only visitors).
  if (state.analytics || state.marketing) {
    loadGtag();
  }
}

const OPEN_EVENT = "soleva:open-cookie-settings";

interface CookieBannerProps {
  locale: Locale;
  dict: Dictionary;
  showAnalytics?: boolean;
  showMarketing?: boolean;
}

export function CookieBanner({
  locale,
  dict,
  showAnalytics = true,
  showMarketing = false,
}: CookieBannerProps) {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);
  const consentKey = "cookie-consent";

  const evaluate = useCallback(() => {
    const stored = localStorage.getItem(consentKey);
    if (stored) {
      const parsed = deserialize(stored);
      if (parsed) {
        applyConsent(parsed);
        setDraft(parsed);
        setVisible(false);
        return;
      }
    }
    applyConsent(DEFAULT_CONSENT);
    setDraft(DEFAULT_CONSENT);
    setVisible(true);
  }, [consentKey]);

  useEffect(() => {
    evaluate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === consentKey) evaluate();
    };
    const onManage = () => {
      const stored = localStorage.getItem(consentKey);
      setDraft(stored ? (deserialize(stored) ?? DEFAULT_CONSENT) : DEFAULT_CONSENT);
      setVisible(true);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(OPEN_EVENT, onManage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(OPEN_EVENT, onManage);
    };
  }, [evaluate, consentKey]);

  const acceptAll = () => {
    const state: ConsentState = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem(consentKey, serialize(state));
    applyConsent(state);
    setVisible(false);
  };

  const rejectAll = () => {
    const state: ConsentState = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem(consentKey, serialize(state));
    applyConsent(state);
    setVisible(false);
  };

  const acceptSelection = () => {
    localStorage.setItem(consentKey, serialize(draft));
    applyConsent(draft);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      aria-live="polite"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6",
        "animate-in duration-300 fade-in slide-in-from-bottom-4",
      )}
    >
      <div className="container-premium">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-5 shadow-lg">
          <p className="max-w-2xl text-sm leading-relaxed text-foreground">
            {dict.cookies.text}{" "}
            <Link
              href={withLocale(locale, "/confidentialite")}
              className="font-semibold text-primary underline underline-offset-2"
            >
              {dict.cookies.privacyLink}
            </Link>
          </p>

          {showAnalytics || showMarketing ? (
            <div className="space-y-3">
              <label className="flex cursor-not-allowed items-start gap-3 opacity-70">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-0.5 h-4 w-4 shrink-0 rounded accent-primary"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {dict.cookies.necessaryTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dict.cookies.necessaryDescription}
                  </p>
                </div>
              </label>

              {showAnalytics && (
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={draft.analytics}
                    onChange={(e) => setDraft((prev) => ({ ...prev, analytics: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded accent-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {dict.cookies.analyticsTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dict.cookies.analyticsDescription}
                    </p>
                  </div>
                </label>
              )}

              {showMarketing && (
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={draft.marketing}
                    onChange={(e) => setDraft((prev) => ({ ...prev, marketing: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded accent-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {dict.cookies.marketingTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dict.cookies.marketingDescription}
                    </p>
                  </div>
                </label>
              )}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-primary/40"
            >
              {dict.cookies.acceptAll}
            </button>
            {(showAnalytics || showMarketing) && (
              <button
                type="button"
                onClick={acceptSelection}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                {dict.cookies.acceptSelection}
              </button>
            )}
            <button
              type="button"
              onClick={rejectAll}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              {dict.cookies.reject}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
