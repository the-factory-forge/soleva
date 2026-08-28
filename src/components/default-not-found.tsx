import { useLocation } from "@tanstack/react-router";

import { NotFoundPage } from "@/components/layouts/not-found-page";
import { type Locale } from "@/lib/i18n/config";
import { localeFromPathname } from "@/lib/i18n/pathname";

// Themed 404 copy, kept static so the not-found component stays synchronous.
const NOT_FOUND_COPY: Record<
  Locale,
  { badge: string; title: string; description: string; backHome: string; logoAlt: string }
> = {
  fr: {
    badge: "Erreur 404",
    title: "Cette route n'est pas encore sur notre carte solaire.",
    description: "Pas d'inquiétude — nous allons retrouver le chemin du soleil.",
    backHome: "Retour à l'accueil",
    logoAlt: "Accueil",
  },
  en: {
    badge: "Error 404",
    title: "This road isn't on our solar map yet.",
    description: "Don't worry — we'll find our way back to the sun.",
    backHome: "Back to home",
    logoAlt: "Home",
  },
  de: {
    badge: "Fehler 404",
    title: "Diese Strasse ist noch nicht auf unserer Solarkarte.",
    description: "Keine Sorge — wir finden den Weg zurück zur Sonne.",
    backHome: "Zurück zur Startseite",
    logoAlt: "Startseite",
  },
  it: {
    badge: "Errore 404",
    title: "Questa strada non è ancora sulla nostra mappa solare.",
    description: "Niente paura — ritroveremo la strada verso il sole.",
    backHome: "Torna alla home",
    logoAlt: "Home",
  },
};

export function DefaultNotFound() {
  const pathname = useLocation().pathname;
  const locale = localeFromPathname(pathname);
  const copy = NOT_FOUND_COPY[locale];

  return (
    <NotFoundPage
      logo={{ src: "/images/soleva-logo.webp", alt: copy.logoAlt, href: `/${locale}` }}
      badge={copy.badge}
      title={copy.title}
      description={copy.description}
      primaryCta={{ label: copy.backHome, href: `/${locale}` }}
    />
  );
}
