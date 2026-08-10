import type { Locale } from "@/lib/i18n/config"

export type FaqCategory = "project" | "van" | "support" | "technology" | "privacy"

export interface FAQ {
  category: FaqCategory
  question: Record<Locale, string>
  answer: Record<Locale, string>
}

// TODO: Some answers (range, batteries, motor, tax deductibility) must be
// validated by Soleva before publication.
export const faqs: FAQ[] = [
  {
    category: "project",
    question: {
      fr: "Qu'est-ce que Soleva ?",
      en: "What is Soleva?",
      de: "Was ist Soleva?",
      it: "Che cos'è Soleva?",
    },
    answer: {
      fr: "Soleva est un projet suisse à but non lucratif qui convertit un ancien van diesel en camper électrique alimenté par le soleil, afin de démontrer une mobilité durable.",
      en: "Soleva is a Swiss nonprofit project that converts an old diesel van into a solar-powered electric camper to demonstrate sustainable mobility.",
      de: "Soleva ist ein gemeinnütziges Schweizer Projekt, das einen alten Diesel-Van in einen solarbetriebenen Elektro-Camper umwandelt, um nachhaltige Mobilität zu demonstrieren.",
      it: "Soleva è un progetto svizzero senza scopo di lucro che converte un vecchio furgone diesel in un camper elettrico alimentato dal sole per dimostrare la mobilità sostenibile.",
    },
  },
  {
    category: "project",
    question: {
      fr: "Soleva vend-il des vans ?",
      en: "Is Soleva selling vans?",
      de: "Verkauft Soleva Vans?",
      it: "Soleva vende dei van?",
    },
    answer: {
      fr: "Soleva est aujourd'hui principalement un démonstrateur et un projet de sensibilisation. D'éventuels projets de commercialisation sont à confirmer avec l'équipe.",
      en: "Soleva is currently primarily a demonstrator and awareness project. Any future commercialization plans should be confirmed with the team.",
      de: "Soleva ist derzeit vor allem ein Demonstrator und ein Sensibilisierungsprojekt. Mögliche Kommerzialisierungspläne sind mit dem Team zu bestätigen.",
      it: "Soleva è attualmente soprattutto un dimostratore e un progetto di sensibilizzazione. Eventuali piani di commercializzazione futuri vanno confermati con il team.",
    },
  },
  {
    category: "project",
    question: {
      fr: "Qui est derrière Soleva ?",
      en: "Who is behind Soleva?",
      de: "Wer steht hinter Soleva?",
      it: "Chi c'è dietro Soleva?",
    },
    answer: {
      fr: "Une équipe de jeunes ingénieurs suisses, majoritairement diplômés de l'EPFL, soutenue par des bénévoles, des partenaires et des sponsors.",
      en: "A team of young Swiss engineers, mostly EPFL graduates, supported by volunteers, partners and sponsors.",
      de: "Ein Team junger Schweizer Ingenieure, überwiegend EPFL-Absolventen, unterstützt von Freiwilligen, Partnern und Sponsoren.",
      it: "Un team di giovani ingegneri svizzeri, perlopiù laureati all'EPFL, sostenuto da volontari, partner e sponsor.",
    },
  },
  {
    category: "project",
    question: {
      fr: "Quand Soleva a-t-il été fondé ?",
      en: "When was Soleva founded?",
      de: "Wann wurde Soleva gegründet?",
      it: "Quando è stata fondata Soleva?",
    },
    answer: {
      fr: "Le projet a démarré en 2021.",
      en: "The project started in 2021.",
      de: "Das Projekt startete 2021.",
      it: "Il progetto è iniziato nel 2021.",
    },
  },
  {
    category: "van",
    question: {
      fr: "Sur quel véhicule repose Soleva ?",
      en: "What vehicle is Soleva based on?",
      de: "Auf welchem Fahrzeug basiert Soleva?",
      it: "Su quale veicolo si basa Soleva?",
    },
    answer: {
      fr: "Un Peugeot J9 de 1987, à l'origine motorisé au diesel.",
      en: "A Peugeot J9 from 1987, originally diesel-powered.",
      de: "Ein Peugeot J9 von 1987, ursprünglich mit Dieselantrieb.",
      it: "Un Peugeot J9 del 1987, originariamente alimentato a diesel.",
    },
  },
  {
    category: "van",
    question: {
      fr: "Le van roule-t-il entièrement au solaire ?",
      en: "Does the van run entirely on solar power?",
      de: "Fährt der Van vollständig mit Solarenergie?",
      it: "Il van va interamente a energia solare?",
    },
    answer: {
      fr: "L'objectif est de maximiser l'autonomie solaire. En bonnes conditions, les panneaux fournissent jusqu'à 150 km de recharge par jour. Le van peut aussi se recharger sur des bornes classiques.",
      en: "The goal is to maximize solar autonomy. In good conditions, the panels provide up to 150 km of charge per day. The van can also charge at standard stations.",
      de: "Ziel ist es, die Solarautonomie zu maximieren. Bei guten Bedingungen liefern die Module bis zu 150 km Ladung pro Tag. Der Van kann auch an üblichen Stationen laden.",
      it: "L'obiettivo è massimizzare l'autonomia solare. In buone condizioni, i pannelli forniscono fino a 150 km di ricarica al giorno. Il van può anche ricaricarsi a colonnine classiche.",
    },
  },
  {
    category: "van",
    question: {
      fr: "Quelle est l'autonomie ?",
      en: "What is the range?",
      de: "Wie hoch ist die Reichweite?",
      it: "Qual è l'autonomia?",
    },
    answer: {
      fr: "Environ 250 km sur une charge complète. (Estimation à valider.)",
      en: "Approximately 250 km on a full charge. (Estimate to be validated.)",
      de: "Etwa 250 km bei voller Ladung. (Schätzung zu validieren.)",
      it: "Circa 250 km con una carica completa. (Stima da validare.)",
    },
  },
  {
    category: "van",
    question: {
      fr: "Le van est-il homologué pour la route ?",
      en: "Is the van road-legal?",
      de: "Ist der Van strassenzugelassen?",
      it: "Il van è omologato per la strada?",
    },
    answer: {
      fr: "Oui. Il a passé les tests de sécurité électrique et a été certifié pour les routes suisses.",
      en: "Yes. It has passed electrical safety tests and been certified for Swiss roads.",
      de: "Ja. Er hat die elektrischen Sicherheitstests bestanden und wurde für Schweizer Strassen zertifiziert.",
      it: "Sì. Ha superato i test di sicurezza elettrica ed è stato certificato per le strade svizzere.",
    },
  },
  {
    category: "support",
    question: {
      fr: "Comment soutenir Soleva ?",
      en: "How can I support Soleva?",
      de: "Wie kann ich Soleva unterstützen?",
      it: "Come posso sostenere Soleva?",
    },
    answer: {
      fr: "Par des dons, du sponsoring, du bénévolat, des invitations à des événements ou en partageant le projet sur les réseaux sociaux.",
      en: "Through donations, sponsoring, volunteering, event invitations, or sharing the project on social media.",
      de: "Durch Spenden, Sponsoring, Freiwilligenarbeit, Event-Einladungen oder das Teilen des Projekts in den sozialen Medien.",
      it: "Tramite donazioni, sponsorizzazioni, volontariato, inviti a eventi o condividendo il progetto sui social media.",
    },
  },
  {
    category: "support",
    question: {
      fr: "Le crowdfunding d'origine est-il toujours actif ?",
      en: "Is the original crowdfunding still active?",
      de: "Ist das ursprüngliche Crowdfunding noch aktiv?",
      it: "Il crowdfunding originale è ancora attivo?",
    },
    answer: {
      fr: "La campagne Wemakeit s'est terminée en 2022 (CHF 29'583 récoltés). Les dons à l'association restent les bienvenus.",
      en: "The Wemakeit campaign ended in 2022 (CHF 29,583 raised). Donations to the association remain welcome.",
      de: "Die Wemakeit-Kampagne endete 2022 (CHF 29'583 gesammelt). Spenden an den Verein sind weiterhin willkommen.",
      it: "La campagna Wemakeit si è conclusa nel 2022 (CHF 29'583 raccolti). Le donazioni all'associazione restano benvenute.",
    },
  },
  {
    category: "support",
    question: {
      fr: "Puis-je inviter Soleva à un événement ?",
      en: "Can I invite Soleva to an event?",
      de: "Kann ich Soleva zu einer Veranstaltung einladen?",
      it: "Posso invitare Soleva a un evento?",
    },
    answer: {
      fr: "Oui, contactez l'équipe par email à info@soleva.org.",
      en: "Yes, contact the team by email at info@soleva.org.",
      de: "Ja, kontaktieren Sie das Team per E-Mail unter info@soleva.org.",
      it: "Sì, contatta il team via email all'indirizzo info@soleva.org.",
    },
  },
  {
    category: "technology",
    question: {
      fr: "Qui a développé les panneaux solaires ?",
      en: "Who developed the solar panels?",
      de: "Wer hat die Solarmodule entwickelt?",
      it: "Chi ha sviluppato i pannelli solari?",
    },
    answer: {
      fr: "Le CSEM (Centre suisse d'électronique et de microtechnique) en collaboration avec le PV-Lab de l'EPFL.",
      en: "CSEM (Swiss Center for Electronics and Microtechnology) in collaboration with the EPFL PV-Lab.",
      de: "Das CSEM (Schweizerisches Zentrum für Elektronik und Mikrotechnik) in Zusammenarbeit mit dem EPFL PV-Lab.",
      it: "Il CSEM (Centro svizzero di elettronica e microtecnica) in collaborazione con il PV-Lab dell'EPFL.",
    },
  },
  {
    category: "technology",
    question: {
      fr: "Quelles batteries le van utilise-t-il ?",
      en: "What batteries does the van use?",
      de: "Welche Batterien verwendet der Van?",
      it: "Quali batterie usa il van?",
    },
    answer: {
      fr: "8 modules de batterie Volkswagen, 55 kWh au total. (À valider.)",
      en: "8 Volkswagen battery modules, 55 kWh total. (To be validated.)",
      de: "8 Volkswagen-Batteriemodule, insgesamt 55 kWh. (Zu validieren.)",
      it: "8 moduli di batteria Volkswagen, 55 kWh in totale. (Da validare.)",
    },
  },
  {
    category: "technology",
    question: {
      fr: "Quel moteur propulse le van ?",
      en: "What motor powers the van?",
      de: "Welcher Motor treibt den Van an?",
      it: "Quale motore alimenta il van?",
    },
    answer: {
      fr: "Un moteur électrique Nissan de seconde main. (À valider.)",
      en: "A second-hand Nissan electric motor. (To be validated.)",
      de: "Ein gebrauchter Nissan-Elektromotor. (Zu validieren.)",
      it: "Un motore elettrico Nissan di seconda mano. (Da validare.)",
    },
  },
  {
    category: "technology",
    question: {
      fr: "Cette technologie peut-elle être appliquée à d'autres véhicules ?",
      en: "Can this technology be applied to other vehicles?",
      de: "Kann diese Technologie auf andere Fahrzeuge angewendet werden?",
      it: "Questa tecnologia può essere applicata ad altri veicoli?",
    },
    answer: {
      fr: "C'est l'une des ambitions de Soleva : prouver que le retrofit solaire peut s'appliquer à d'autres véhicules utilitaires et de transport.",
      en: "That's one of Soleva's ambitions: proving that solar retrofit can be applied to other utility and transport vehicles.",
      de: "Das ist eines der Ziele von Soleva: zu beweisen, dass der solare Retrofit auf andere Nutz- und Transportfahrzeuge angewendet werden kann.",
      it: "È una delle ambizioni di Soleva: dimostrare che il retrofit solare può essere applicato ad altri veicoli utilitari e di trasporto.",
    },
  },
  {
    category: "privacy",
    question: {
      fr: "Comment mes données sont-elles traitées ?",
      en: "How is my data handled?",
      de: "Wie werden meine Daten verarbeitet?",
      it: "Come vengono trattati i miei dati?",
    },
    answer: {
      fr: "Les données échangées par email servent uniquement à répondre à votre demande. Voir notre politique de confidentialité.",
      en: "Data exchanged via email is used solely to respond to your inquiry. See our privacy policy for details.",
      de: "Die per E-Mail ausgetauschten Daten dienen ausschliesslich der Beantwortung Ihrer Anfrage. Siehe unsere Datenschutzerklärung.",
      it: "I dati scambiati via email servono esclusivamente a rispondere alla tua richiesta. Consulta la nostra informativa sulla privacy.",
    },
  },
]

export const faqCategories: FaqCategory[] = ["project", "van", "support", "technology", "privacy"]

export function getFaqsByCategory(category: FaqCategory): FAQ[] {
  return faqs.filter((f) => f.category === category)
}
