import type { Locale } from "@/lib/i18n/config"

export type Milestone = {
  year: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  status: "done" | "current" | "upcoming"
}

export const milestones: Milestone[] = [
  {
    year: "2021",
    status: "done",
    title: {
      fr: "Fondation",
      en: "Foundation",
      de: "Gründung",
      it: "Fondazione",
    },
    description: {
      fr: "Curdin Wüthrich et quatre amis créent l'association Soleva à Renens.",
      en: "Curdin Wüthrich and four friends create the Soleva association in Renens.",
      de: "Curdin Wüthrich und vier Freunde gründen den Verein Soleva in Renens.",
      it: "Curdin Wüthrich e quattro amici creano l'associazione Soleva a Renens.",
    },
  },
  {
    year: "2022",
    status: "done",
    title: {
      fr: "Crowdfunding et début de construction",
      en: "Crowdfunding and construction starts",
      de: "Crowdfunding und Baubeginn",
      it: "Crowdfunding e inizio costruzione",
    },
    description: {
      fr: "CHF 29'583 récoltés via Wemakeit (147%, 130 contributeurs). Début de la construction du premier prototype « Sunny ».",
      en: "CHF 29,583 raised via Wemakeit (147%, 130 backers). Construction of the first prototype \"Sunny\" begins.",
      de: "CHF 29'583 gesammelt über Wemakeit (147%, 130 Unterstützer). Baubeginn des ersten Prototyps « Sunny ».",
      it: "CHF 29'583 raccolti via Wemakeit (147%, 130 sostenitori). Inizio della costruzione del primo prototipo \"Sunny\".",
    },
  },
  {
    year: "2023",
    status: "done",
    title: {
      fr: "Partenariat CSEM & EPFL PV-Lab",
      en: "CSEM & EPFL PV-Lab partnership",
      de: "Partnerschaft CSEM & EPFL PV-Lab",
      it: "Partenariato CSEM & EPFL PV-Lab",
    },
    description: {
      fr: "Intégration de panneaux solaires haute performance (1 350 W). Partenariat avec BRUSA HyPower.",
      en: "Integration of high-performance solar panels (1,350 W). Partnership with BRUSA HyPower.",
      de: "Integration von Hochleistungs-Solarmodulen (1'350 W). Partnerschaft mit BRUSA HyPower.",
      it: "Integrazione di pannelli solari ad alte prestazioni (1'350 W). Partenariato con BRUSA HyPower.",
    },
  },
  {
    year: "2024",
    status: "done",
    title: {
      fr: "Soleva 2.0 et Tour de Suisse",
      en: "Soleva 2.0 and Swiss Tour",
      de: "Soleva 2.0 und Schweiz-Tour",
      it: "Soleva 2.0 e Tour della Svizzera",
    },
    description: {
      fr: "Construction communautaire (40+ bénévoles). Tour de Suisse du 15 juin au 3 août 2024, 100+ communes. Couverture RTS, SRF, RSI, 24Heures.",
      en: "Community build (40+ volunteers). Swiss Tour from June 15 to August 3, 2024, 100+ towns. Coverage by RTS, SRF, RSI, 24Heures.",
      de: "Gemeinschaftsbau (40+ Freiwillige). Schweiz-Tour vom 15. Juni bis 3. August 2024, 100+ Gemeinden. Berichterstattung von RTS, SRF, RSI, 24Heures.",
      it: "Costruzione comunitaria (40+ volontari). Tour della Svizzera dal 15 giugno al 3 agosto 2024, 100+ comuni. Copertura di RTS, SRF, RSI, 24Heures.",
    },
  },
  {
    year: "2024",
    status: "done",
    title: {
      fr: "Documentaire et prix",
      en: "Documentary and awards",
      de: "Dokumentarfilm und Auszeichnungen",
      it: "Documentario e premi",
    },
    description: {
      fr: "Première du documentaire « L'aventure Soleva » à Lausanne. « Coup de cœur » Vanlife Expo Grenoble. Energy Lab Winner 2022.",
      en: "Premiere of the documentary \"L'aventure Soleva\" in Lausanne. \"Coup de cœur\" Vanlife Expo Grenoble. Energy Lab Winner 2022.",
      de: "Premiere des Dokumentarfilms « L'aventure Soleva » in Lausanne. « Coup de cœur » Vanlife Expo Grenoble. Energy Lab Winner 2022.",
      it: "Prima del documentario \"L'aventure Soleva\" a Losanna. \"Coup de cœur\" Vanlife Expo Grenoble. Energy Lab Winner 2022.",
    },
  },
  {
    year: "2025",
    status: "done",
    title: {
      fr: "L'incendie",
      en: "The fire",
      de: "Der Brand",
      it: "L'incendio",
    },
    description: {
      fr: "Un incendie ravage l'atelier et détruit Sunny, le premier van solaire. Les systèmes de sécurité ont fonctionné. L'équipe décide de continuer.",
      en: "A fire ravages the workshop and destroys Sunny, the first solar van. The safety systems worked. The team decides to continue.",
      de: "Ein Brand verwüstet die Werkstatt und zerstört Sunny, den ersten Solar-Van. Die Sicherheitssysteme haben funktioniert. Das Team beschließt weiterzumachen.",
      it: "Un incendio devasta l'officina e distrugge Sunny, il primo van solare. I sistemi di sicurezza hanno funzionato. Il team decide di continuare.",
    },
  },
  {
    year: "25-26",
    status: "current",
    title: {
      fr: "Nouveau départ",
      en: "A new beginning",
      de: "Neuanfang",
      it: "Nuovo inizio",
    },
    description: {
      fr: "Un nouveau van solaire est en préparation, porté par la communauté et les partenaires.",
      en: "A new solar van is in preparation, driven by the community and partners.",
      de: "Ein neuer Solar-Van ist in Vorbereitung, getragen von der Gemeinschaft und den Partnern.",
      it: "Un nuovo van solare è in preparazione, sostenuto dalla comunità e dai partner.",
    },
  },
]
