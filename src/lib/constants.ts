// src/lib/constants.ts - adapted to Soleva
// IMPORTANT: Many values below are placeholders pending client validation.

export const SITE_URL = "https://soleva.the-corner.io"
export const SITE_NAME = "Soleva"

// CTAs point to the internal /contact page. No external booking URL.
export const CTA_DESTINATION = "/contact"

export const CONTACT = {
  businessName: "Soleva",
  fullName: "ASSOCIATION SOLEVA",
  phone: "+41 77 420 74 40",
  email: "info@soleva.org",
  ceoEmail: "curdin.wuethrich@soleva.org",
  address: {
    street: "Rue de Lausanne 64",
    zip: "1020",
    city: "Renens VD",
    canton: "Vaud",
    country: "Suisse",
  },
  geo: {
    latitude: 46.5354, // Renens
    longitude: 6.5886,
  },
  legalForm: "Association",
  IDE: "",
} as const

export const SOCIALS = {
  instagram: "https://instagram.com/soleva_solar_van",
  facebook: "https://facebook.com/solevavan",
  // TODO: LinkedIn page does not exist (company/soleva redirects to another company). Add real URL when client provides it.
  youtube: "https://youtube.com/channel/UCmw0pPduN1XgIyguDNtcv0w",
} as const

export const THE_CORNER = {
  factoriesUrl: "https://the-corner.io/portfolio/factories",
  logoUrl: "https://assets.the-corner.io/logos/the_corner-icon.png",
} as const

export const SITE = {
  // TODO: Client must provide a favicon. Using The Corner placeholder for now.
  faviconUrl: "https://assets.the-corner.io/logos/the_corner-icon.png",
} as const

// All images served locally (migrated from Megaphone CDN - June 2026).
export const IMAGES = {
  hero: "/images/hero.webp",
  heroVideo: "/images/hero-video.mp4",
  vanExterior: "/images/van-exterior.webp",
  vanInterior: "/images/van-interior.webp",
  solarPanels: "/images/solar-panels.webp",
  conversion: "/images/van-exterior.webp",
  habitat: "/images/habitat.webp",
  habitatHero: "/images/habitat-hero.webp",
  habitatInterior: "/images/habitat-interior.webp",
  habitatFeatures: "/images/habitat-features.webp",
  team: "/images/team.webp",
  workshop: "/images/workshop.webp",
  journey: "/images/journey.webp",
  impact: "/images/impact.webp",
  support: "/images/workshop.webp",
  newVanDesign: "/images/new-van-design.webp",
} as const

// Partner logos
export const PARTNER_LOGOS = {
  csem: "/images/logos/csem.webp",
  epfl: "/images/logos/epfl.webp",
  studer: "/images/logos/studer.webp",
  brusa: "/images/logos/brusa.webp",
  cantonVaud: "/images/logos/canton-vaud.webp",
  sil: "/images/logos/sil.webp",
  energyLab: "/images/logos/energy-lab.webp",
} as const

// Team member photos
export const TEAM_PHOTOS: Record<string, string> = {
  "Curdin Wüthrich": "/images/team/curdin.webp",
  "Matthieu Bourgois": "/images/team/matthieu.webp",
  "Max Chevron": "/images/team/max.webp",
  "Tobia Wyss": "/images/team/tobia.webp",
  "Sara Bossuyt": "/images/team/sara.webp",
  "Sévane Bercher": "/images/team/sevane.webp",
  "Lucanaël Kopf": "/images/team/lucanael.webp",
  "Roman Schmitz": "/images/team/roman.webp",
  "Nicola Offeddu": "/images/team/nicola.webp",
}

// Mentor photos
export const MENTOR_PHOTOS: Record<string, string> = {
  "Marc Müller": "/images/mentors/marc-muller.webp",
  "André Hodder": "/images/mentors/andre-hodder.webp",
  "Louis Palmer": "/images/mentors/louis-palmer.webp",
  "Prof. Dr. Werner Stednitz": "/images/mentors/werner-stednitz.webp",
}

// Press/media logos
export const PRESS_LOGOS: Record<string, string> = {
  "RTS 19h30": "/images/press/rts.webp",
  "SRF Schweiz Aktuell": "/images/press/srf.webp",
  "RSI Telegiornale": "/images/press/srf.webp",
  "24Heures": "/images/press/24heures.webp",
  "Télé Vaud-Fribourg": "/images/press/tele-vaud-fribourg.webp",
  "RTS Radio Matinale": "/images/press/rts-radio.webp",
  "Rouge FM": "/images/press/rouge-fm.webp",
  "LFM": "/images/press/lfm.webp",
  "La Côte": "/images/press/la-cote.webp",
}

// Key figures - TODO: ALL technical figures MUST be validated by Soleva.
export const KEY_FIGURES = {
  foundedYear: 2021,
  crowdfundingAmount: "CHF 29'583",
  crowdfundingPercent: "147%",
  crowdfundingBackers: 130,
  crowdfundingGoal: "CHF 20'000",
  crowdfundingPlatform: "Wemakeit",
  crowdfundingUrl: "https://wemakeit.com/projects/soleva-solar-electric-van",
  batteryCapacity: "55 kWh",
  autonomy: "~250 km",
  solarChargePerDay: "150 km",
  carbonReduction: "80%",
  volunteers: "40+",
  communesVisited: "100+",
  vehicleOrigin: "Peugeot J9, 1987",
  solarPower: "1 350 W",
} as const

// TODO: Client must provide GA4 Measurement ID via NEXT_PUBLIC_GA_MEASUREMENT_ID.
export const COOKIE_CONSENT_KEY = "soleva-cookie-consent"

export const DONATION = {
  beneficiary: "ASSOCIATION SOLEVA",
  addressLine1: "Rue de Lausanne 64",
  addressLine2: "1020 Renens VD",
  iban: "CH3600767000L55322287",
  ibanFormatted: "CH36 0076 7000 L553 2228 7",
  bic: "BCVLCH2LXXX",
  bank: "Banque Cantonale Vaudoise",
  reference: "Donation au projet Soleva",
} as const

export const HOSTING = {
  provider: "The Corner Factory SA",
  server: "Serveur VPS Infomaniak, Suisse",
} as const
