export interface PressAppearance {
  media: string
  type: string
  date: string
  language: string
  url?: string
}

export const pressAppearances: PressAppearance[] = [
  { media: "RTS 19h30", type: "TV nationale", date: "23.06.2024", language: "FR" },
  { media: "SRF Schweiz Aktuell", type: "TV nationale", date: "29.08.2024", language: "DE" },
  { media: "RSI Telegiornale", type: "TV nationale", date: "13.07.2024", language: "IT" },
  { media: "24Heures", type: "Presse écrite", date: "12.06.2024", language: "FR" },
  { media: "Télé Vaud-Fribourg", type: "TV régionale", date: "06.04.2022", language: "FR" },
  { media: "RTS Radio Matinale", type: "Radio nationale", date: "24.06.2022", language: "FR" },
  { media: "Rouge FM", type: "Radio", date: "30.06.2022", language: "FR" },
  { media: "LFM", type: "Radio", date: "06.03.2022", language: "FR" },
  { media: "La Côte", type: "Presse écrite", date: "01.03.2022", language: "FR" },
]
