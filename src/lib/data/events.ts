export interface Event {
  name: Record<"fr" | "en" | "de" | "it", string>;
  location: string;
  date: string;
}

export const pastEvents: Event[] = [
  {
    name: {
      fr: "Avant-première du documentaire",
      en: "Documentary premiere",
      de: "Dokumentarfilm-Premiere",
      it: "Anteprima del documentario",
    },
    location: "Lausanne",
    date: "04.10.2024",
  },
  {
    name: {
      fr: "Vanlife Expo Grenoble (« Coup de cœur »)",
      en: 'Vanlife Expo Grenoble ("Favourite")',
      de: 'Vanlife Expo Grenoble („Coup de cœur")',
      it: 'Vanlife Expo Grenoble ("Coup de cœur")',
    },
    location: "Grenoble",
    date: "04-05.05.2024",
  },
  {
    name: {
      fr: "Congrès photovoltaïque Suisse",
      en: "Swiss Photovoltaic Congress",
      de: "Schweizer Photovoltaik-Kongress",
      it: "Congresso fotovoltaico svizzero",
    },
    location: "Suisse",
    date: "03.2024",
  },
  {
    name: {
      fr: "Roadtrip Expo",
      en: "Roadtrip Expo",
      de: "Roadtrip Expo",
      it: "Roadtrip Expo",
    },
    location: "Suisse",
    date: "11.2023",
  },
  {
    // fr: source EN (pas de FR source) - l'événement n'apparaît pas dans le
    // fichier FR exporté, seul le titre EN est fourni.
    name: {
      fr: "Conférence internationale PVinMotion",
      en: "International PVinMotion conference",
      de: "Internationale PVinMotion-Konferenz",
      it: "Conferenza internazionale PVinMotion",
    },
    location: "Neuchâtel",
    date: "06-08.03.2024",
  },
  {
    name: {
      fr: "Congrès photovoltaïque Suisse",
      en: "Annual Swiss Photovoltaics meeting",
      de: "Schweizer Photovoltaik-Treffen",
      it: "Incontro fotovoltaico svizzero",
    },
    location: "Suisse",
    date: "21-22.03.2024",
  },
];

export const POLAR_STEPS_URL = "https://www.polarsteps.com/Soleva";
