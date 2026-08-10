export interface TeamMember {
  name: string
  role: string
  email?: string
}

export const teamMembers: TeamMember[] = [
  { name: "Curdin Wüthrich", role: "CEO et co-fondateur", email: "curdin.wuethrich@soleva.org" },
  { name: "Matthieu Bourgois", role: "CTO, co-fondateur, intégration mécanique", email: "matthieu.bourgois@soleva.org" },
  { name: "Max Chevron", role: "Trésorier, gestion batteries", email: "max.chevron@soleva.org" },
  { name: "Tobia Wyss", role: "Co-fondateur, intégration solaire", email: "tobia.wyss@soleva.org" },
  { name: "Sara Bossuyt", role: "Co-fondatrice, communication et habitat", email: "sara.bossuyt@soleva.org" },
  { name: "Sévane Bercher", role: "Co-fondatrice, juridique", email: "sevane.bercher@soleva.org" },
  { name: "Lucanaël Kopf", role: "Chef de projet intégration mécanique" },
  { name: "Roman Schmitz", role: "Chef de projet électrification", email: "roman.schmitz@soleva.org" },
  { name: "Nicola Offeddu", role: "Construction habitat durable" },
]

export const mentors: TeamMember[] = [
  { name: "Marc Müller", role: "Fondateur ICARE (tour du monde solaire), Président Impact Living" },
  { name: "André Hodder", role: "Enseignant-chercheur EPFL, moteurs électriques" },
  { name: "Louis Palmer", role: "Fondateur SolarTaxi, SolarButterfly, WAVE" },
  { name: "Prof. Dr. Werner Stednitz", role: "Professeur « Advanced Automotive Concepts » HTW Berlin" },
]
