import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { t, type Dictionary } from "@/lib/i18n";
import { locales, localeNames, localeShort, type Locale } from "@/lib/i18n/config";

interface AuthScreenProps {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
  siteName: string;
}

/**
 * Full-screen auth wrapper: brand gradients, centered card, back link and
 * language switcher. Used by /{locale}/login and /{locale}/signup.
 */
export function AuthScreen({ locale, dict, children, siteName }: AuthScreenProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      {/* Back to home - top left */}
      <Link
        to="/$lang"
        params={{ lang: locale }}
        className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        {t(dict, "auth.backHome")}
      </Link>

      {/* Language switcher - top right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher
          locale={locale}
          locales={[...locales]}
          localeNames={localeNames}
          localeShort={localeShort}
          ariaLabel={t(dict, "nav.language")}
        />
      </div>

      {/* Decorative background - brand gradients */}
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <Link
          to="/$lang"
          params={{ lang: locale }}
          className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md"
          aria-label={siteName}
        >
          <span className="font-heading text-lg font-bold">{siteName.charAt(0)}</span>
        </Link>
        {children}
      </div>

      <p className="relative mt-6 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} The Corner Factory
      </p>
    </div>
  );
}
