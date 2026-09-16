import type { Locale } from "@/lib/i18n/config";

export interface SponsorTier {
  key: string;
  features: Record<Locale, string[]>;
}

// Transcribed from the 2025 sponsorship chart on the source site.
export const sponsorTiers: SponsorTier[] = [
  {
    key: "silver",
    features: {
      fr: [
        "Logo sur le site, la brochure et les présentations",
        "Invitation aux événements partenaires",
        "Publications dédiées au partenariat sur les réseaux sociaux",
        "Logo sur le véhicule — S",
      ],
      en: [
        "Logo on the website, brochure and presentations",
        "Invitation to partner events",
        "Dedicated social media posts about the partnership",
        "Logo on the vehicle — S",
      ],
      de: [
        "Logo auf Website, Broschüre und Präsentationen",
        "Einladung zu Partnerveranstaltungen",
        "Eigene Social-Media-Beiträge über die Partnerschaft",
        "Logo auf dem Fahrzeug — S",
      ],
      it: [
        "Logo su sito, brochure e presentazioni",
        "Invito agli eventi dei partner",
        "Post dedicati alla partnership sui social media",
        "Logo sul veicolo — S",
      ],
    },
  },
  {
    key: "gold",
    features: {
      fr: [
        "Logo sur le site, la brochure et les présentations",
        "Invitation aux événements partenaires",
        "Publications dédiées au partenariat sur les réseaux sociaux",
        "Logo sur le véhicule — M",
        "Présentation dans votre institution",
        "Publication ou vidéo dédiée à votre produit ou activité",
        "Présentation détaillée du partenariat sur le site",
      ],
      en: [
        "Logo on the website, brochure and presentations",
        "Invitation to partner events",
        "Dedicated social media posts about the partnership",
        "Logo on the vehicle — M",
        "Presentation at your institution",
        "Dedicated post or video about your product or activities",
        "Detailed partnership information on the website",
      ],
      de: [
        "Logo auf Website, Broschüre und Präsentationen",
        "Einladung zu Partnerveranstaltungen",
        "Eigene Social-Media-Beiträge über die Partnerschaft",
        "Logo auf dem Fahrzeug — M",
        "Präsentation in Ihrer Institution",
        "Beitrag oder Video über Ihr Produkt oder Ihre Aktivitäten",
        "Ausführliche Informationen zur Partnerschaft auf der Website",
      ],
      it: [
        "Logo su sito, brochure e presentazioni",
        "Invito agli eventi dei partner",
        "Post dedicati alla partnership sui social media",
        "Logo sul veicolo — M",
        "Presentazione presso la vostra istituzione",
        "Post o video dedicato al vostro prodotto o attività",
        "Informazioni dettagliate sulla partnership sul sito",
      ],
    },
  },
  {
    key: "platinum",
    features: {
      fr: [
        "Logo sur le site, la brochure et les présentations",
        "Invitation aux événements partenaires",
        "Publications dédiées au partenariat sur les réseaux sociaux",
        "Logo sur le véhicule — L",
        "Présentation dans votre institution",
        "Publication ou vidéo dédiée à votre produit ou activité",
        "Présentation détaillée du partenariat sur le site",
        "Véhicule à disposition pour un événement",
        "Choix de l’emplacement du logo, après accord avec Soleva",
        "Mise en avant de la marque lors des présentations",
        "Supports visuels de votre entreprise lors de nos événements",
      ],
      en: [
        "Logo on the website, brochure and presentations",
        "Invitation to partner events",
        "Dedicated social media posts about the partnership",
        "Logo on the vehicle — L",
        "Presentation at your institution",
        "Dedicated post or video about your product or activities",
        "Detailed partnership information on the website",
        "Vehicle available for an event",
        "Choice of logo placement, by agreement with Soleva",
        "Special brand highlighting during presentations",
        "Company visual identity materials at our events",
      ],
      de: [
        "Logo auf Website, Broschüre und Präsentationen",
        "Einladung zu Partnerveranstaltungen",
        "Eigene Social-Media-Beiträge über die Partnerschaft",
        "Logo auf dem Fahrzeug — L",
        "Präsentation in Ihrer Institution",
        "Beitrag oder Video über Ihr Produkt oder Ihre Aktivitäten",
        "Ausführliche Informationen zur Partnerschaft auf der Website",
        "Fahrzeug für eine Veranstaltung verfügbar",
        "Wahl der Logo-Platzierung nach Absprache mit Soleva",
        "Besondere Hervorhebung der Marke bei Präsentationen",
        "Visuelles Unternehmensmaterial bei unseren Veranstaltungen",
      ],
      it: [
        "Logo su sito, brochure e presentazioni",
        "Invito agli eventi dei partner",
        "Post dedicati alla partnership sui social media",
        "Logo sul veicolo — L",
        "Presentazione presso la vostra istituzione",
        "Post o video dedicato al vostro prodotto o attività",
        "Informazioni dettagliate sulla partnership sul sito",
        "Veicolo a disposizione per un evento",
        "Scelta della posizione del logo previo accordo con Soleva",
        "Valorizzazione del marchio durante le presentazioni",
        "Materiali visivi della vostra azienda ai nostri eventi",
      ],
    },
  },
];
