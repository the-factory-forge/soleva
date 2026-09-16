// Blog posts for /blog.
//
// fr/de/it: source EN (traduction) - the EN source is
// content-export/soleva.org/en/blog.json. There is no FR export for this page,
// so all non-EN strings are faithful renderings of the EN source. Title and
// excerpt strings are copied VERBATIM from the EN export where a body exists
// (posts 1 & 5: excerpt = its first sentence). Posts 2-4 carry no body in the
// export, so their excerpts are short, faithful summaries of the event title.

import { type Locale } from "@/lib/i18n/config";

export interface BlogPost {
  slug: string;
  date: string;
  body?: Record<Locale, string[]>;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "solar-openair-cinema-soleva-documentary-unveiling",
    date: "17.09.2024",
    body: {
      en: [
        "📆 Friday 4 October from 6pm",
        "📍 Esplanade de Montbenon (10min walk from Lausanne station)",
        "🥞🍹 Pancake and drinks foodtruck",
        "On the programme 🎸 18:30 - Concert by François Vé, musician and solar bike traveller. 🎥 19:30 - Short film by the Scholl family, solar car pioneers since 1985, followed by their talk. 🎥 20:00 - Short film by Franck Malléus on his crossing of the Alps on a solar-powered bike to go base jumping, followed by his talk. 🎙️ 20:45 - Presentation by Marc Muller, energy engineer, on solar mobility, its past and its future. 🎥 21:00 - Preview of the documentary on our Soleva adventure.",
        "❄ Take warm clothes! If the weather is bad, the evening will take place at our garage in Renens (follow our networks if the weather is uncertain).",
        "🙌 The Soleva team is really looking forward to seeing you again for this new evening with you. Admission is free, so come one, come all!",
      ],
      fr: [
        "Vendredi 4 octobre 2024 dès 18 h, Esplanade de Montbenon, à 10 minutes à pied de la gare de Lausanne. Concerts, courts métrages et cinéma en plein air alimentés par Sunny. Foodtruck de crêpes et boissons.",
        "18 h 30 : concert de François Vé, musicien et voyageur à vélo solaire. 19 h 30 : court métrage de la famille Scholl, pionnière de la voiture solaire depuis 1985, suivi de leur présentation. 20 h : court métrage de Franck Malléus sur sa traversée des Alpes à vélo solaire pour faire du base jump, suivi de sa présentation.",
        "20 h 45 : présentation de Marc Muller, ingénieur en énergie, sur le passé et l’avenir de la mobilité solaire. 21 h : avant-première du documentaire sur l’aventure Soleva.",
        "Entrée libre. L’annonce demandait des vêtements chauds et prévoyait un repli au garage de Renens en cas de mauvais temps, avec les dernières informations sur les réseaux sociaux.",
      ],
      de: [
        "Freitag, 4. Oktober 2024 ab 18 Uhr auf der Esplanade de Montbenon, 10 Gehminuten vom Bahnhof Lausanne. Konzerte, Kurzfilme und Openair-Kino mit Strom von Sunny. Foodtruck mit Crêpes und Getränken.",
        "18:30 Uhr: Konzert von François Vé, Musiker und Solarfahrrad-Reisender. 19:30 Uhr: Kurzfilm der Familie Scholl, Solarauto-Pioniere seit 1985, mit anschliessendem Vortrag. 20 Uhr: Kurzfilm von Franck Malléus über seine Alpenüberquerung per Solarfahrrad zum Basejumpen, mit anschliessendem Vortrag.",
        "20:45 Uhr: Vortrag von Energieingenieur Marc Muller über Vergangenheit und Zukunft der Solarmobilität. 21 Uhr: Vorpremiere des Dokumentarfilms über das Soleva-Abenteuer.",
        "Eintritt frei. Die Ankündigung empfahl warme Kleidung und sah bei schlechtem Wetter die Garage in Renens als Ausweichort vor; aktuelle Hinweise gab es in den sozialen Medien.",
      ],
      it: [
        "Venerdì 4 ottobre 2024 dalle 18, Esplanade de Montbenon, a 10 minuti a piedi dalla stazione di Losanna. Concerti, cortometraggi e cinema all’aperto alimentati da Sunny. Foodtruck con crêpes e bevande.",
        "18:30: concerto di François Vé, musicista e viaggiatore in bicicletta solare. 19:30: cortometraggio della famiglia Scholl, pionieri dell’auto solare dal 1985, seguito dal loro intervento. 20:00: cortometraggio di Franck Malléus sulla traversata delle Alpi in bici solare per fare base jumping, seguito dal suo intervento.",
        "20:45: presentazione dell’ingegnere energetico Marc Muller sul passato e futuro della mobilità solare. 21:00: anteprima del documentario sull’avventura Soleva.",
        "Ingresso gratuito. L’annuncio consigliava abiti caldi e prevedeva il garage di Renens come alternativa in caso di maltempo, con aggiornamenti sui social.",
      ],
    },
    title: {
      en: "Solar openair cinema & Soleva documentary unveiling, October 4th 2024",
      fr: "Cinéma en plein air solaire & dévoilement du documentaire Soleva, 4 octobre 2024",
      de: "Solar-Openair-Kino & Enthüllung des Soleva-Dokumentarfilms, 4. Oktober 2024",
      it: "Cinema all'aperto solare e svelamento del documentario Soleva, 4 ottobre 2024",
    },
    excerpt: {
      en: "📽 We're delighted to be giving a sneak preview of our documentary at an evening dedicated to ‘Solar Adventures'.",
      fr: "📽 Nous sommes ravis de vous offrir un aperçu de notre documentaire lors d'une soirée dédiée aux « Solar Adventures ».",
      de: "📽 Wir freuen uns, bei einem Abend rund um „Solar Adventures“ einen ersten Einblick in unseren Dokumentarfilm zu geben.",
      it: '📽 Siamo lieti di offrire un\'anteprima del nostro documentario in una serata dedicata alle "Solar Adventures".',
    },
  },
  {
    slug: "international-pvinmotion-conference-neuchatel-march-2024",
    date: "30.04.2024",
    title: {
      en: "International PVinMotion conference, Neuchatel 06.-08.03.2024",
      fr: "Conférence internationale PVinMotion, Neuchâtel 06.-08.03.2024",
      de: "Internationale PVinMotion-Konferenz, Neuenburg 06.-08.03.2024",
      it: "Conferenza internazionale PVinMotion, Neuchâtel 06.-08.03.2024",
    },
    // No body in the export; excerpt is a faithful summary of the event title.
    excerpt: {
      en: "Soleva took part in the International PVinMotion conference in Neuchâtel, 6-8 March 2024, dedicated to solar innovation in electric mobility.",
      fr: "Soleva a participé à la conférence internationale PVinMotion à Neuchâtel, du 6 au 8 mars 2024, consacrée à l'innovation solaire dans la mobilité électrique.",
      de: "Soleva nahm vom 6. bis 8. März 2024 an der internationalen PVinMotion-Konferenz in Neuenburg teil, die der Solarinnovation in der Elektromobilität gewidmet war.",
      it: "Soleva ha partecipato alla conferenza internazionale PVinMotion a Neuchâtel, dal 6 all'8 marzo 2024, dedicata all'innovazione solare nella mobilità elettrica.",
    },
  },
  {
    slug: "soleva-roadtrip-expo-automanle-november-2023",
    date: "04.04.2024",
    title: {
      en: "Soleva @ Roadtrip Expo Automanle, Novembre 2023",
      fr: "Soleva @ Roadtrip Expo Automanle, novembre 2023",
      de: "Soleva @ Roadtrip Expo Automanle, November 2023",
      it: "Soleva @ Roadtrip Expo Automanle, novembre 2023",
    },
    // No body in the export; excerpt is a faithful summary of the event title.
    excerpt: {
      en: "Soleva presented the project at the Roadtrip Expo Automanle in November 2023.",
      fr: "Soleva a présenté le projet au Roadtrip Expo Automanle en novembre 2023.",
      de: "Soleva präsentierte das Projekt auf der Roadtrip Expo Automanle im November 2023.",
      it: "Soleva ha presentato il progetto al Roadtrip Expo Automanle nel novembre 2023.",
    },
  },
  {
    // Source title spelled "Photovotaics"; corrected to "Photovoltaics".
    slug: "annual-swiss-photovoltaics-meeting-march-2024",
    date: "04.04.2024",
    title: {
      en: "Annual Swiss Photovoltaics meeting 21.-22. March 2024",
      fr: "Réunion annuelle suisse du photovoltaïque, 21-22 mars 2024",
      de: "Jährliches Schweizer Photovoltaik-Treffen, 21.-22. März 2024",
      it: "Incontro fotovoltaico annuale svizzero, 21-22 marzo 2024",
    },
    // No body in the export; excerpt is a faithful summary of the event title.
    excerpt: {
      en: "Soleva took part in the annual Swiss Photovoltaics meeting on 21-22 March 2024.",
      fr: "Soleva a participé à la réunion annuelle suisse du photovoltaïque les 21 et 22 mars 2024.",
      de: "Soleva nahm am jährlichen Schweizer Photovoltaik-Treffen vom 21. bis 22. März 2024 teil.",
      it: "Soleva ha partecipato all'incontro fotovoltaico annuale svizzero il 21 e 22 marzo 2024.",
    },
  },
  {
    slug: "soleva-coup-de-coeur-vanlife-expo-grenoble-may-2024",
    body: {
      en: [
        "Come visit us at one of the largest fares for camper traveling and vanlife in France. This year at the Alpexpo in Grenoble. It's happening Saturday 04. May and Sunday 05. May from 10h to 20h. We will have to chance to present the project and topics on sustainable travel.",
      ],
      fr: [
        "Le salon Vanlife Expo s’est tenu à Alpexpo, Grenoble, les 4 et 5 mai 2024, de 10 h à 20 h. Soleva y présentait le projet et le voyage durable.",
      ],
      de: [
        "Die Vanlife Expo fand am 4. und 5. Mai 2024 von 10 bis 20 Uhr im Alpexpo Grenoble statt. Soleva stellte dort das Projekt und nachhaltiges Reisen vor.",
      ],
      it: [
        "Vanlife Expo si è tenuta ad Alpexpo, Grenoble, il 4 e 5 maggio 2024 dalle 10 alle 20. Soleva vi presentava il progetto e i viaggi sostenibili.",
      ],
    },
    date: "04.04.2024",
    title: {
      en: 'Soleva "Coup de coeur" at the Vanlife Expo Grenoble 04.-05. May 2024',
      fr: "Soleva « Coup de cœur » au Vanlife Expo Grenoble, 4-5 mai 2024",
      de: "Soleva „Coup de cœur“ auf der Vanlife Expo Grenoble, 04.-05. Mai 2024",
      it: 'Soleva "Coup de cœur" al Vanlife Expo Grenoble, 4-5 maggio 2024',
    },
    excerpt: {
      en: "Come visit us at one of the largest fares for camper traveling and vanlife in France.",
      fr: "Venez nous rencontrer sur l'un des plus grands salons du voyage en camping-car et du vanlife en France.",
      de: "Besuchen Sie uns auf einer der größten Messen für Camping- und Vanlife-Reisen in Frankreich.",
      it: "Venite a trovarci in una delle più grandi fiere di viaggi in camper e vanlife in Francia.",
    },
  },
];
