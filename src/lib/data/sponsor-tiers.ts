import type { Locale } from "@/lib/i18n/config"

export interface SponsorTier {
  key: string
  price: string
  features: Record<Locale, string[]>
}

export const sponsorTiers: SponsorTier[] = [
  {
    key: "silver",
    price: "CHF 500",
    features: {
      fr: [
        "Logo sur le site web (page soutenir)",
        "Mention sur les réseaux sociaux (1 post)",
        "Remerciements dans la newsletter",
      ],
      en: [
        "Logo on the website (support page)",
        "Mention on social media (1 post)",
        "Acknowledgement in the newsletter",
      ],
      de: [
        "Logo auf der Website (Unterstützungsseite)",
        "Erwähnung in den sozialen Medien (1 Beitrag)",
        "Danksagung im Newsletter",
      ],
      it: [
        "Logo sul sito web (pagina sostegno)",
        "Menzione sui social media (1 post)",
        "Ringraziamenti nella newsletter",
      ],
    },
  },
  {
    key: "gold",
    price: "CHF 1500",
    features: {
      fr: [
        "Logo sur le site web (page soutenir + footer)",
        "Logo sur le van (taille M)",
        "Mention sur les réseaux sociaux (3 posts)",
        "Remerciements dans la newsletter",
        "Invitation aux événements privés Soleva",
      ],
      en: [
        "Logo on the website (support page + footer)",
        "Logo on the van (size M)",
        "Mention on social media (3 posts)",
        "Acknowledgement in the newsletter",
        "Invitation to Soleva private events",
      ],
      de: [
        "Logo auf der Website (Unterstützungsseite + Footer)",
        "Logo auf dem Van (Größe M)",
        "Erwähnung in sozialen Medien (3 Beiträge)",
        "Danksagung im Newsletter",
        "Einladung zu privaten Soleva-Veranstaltungen",
      ],
      it: [
        "Logo sul sito web (pagina sostegno + footer)",
        "Logo sul van (dimensione M)",
        "Menzione sui social media (3 post)",
        "Ringraziamenti nella newsletter",
        "Invito agli eventi privati Soleva",
      ],
    },
  },
  {
    key: "platinum",
    price: "CHF 5000+",
    features: {
      fr: [
        "Logo sur le site web (page soutenir + footer + homepage)",
        "Logo sur le van (taille L)",
        "Mention sur les réseaux sociaux (5 posts + story)",
        "Remerciements dans la newsletter",
        "Invitation aux événements privés Soleva",
        "Présentation du van à votre événement (sur demande)",
        "Reportage photo/vidéo personnalisé",
      ],
      en: [
        "Logo on the website (support page + footer + homepage)",
        "Logo on the van (size L)",
        "Mention on social media (5 posts + story)",
        "Acknowledgement in the newsletter",
        "Invitation to Soleva private events",
        "Van presentation at your event (on request)",
        "Personalized photo/video report",
      ],
      de: [
        "Logo auf der Website (Unterstützungsseite + Footer + Homepage)",
        "Logo auf dem Van (Größe L)",
        "Erwähnung in sozialen Medien (5 Beiträge + Story)",
        "Danksagung im Newsletter",
        "Einladung zu privaten Soleva-Veranstaltungen",
        "Van-Präsentation bei Ihrer Veranstaltung (auf Anfrage)",
        "Personalisierter Foto-/Videobericht",
      ],
      it: [
        "Logo sul sito web (pagina sostegno + footer + homepage)",
        "Logo sul van (dimensione L)",
        "Menzione sui social media (5 post + storia)",
        "Ringraziamenti nella newsletter",
        "Invito agli eventi privati Soleva",
        "Presentazione del van al tuo evento (su richiesta)",
        "Reportage foto/video personalizzato",
      ],
    },
  },
]
