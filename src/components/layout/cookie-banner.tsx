import {
  CookieBanner as RegistryCookieBanner,
  type ConsentState,
} from "#/components/forge/layouts/cookie-banner";
import { loadGtag } from "#/lib/analytics";
import { COOKIE_CONSENT_KEY } from "#/lib/constants";
import type { Dictionary, Locale } from "#/lib/i18n";
import { withLocale } from "#/lib/navigation";

function loadConsentedAnalytics(state: ConsentState) {
  if (state.analytics || state.marketing) loadGtag();
}

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
  return (
    <RegistryCookieBanner
      consentKey={COOKIE_CONSENT_KEY}
      manageEvent="soleva:open-cookie-settings"
      text={dict.cookies.text}
      acceptAllLabel={dict.cookies.acceptAll}
      acceptSelectionLabel={dict.cookies.customize}
      cancelLabel={dict.cookies.cancel}
      confirmLabel={dict.cookies.acceptSelection}
      policyLabel={dict.cookies.privacyLink}
      privacyHref={withLocale(locale, "/confidentialite")}
      necessaryTitle={dict.cookies.necessaryTitle}
      necessaryDescription={dict.cookies.necessaryDescription}
      analyticsTitle={dict.cookies.analyticsTitle}
      analyticsDescription={dict.cookies.analyticsDescription}
      marketingTitle={dict.cookies.marketingTitle}
      marketingDescription={dict.cookies.marketingDescription}
      showAnalytics={showAnalytics}
      showMarketing={showMarketing}
      onConsentChange={loadConsentedAnalytics}
    />
  );
}
