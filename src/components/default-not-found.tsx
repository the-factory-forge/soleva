import { useLocation } from "@tanstack/react-router";

import { NotFoundPage } from "@/components/layouts/not-found-page";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { localeFromPathname } from "@/lib/i18n/pathname";

// Lightweight 404 copy (only the notFound keys), kept static so the
// not-found component stays synchronous (no async dict loading).
const NOT_FOUND_COPY: Record<Locale, { title: string; description: string; cta: string }> = {
  fr: {
    title: "Cette route n'est pas encore sur notre carte solaire.",
    description: "Pas d'inquiétude - nous allons retrouver le chemin du soleil.",
    cta: "Retour à l'accueil",
  },
  en: {
    title: "This road isn't on our solar map yet.",
    description: "Don't worry - we'll find our way back to the sun.",
    cta: "Back to homepage",
  },
  de: {
    title: "Diese Strasse ist noch nicht auf unserer Solarkarte.",
    description: "Keine Sorge - wir finden den Weg zurück zur Sonne.",
    cta: "Zurück zur Startseite",
  },
  it: {
    title: "Questa strada non è ancora sulla nostra mappa solare.",
    description: "Niente paura - ritroveremo la strada verso il sole.",
    cta: "Torna alla home",
  },
};

export function DefaultNotFound() {
  // The not-found renders inside the router, so the pathname is available
  // (unlike Next.js) - derive the locale to keep the 404 localized.
  const pathname = useLocation().pathname;
  const locale = localeFromPathname(pathname);
  const copy = NOT_FOUND_COPY[locale];

  return (
    <NotFoundPage
      title={copy.title}
      description={copy.description}
      ctaLabel={copy.cta}
      ctaHref={`/${locale}`}
    />
  );
}
