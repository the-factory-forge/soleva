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
// NOTE on logos: no logo URL was mapped for this page. The live page could not
// be fetched here and the export image list carries no name->URL mapping, so
// `logo` stays undefined and the cards render name-only.
// TODO localize via scripts/scrape-soleva-org.mjs --media

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
      { name: "Loterie Romande", url: "https://www.loro.ch/", linkStatus: "ok" },
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
        url: "https://energylab.site",
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
      { name: "Soutenu par Renens", url: "https://www.renens.ch", linkStatus: "ok" },
      { name: "cork-shop", url: "https://cork-shop.com/", linkStatus: "ok" },
      { name: "evshop", url: "https://evshop.eu/en/", linkStatus: "ok" },
      {
        name: "Peugeot Grandjean Lausanne",
        url: "https://dealers.peugeot.ch/grandjean-mt-sur-lausanne/accueil/",
        linkStatus: "unverified",
      },
      { name: "Swiss Graphics Services", url: "https://swissgraphicservices.com/en/", linkStatus: "ok" },
      { name: "Shematic", url: "https://shematic.ch/", linkStatus: "ok" },
      { name: "Tiny Stove", url: "https://www.tiny-stove.com/", linkStatus: "ok" },
      { name: "vanmade", url: "https://www.vanmade.de/en/", linkStatus: "ok" },
    ],
  },
  {
    key: "collaborations",
    items: [
      {
        name: "Energiegenossenschaft Schweiz",
        url: "https://www.energiegenossenschaft.ch/wp2/",
        linkStatus: "unverified",
      },
      { name: "iai heig-vd", url: "https://heig-vd.ch/", linkStatus: "ok" },
      { name: "CSM" },
      { name: "BioLite" },
    ],
  },
  {
    key: "media",
    items: [
      { name: "Megaphone", url: "https://megaphone.info/", linkStatus: "ok" },
      {
        name: "Justin Burks Design",
        url: "https://www.birdhousebranding.com/",
        linkStatus: "broken",
      },
    ],
  },
];
