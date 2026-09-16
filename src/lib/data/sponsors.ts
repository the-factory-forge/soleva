// Sponsoring data for /sponsoring.
//
// The intro paragraph is copied VERBATIM from the source exports:
//   - en: content-export/soleva.org/en/sponsoring.json
//   - fr: content-export/soleva.org/fr/sponsoring.json
//   - de/it: source EN (traduction) - no DE/IT export exists.
//
// Sponsor/collaboration/media name, category and URL come from the original
// page (content-export/soleva.org/en/sponsoring.json links.external) and the
// brief. `linkStatus` records whether a URL was verified ("ok"), is
// known-broken ("broken"), or was not individually checked ("unverified").
//
// Logos recovered from the live source; provenance in docs/migration-media-sources.json.

import { PARTNER_LOGOS } from "@/lib/constants";
import { type Locale } from "@/lib/i18n/config";

export interface Sponsor {
  name: string;
  url?: string;
  linkStatus?: "ok" | "unverified" | "broken";
  logo?: string;
}

export interface SponsorCategory {
  key: "sponsors" | "collaborations" | "media";
  items: Sponsor[];
}

export const sponsoringIntro: Record<Locale, string> = {
  en: "As an association, Soleva needs your support, whether financial or material. As our partner, you will contribute to developing the yet unexplored field of sustainable mobility and travel. Moreover, you will show your presence in the fields of sustainability, circular economy, renewable energy and innovation.",
  fr: "En tant qu'association, Soleva a besoin de soutien, qu'il soit financier ou matériel. En parrainant SOLEVA, vous contribuerez à développer le domaine encore inexploré de la mobilité et des voyages durables. Vous améliorerez naturellement votre visibilité dans le domaine des énergies renouvelables, de l'économie circulaire et de l'innovation.",
  de: "Als Verein braucht Soleva Ihre Unterstützung, sei es finanziell oder materiell. Als Partner tragen Sie zur Entwicklung des noch unerforschten Bereichs der nachhaltigen Mobilität und des Reisens bei. Darüber hinaus zeigen Sie Präsenz in den Bereichen Nachhaltigkeit, Kreislaufwirtschaft, erneuerbare Energien und Innovation.",
  it: "Come associazione, Soleva ha bisogno del vostro sostegno, sia finanziario che materiale. In qualità di partner, contribuirete a sviluppare il campo ancora inesplorato della mobilità e dei viaggi sostenibili. Inoltre, mostrerete la vostra presenza nei settori della sostenibilità, dell'economia circolare, delle energie rinnovabili e dell'innovazione.",
};

export const sponsorCategories: SponsorCategory[] = [
  {
    key: "sponsors",
    items: [
      {
        name: "SiL",
        url: "https://www.lausanne.ch/vie-pratique/energies-et-eau/services-industriels.html",
        linkStatus: "unverified",
        logo: PARTNER_LOGOS.sil,
      },
      {
        name: "CSEM",
        url: "https://www.csem.ch/en/technical-focus/integrated-lightweight-photovoltaics/",
        linkStatus: "unverified",
        logo: PARTNER_LOGOS.csem,
      },
      {
        name: "Loterie Romande",
        logo: "/images/logos/loterie-romande.webp",
        url: "https://www.loro.ch/",
        linkStatus: "ok",
      },
      {
        name: "Studer Innotec",
        url: "https://studer-innotec.com/",
        linkStatus: "unverified",
        logo: PARTNER_LOGOS.studer,
      },
      {
        name: "Canton de Vaud",
        url: "https://www.vd.ch/",
        linkStatus: "ok",
        logo: PARTNER_LOGOS.cantonVaud,
      },
      {
        name: "Energy Lab Winner 2022",
        url: "https://www.linkedin.com/showcase/swiss-energy-lab/",
        linkStatus: "ok",
        logo: PARTNER_LOGOS.energyLab,
      },
      {
        name: "BRUSA",
        url: "https://www.brusahypower.com",
        linkStatus: "ok",
        logo: PARTNER_LOGOS.brusa,
      },
      {
        name: "EPFL",
        url: "https://epfl.ch",
        linkStatus: "ok",
        logo: PARTNER_LOGOS.epfl,
      },
      {
        name: "Soutenu par Renens",
        logo: "/images/logos/renens.webp",
        url: "https://www.renens.ch",
        linkStatus: "ok",
      },
      {
        name: "cork-shop",
        logo: "/images/logos/cork-shop.webp",
        url: "https://cork-shop.com/",
        linkStatus: "ok",
      },
      {
        name: "evshop",
        logo: "/images/logos/evshop.webp",
        url: "https://evshop.eu/en/",
        linkStatus: "ok",
      },
      {
        name: "Peugeot Grandjean Lausanne",
        logo: "/images/logos/peugeot.png",
        url: "https://dealers.peugeot.ch/grandjean-mt-sur-lausanne/accueil/",
        linkStatus: "unverified",
      },
      {
        name: "Swiss Graphics Services",
        logo: "/images/logos/swiss-graphics.webp",
        url: "https://swissgraphicservices.com/en/",
        linkStatus: "ok",
      },
      {
        name: "Shematic",
        logo: "/images/logos/shematic.png",
        url: "https://shematic.ch/",
        linkStatus: "ok",
      },
      {
        name: "Tiny Stove",
        logo: "/images/logos/tiny-stove.webp",
        url: "https://www.tiny-stove.com/",
        linkStatus: "ok",
      },
      {
        name: "vanmade",
        logo: "/images/logos/vanmade.webp",
        url: "https://www.vanmade.de/en/",
        linkStatus: "ok",
      },
    ],
  },
  {
    key: "collaborations",
    items: [
      {
        name: "Energiegenossenschaft Schweiz",
        logo: "/images/logos/energiegenossenschaft.webp",
        url: "https://www.energiegenossenschaft.ch/wp2/",
        linkStatus: "unverified",
      },
      {
        name: "iai heig-vd",
        logo: "/images/logos/heig-vd.webp",
        url: "https://heig-vd.ch/",
        linkStatus: "ok",
      },
      { name: "CSM", logo: "/images/logos/csm.webp" },
      { name: "BioLite", logo: "/images/logos/biolite.webp" },
    ],
  },
  {
    key: "media",
    items: [
      {
        name: "Megaphone",
        logo: "/images/logos/megaphone.png",
        url: "https://megaphone.info/",
        linkStatus: "ok",
      },
      {
        name: "Justin Burks Design",
        logo: "/images/logos/justin-burks.png",
        url: "https://www.birdhousebranding.com/",
        linkStatus: "broken",
      },
    ],
  },
];
