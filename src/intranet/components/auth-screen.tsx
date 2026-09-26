import { useLocation } from "@tanstack/react-router";

import { LanguageSwitcher } from "#/components/navigation/language-switcher";
import { AuthLayout } from "#/intranet/components/forge/plugins/login/auth-layout";
import { t, type Dictionary } from "#/lib/i18n";
import { locales, localeNames, localeShort, type Locale } from "#/lib/i18n/config";
import { SITE_LOGO } from "#/lib/site/constants";

interface AuthScreenProps {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
  siteName: string;
}
export function AuthScreen({ locale, dict, children, siteName }: AuthScreenProps) {
  const search = useLocation({ select: (location) => location.searchStr });
  return (
    <AuthLayout
      siteName={siteName}
      logoSrc={SITE_LOGO}
      homeHref={`/${locale}`}
      privacyHref={`/${locale}/confidentialite`}
      labels={dict.auth}
      languageControl={
        <LanguageSwitcher
          locale={locale}
          locales={[...locales]}
          localeNames={localeNames}
          localeShort={localeShort}
          ariaLabel={t(dict, "auth.language")}
          search={search}
        />
      }
    >
      {children}
    </AuthLayout>
  );
}
