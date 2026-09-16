import { Sun, Zap, type LucideIcon } from "lucide-react";

import { IMAGES } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/config";

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceContent {
  title: string;
  shortTitle: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  process: ServiceProcessStep[];
  faqs: ServiceFAQ[];
  diagrams: { image: string; title: string; description: string }[];
}

export interface Service {
  slug: string;
  icon: LucideIcon;
  heroImage: string;
  gallery?: string[];
  relatedServices: string[];
  seoKeywords: string[];
  content: Record<Locale, ServiceContent>;
}

// Specifications transcribed from the source diagrams on soleva.org.
// See docs/migration-media-sources.json for their provenance.
export const services: Service[] = [
  {
    slug: "conversion-electrique",
    icon: Zap,
    heroImage: IMAGES.conversion,
    gallery: [
      "/images/conversion/gallery-9.webp",
      "/images/conversion/gallery-10.webp",
      "/images/conversion/gallery-11.webp",
      "/images/conversion/gallery-12.webp",
      "/images/conversion/gallery-13.webp",
      "/images/conversion/gallery-14.webp",
      "/images/conversion/gallery-15.webp",
      "/images/conversion/gallery-16.webp",
      "/images/conversion/gallery-17.webp",
      "/images/conversion/gallery-18.webp",
      "/images/conversion/gallery-19.webp",
    ],
    relatedServices: ["systeme-solaire", "habitat"],
    seoKeywords: [
      "retrofit van électrique Suisse",
      "conversion électrique camper van",
      "Peugeot J9 électrique",
      "retrofit véhicule solaire",
    ],
    content: {
      fr: {
        diagrams: [
          {
            image: "/images/technical-specifications.webp",
            title: "Caractéristiques du premier prototype",
            description:
              "Le visuel de présentation annonce 250 km d’autonomie, 5 kW de puissance solaire, 24 m² de surface déployée et 3 places. La recharge solaire complète annoncée est de 11 heures, soit environ deux journées moyennes en Europe centrale.",
          },
          {
            image: "/images/charging-modes.webp",
            title: "Quatre modes de recharge",
            description:
              "Solaire, charge AC de 6,6 kW (9 h), charge DC de 50 kW (1 h 20) et récupération en descente. Le schéma indique 8 batteries Volkswagen, 58 kWh à 400 V, un moteur et un onduleur Nissan Leaf, et plus de 300 km à 80 km/h. Cette dernière valeur décrit une condition différente des 250 km du visuel de présentation.",
          },
          {
            image: "/images/conversion-before-after.webp",
            title: "Avant et après le rétrofit",
            description:
              "Pour démontrer que notre conversion électrique solaire est possible avec n'importe quelle voiture, nous avons choisi une fourgonnette Peugeot J9 emblématique particulièrement ancienne (depuis plus de 35 ans en circulation) pour notre prototype. À cette époque, les véhicules étaient construits sans une tonne d'ajouts et de caractéristiques inutiles, ce qui les rendaient relativement légers. Son élément le plus lourd : le moteur diesel de 190 kg.",
          },
        ],
        title: "Conversion électrique",
        shortTitle: "Retrofit électrique",
        shortDescription:
          "Un ancien van thermique transformé en véhicule 100% électrique grâce au retrofit.",
        fullDescription:
          "Plutôt que de produire un véhicule neuf, Soleva mise sur le retrofit : conserver un Peugeot J9 de 1987, retirer le moteur thermique et le réservoir, et intégrer une chaîne de traction électrique complète. Cette approche prolonge la durée de vie du véhicule et réduit l'impact lié à la fabrication.",
        features: [
          "Remplacement du moteur thermique par un moteur électrique (Nissan Leaf)",
          "8 modules de batterie Volkswagen reconditionnés — 58 kWh à 400 V",
          "Autonomie estimée : environ 250 km",
          "Architecture de contrôle et gestion énergétique embarquée",
          "Réduction de l'empreinte carbone de 81% par rapport à un van diesel conventionnel",
        ],
        process: [
          {
            step: 1,
            title: "Suppression de tous les éléments thermiques",
            description:
              "Tous les éléments polluants contenant de l'huile comme le moteur, l'échappement et le réservoir de carburant sont retirés du fourgon.",
          },
          {
            step: 2,
            title: "Intégration des composants électriques",
            description:
              "Un moteur électrique est nettement plus léger, plus propre et plus simple. Tous les appareils sont intégrés au système du véhicule existant.",
          },
          {
            step: 3,
            title: "Intégration du pack batterie",
            description:
              "Intégration des modules de batterie sous le véhicule. Nous utilisons des batteries remises à neuf mais entièrement fonctionnelles pour une plus grande durabilité.",
          },
          {
            step: 4,
            title: "Ajout du système solaire déployable",
            description:
              "La surface du toit est remplie de panneaux solaires à haute efficacité et légers qui peuvent être déployés et inclinés pour maximiser l'énergie.",
          },
          {
            step: 5,
            title: "Transformation de l'intérieur en un habitacle durable",
            description: "Dans une dernière étape, l'espace de vie est intégré au véhicule.",
          },
        ],
        faqs: [
          {
            question:
              "Pourquoi convertir un ancien van plutôt qu'acheter un véhicule électrique neuf ?",
            answer:
              "Le retrofit permet de réutiliser un véhicule existant, d'éviter l'impact environnemental de la fabrication d'un véhicule neuf et de prolonger la durée de vie de ressources déjà produites. C'est une approche circulaire et concrète.",
          },
          {
            question: "Quelle est l'autonomie du van ?",
            answer:
              "L'autonomie estimée est d'environ 250 km grâce aux batteries, avec la possibilité de recharger via les panneaux solaires embarqués ou des bornes de recharge.",
          },
        ],
      },
      en: {
        diagrams: [
          {
            image: "/images/technical-specifications.webp",
            title: "First prototype specifications",
            description:
              "The overview states a 250 km range, 5 kW of solar power, 24 m² of deployed surface and room for 3 people. A full solar charge is stated as 11 hours, or roughly two average days in central Europe.",
          },
          {
            image: "/images/charging-modes.webp",
            title: "Four ways to charge",
            description:
              "Solar, 6.6 kW AC charging (9 h), 50 kW DC charging (1 h 20) and downhill energy recovery. The schematic specifies 8 Volkswagen batteries, 58 kWh at 400 V, a Nissan Leaf motor and inverter, and over 300 km at 80 km/h. This last figure describes a different condition from the overview’s 250 km range.",
          },
          {
            image: "/images/conversion-before-after.webp",
            title: "Before and after the retrofit",
            description:
              "To demonstrate that our solar electric conversion is possible with any car, we selected a particularly old (more than 35 years in circulation) iconic Peugeot J9 van for our prototype. It was an era where vehicles were built without a ton of unnecessary add-ons and features, making it relatively light-weight. It's heaviest element: the 190kg diesel engine.",
          },
        ],
        title: "Electric conversion",
        shortTitle: "Electric retrofit",
        shortDescription:
          "An old combustion van transformed into a 100% electric vehicle through retrofit.",
        fullDescription:
          "Rather than producing a new vehicle, Soleva relies on retrofit: keeping a 1987 Peugeot J9, removing the combustion engine and tank, and integrating a complete electric powertrain. This approach extends the vehicle's lifespan and reduces the impact related to manufacturing.",
        features: [
          "Combustion engine replaced by an electric motor (Nissan Leaf)",
          "8 refurbished Volkswagen battery modules — 58 kWh at 400 V",
          "Estimated range: around 250 km",
          "On-board control architecture and energy management",
          "81% lower carbon footprint compared with a conventional diesel van",
        ],
        process: [
          {
            step: 1,
            title: "Remove all thermal elements",
            description:
              "All polluting, oil containing elements like the engine, the exhaust and the fuel tank are removed from the van.",
          },
          {
            step: 2,
            title: "Integrate the electric components",
            description:
              "An electric motor is significantly lighter, cleaner and simpler. All devices are integrated to the existing vehicle system.",
          },
          {
            step: 3,
            title: "Incorporate the battery pack",
            description:
              "Integrate the battery modules underneath the vehicle. We use refurbished but fully functional batteries for the highest sustainability.",
          },
          {
            step: 4,
            title: "Add the deployable solar array",
            description:
              "The roof surface gets filled with high efficiency and light-weight solar panels that can be deployed and tilted to maximize the energy.",
          },
          {
            step: 5,
            title: "Transform the interior to a sustainable habitat",
            description: "In a last step, the living space gets integrated into the vehicle.",
          },
        ],
        faqs: [
          {
            question: "Why convert an old van instead of buying a new electric vehicle?",
            answer:
              "Retrofit reuses an existing vehicle, avoids the environmental impact of manufacturing a new one and extends the life of resources already produced. It is a concrete, circular approach.",
          },
          {
            question: "What is the range of the van?",
            answer:
              "The estimated range is around 250 km thanks to the batteries, with the possibility of recharging via the on-board solar panels or charging stations.",
          },
        ],
      },
      de: {
        diagrams: [
          {
            image: "/images/technical-specifications.webp",
            title: "Technische Daten des ersten Prototyps",
            description:
              "Die Übersicht nennt 250 km Reichweite, 5 kW Solarleistung, 24 m² ausgefahrene Fläche und Platz für 3 Personen. Eine vollständige Solarladung wird mit 11 Stunden angegeben, entsprechend etwa zwei durchschnittlichen Tagen in Mitteleuropa.",
          },
          {
            image: "/images/charging-modes.webp",
            title: "Vier Lademöglichkeiten",
            description:
              "Solar, 6,6 kW AC-Ladung (9 h), 50 kW DC-Ladung (1 h 20) und Energierückgewinnung bergab. Das Schema nennt 8 Volkswagen-Batterien, 58 kWh bei 400 V, einen Nissan-Leaf-Motor mit Wechselrichter und über 300 km bei 80 km/h. Diese Angabe gilt unter anderen Bedingungen als die 250 km in der Übersicht.",
          },
          {
            image: "/images/conversion-before-after.webp",
            title: "Vor und nach dem Retrofit",
            description:
              "Der Peugeot J9 von 1987 wurde gewählt, um die Umrüstung eines mehr als 35 Jahre alten Fahrzeugs zu demonstrieren. Die einfache Bauweise ohne zahlreiche Zusatzfunktionen hält das Gewicht niedrig; sein schwerstes Bauteil war der 190 kg schwere Dieselmotor.",
          },
        ],
        title: "Elektroumbau",
        shortTitle: "Elektro-Retrofit",
        shortDescription:
          "Ein alter Verbrenner-Van, durch Retrofit in ein 100% elektrisches Fahrzeug verwandelt.",
        fullDescription:
          "Statt ein neues Fahrzeug zu bauen, setzt Soleva auf Retrofit: einen Peugeot J9 von 1987 behalten, den Verbrennungsmotor und den Tank entfernen und einen kompletten elektrischen Antriebsstrang integrieren. Dieser Ansatz verlängert die Lebensdauer des Fahrzeugs und reduziert die Auswirkungen der Herstellung.",
        features: [
          "Verbrennungsmotor ersetzt durch einen Elektromotor (Nissan Leaf)",
          "8 aufbereitete Volkswagen-Batteriemodule — 58 kWh bei 400 V",
          "Geschätzte Reichweite: rund 250 km",
          "Steuerungsarchitektur und Energiemanagement an Bord",
          "81% kleinerer CO₂-Fussabdruck als ein konventioneller Diesel-Van",
        ],
        process: [
          {
            step: 1,
            title: "Thermische Bauteile entfernen",
            description:
              "Motor, Auspuff und Kraftstofftank sowie alle ölhaltigen, umweltschädlichen Bauteile werden aus dem Van entfernt.",
          },
          {
            step: 2,
            title: "Elektrische Komponenten integrieren",
            description:
              "Ein Elektromotor ist deutlich leichter, sauberer und einfacher. Alle Geräte werden in das bestehende Fahrzeugsystem integriert.",
          },
          {
            step: 3,
            title: "Batteriepaket einbauen",
            description:
              "Die Batteriemodule werden unter dem Fahrzeug eingebaut. Wiederaufbereitete, voll funktionsfähige Batterien erhöhen die Nachhaltigkeit.",
          },
          {
            step: 4,
            title: "Ausfahrbare Solarmodule montieren",
            description:
              "Leichte, hocheffiziente Solarmodule bedecken das Dach. Sie lassen sich ausfahren und neigen, um den Energieertrag zu maximieren.",
          },
          {
            step: 5,
            title: "Nachhaltigen Wohnraum einrichten",
            description: "Zum Schluss wird der Wohnraum in das Fahrzeug integriert.",
          },
        ],
        faqs: [
          {
            question: "Warum einen alten Van umbauen, statt ein neues Elektrofahrzeug zu kaufen?",
            answer:
              "Der Retrofit verwendet ein bestehendes Fahrzeug wieder, vermeidet die Umweltauswirkungen der Herstellung eines neuen und verlängert die Lebensdauer bereits produzierter Ressourcen. Ein konkreter, kreislauforientierter Ansatz.",
          },
          {
            question: "Wie hoch ist die Reichweite des Vans?",
            answer:
              "Die geschätzte Reichweite liegt dank der Batterien bei rund 250 km, mit der Möglichkeit, über die Solarmodule an Bord oder Ladestationen zu laden.",
          },
        ],
      },
      it: {
        diagrams: [
          {
            image: "/images/technical-specifications.webp",
            title: "Specifiche del primo prototipo",
            description:
              "La panoramica indica 250 km di autonomia, 5 kW di potenza solare, 24 m² di superficie dispiegata e posto per 3 persone. Una ricarica solare completa è indicata in 11 ore, circa due giornate medie nell’Europa centrale.",
          },
          {
            image: "/images/charging-modes.webp",
            title: "Quattro modalità di ricarica",
            description:
              "Solare, ricarica AC da 6,6 kW (9 h), ricarica DC da 50 kW (1 h 20) e recupero energetico in discesa. Lo schema indica 8 batterie Volkswagen, 58 kWh a 400 V, motore e inverter Nissan Leaf e oltre 300 km a 80 km/h. Quest’ultimo dato descrive condizioni diverse dai 250 km della panoramica.",
          },
          {
            image: "/images/conversion-before-after.webp",
            title: "Prima e dopo il retrofit",
            description:
              "Il Peugeot J9 del 1987 è stato scelto per dimostrare la conversione di un veicolo con oltre 35 anni di circolazione. La costruzione semplice, priva di numerosi accessori, ne limita il peso: il componente più pesante era il motore diesel da 190 kg.",
          },
        ],
        title: "Conversione elettrica",
        shortTitle: "Retrofit elettrico",
        shortDescription:
          "Un vecchio furgone a combustione trasformato in un veicolo 100% elettrico tramite retrofit.",
        fullDescription:
          "Invece di produrre un veicolo nuovo, Soleva punta sul retrofit: mantenere un Peugeot J9 del 1987, rimuovere il motore a combustione e il serbatoio e integrare una catena di trazione elettrica completa. Questo approccio prolunga la vita del veicolo e riduce l'impatto legato alla fabbricazione.",
        features: [
          "Motore a combustione sostituito da un motore elettrico (Nissan Leaf)",
          "8 moduli di batteria Volkswagen ricondizionati — 58 kWh a 400 V",
          "Autonomia stimata: circa 250 km",
          "Architettura di controllo e gestione energetica a bordo",
          "81% in meno di impronta di carbonio rispetto a un van diesel convenzionale",
        ],
        process: [
          {
            step: 1,
            title: "Rimuovere gli elementi termici",
            description:
              "Il motore, lo scarico, il serbatoio e tutti gli elementi inquinanti contenenti olio vengono rimossi dal furgone.",
          },
          {
            step: 2,
            title: "Integrare i componenti elettrici",
            description:
              "Un motore elettrico è molto più leggero, pulito e semplice. Tutti i dispositivi sono integrati nel sistema esistente del veicolo.",
          },
          {
            step: 3,
            title: "Installare il pacco batterie",
            description:
              "I moduli vengono installati sotto il veicolo. Batterie ricondizionate ma pienamente funzionanti migliorano la sostenibilità.",
          },
          {
            step: 4,
            title: "Aggiungere i pannelli solari dispiegabili",
            description:
              "Il tetto viene coperto da pannelli leggeri ad alta efficienza, dispiegabili e inclinabili per massimizzare l’energia.",
          },
          {
            step: 5,
            title: "Creare un abitacolo sostenibile",
            description: "Nell’ultima fase, lo spazio abitativo viene integrato nel veicolo.",
          },
        ],
        faqs: [
          {
            question:
              "Perché convertire un vecchio furgone invece di acquistare un veicolo elettrico nuovo?",
            answer:
              "Il retrofit riutilizza un veicolo esistente, evita l'impatto ambientale della fabbricazione di uno nuovo e prolunga la vita di risorse già prodotte. È un approccio concreto e circolare.",
          },
          {
            question: "Qual è l'autonomia del van?",
            answer:
              "L'autonomia stimata è di circa 250 km grazie alle batterie, con la possibilità di ricaricare tramite i pannelli solari a bordo o le colonnine di ricarica.",
          },
        ],
      },
    },
  },
  {
    slug: "systeme-solaire",
    icon: Sun,
    heroImage: IMAGES.solarPanels,
    relatedServices: ["conversion-electrique", "habitat"],
    seoKeywords: [
      "van solaire Suisse",
      "panneaux solaires camper van",
      "CSEM photovoltaïque mobilité",
      "toiture solaire déployable véhicule",
    ],
    content: {
      fr: {
        diagrams: [
          {
            image: "/images/solar-system.webp",
            title: "Une surface solaire déployable et orientable",
            description:
              "Une surface principale rigide en nid d’abeille reste active lorsque les panneaux sont repliés. Les surfaces légères déployables utilisent des cellules bifaciales ; l’inclinaison motorisée permet le suivi du soleil. La surface déployée de 24 m² est environ quatre fois celle du toit.",
          },
          {
            image: "/images/solar-v2x.webp",
            title: "Du solaire pour rouler et alimenter d’autres usages",
            description:
              "Le schéma de Soleva annonce environ 150 km de recharge solaire par jour à l’arrêt, panneaux déployés et inclinés, contre 30 km avec les panneaux repliés à plat en roulant, sur la base de l’irradiation annuelle moyenne suisse. Un onduleur DC/AC de 3,5 kW alimente aussi l’habitat et des événements externes (V2X).",
          },
        ],
        title: "Système solaire embarqué",
        shortTitle: "Énergie solaire",
        shortDescription:
          "Une toiture photovoltaïque déployable pour produire l'énergie du voyage directement grâce au soleil.",
        fullDescription:
          "Intégrer une telle surface solaire sur un véhicule exige un rendement élevé, un poids très faible et une résistance au vent et aux intempéries. Le système optimise la conversion de l’énergie solaire vers les batteries et la propulsion pour maximiser l’autonomie tout en limitant les batteries nécessaires. Soleva collabore avec le CSEM, qui a construit les panneaux photovoltaïques de l’avion Solar Impulse. L’énergie produite alimente aussi des événements, des festivals et des équipements grâce au V2X.",
        features: [
          "Panneaux solaires haute performance développés par le CSEM et l'EPFL PV-Lab",
          "5 kW de puissance solaire embarquée",
          "Structure légère, renforcée, résistante à la grêle",
          "Système déployable pour maximiser la surface de captation",
          "Environ 150 km de recharge solaire par jour à l’arrêt, panneaux déployés",
          "Technologie V2X : alimentation externe d'événements et de services",
          "Convertisseur DC-DC BRUSA HyPower optimisant le flux panneaux → batterie",
        ],
        process: [
          {
            step: 1,
            title: "Conception",
            description:
              "Développement de panneaux adaptés à la surface du toit, en collaboration avec le CSEM et l'EPFL PV-Lab.",
          },
          {
            step: 2,
            title: "Fabrication",
            description:
              "Production de modules légers en structure honeycomb, résistants aux intempéries, fabriqués en Suisse.",
          },
          {
            step: 3,
            title: "Intégration",
            description:
              "Installation du système déployable sur le toit du van avec mécanisme d'ajustement pour optimiser l'orientation.",
          },
          {
            step: 4,
            title: "Optimisation",
            description:
              "Calibration de la chaîne énergétique complète : panneaux → convertisseur → batterie → propulsion et habitat.",
          },
        ],
        faqs: [
          {
            question: "Le van roule-t-il uniquement au solaire ?",
            answer:
              "L'objectif est de maximiser l'autonomie solaire. En conditions favorables, les panneaux fournissent jusqu'à 150 km de recharge par jour. Le van peut aussi être rechargé sur des bornes électriques classiques.",
          },
          {
            question: "Qui a développé les panneaux solaires ?",
            answer:
              "Les panneaux ont été développés par le CSEM (Centre suisse d'électronique et de microtechnique) en collaboration avec le PV-Lab de l'EPFL, deux institutions de référence en Suisse.",
          },
          {
            question: "Le système solaire peut-il être adapté à d'autres véhicules ?",
            answer:
              "C'est l'une des ambitions du projet : démontrer que cette technologie peut être transposée à d'autres véhicules utilitaires et de transport professionnel.",
          },
        ],
      },
      en: {
        diagrams: [
          {
            image: "/images/solar-system.webp",
            title: "A deployable, tilting solar array",
            description:
              "A rigid honeycomb main surface keeps charging when the panels are folded. Lightweight deployable surfaces use bifacial cells, with motorized inclination for solar tracking. The 24 m² deployed surface is about four times the roof area.",
          },
          {
            image: "/images/solar-v2x.webp",
            title: "Solar power for driving and other uses",
            description:
              "Soleva’s schematic states around 150 km of solar charge per day while parked with panels deployed and tilted, versus 30 km with panels folded flat while driving, based on annual average Swiss irradiance. A 3.5 kW DC/AC inverter also powers the living space and external events (V2X).",
          },
        ],
        title: "On-board solar system",
        shortTitle: "Solar energy",
        shortDescription:
          "A deployable photovoltaic roof to produce the energy of the journey directly from the sun.",
        fullDescription:
          "Integrating solar energy onto a vehicle to such a massive scale represents huge challenges. It requires the highest possible efficiency while remaining ultra lightweight. It has to be durable and withstand harsh weather and wind conditions. All these requirements were uniquely combined in this demonstrator.\n\nOur design optimises the energy conversion efficiency from solar to battery and propulsion, allowing for high autonomy while minimizing the amount of batteries required. We are collaborating with the CSEM institute, who has built the solar PV panels for the SolarImpulse plane, to build the best solution possible.\n\nThanks to innovative technology, we can use our self-generated solar power not only for the vehicle, but we can power events, festivals, utilities and much more. It is the future of V2X power anywhere you need.",
        features: [
          "High-performance solar panels developed by CSEM and the EPFL PV-Lab",
          "5 kW of on-board solar power",
          "Lightweight, reinforced, hail-resistant structure",
          "Deployable system to maximize the capture surface",
          "Around 150 km of solar charge per day while parked with panels deployed",
          "V2X technology: external power for events and services",
          "BRUSA HyPower DC-DC converter optimizing the panels → battery flow",
        ],
        process: [
          {
            step: 1,
            title: "Design",
            description:
              "Developing panels adapted to the roof surface, in collaboration with CSEM and the EPFL PV-Lab.",
          },
          {
            step: 2,
            title: "Manufacturing",
            description:
              "Producing lightweight honeycomb-structured modules, weather-resistant, made in Switzerland.",
          },
          {
            step: 3,
            title: "Integration",
            description:
              "Installing the deployable system on the van roof with an adjustment mechanism to optimize orientation.",
          },
          {
            step: 4,
            title: "Optimization",
            description:
              "Calibrating the complete energy chain: panels → converter → battery → propulsion and habitat.",
          },
        ],
        faqs: [
          {
            question: "Does the van run on solar power alone?",
            answer:
              "The goal is to maximize solar autonomy. In favorable conditions, the panels provide up to 150 km of charge per day. The van can also be recharged at standard charging stations.",
          },
          {
            question: "Who developed the solar panels?",
            answer:
              "The panels were developed by CSEM (Swiss Center for Electronics and Microtechnology) in collaboration with the EPFL PV-Lab, two leading institutions in Switzerland.",
          },
          {
            question: "Can the solar system be adapted to other vehicles?",
            answer:
              "That is one of the project's ambitions: to demonstrate that this technology can be transferred to other utility and professional transport vehicles.",
          },
        ],
      },
      de: {
        diagrams: [
          {
            image: "/images/solar-system.webp",
            title: "Ausfahrbare und neigbare Solarmodule",
            description:
              "Eine starre Hauptfläche in Wabenbauweise lädt auch bei eingefahrenen Modulen. Leichte ausfahrbare Flächen nutzen bifaziale Zellen; die motorisierte Neigung ermöglicht die Sonnennachführung. Die ausgefahrenen 24 m² entsprechen etwa der vierfachen Dachfläche.",
          },
          {
            image: "/images/solar-v2x.webp",
            title: "Solarstrom für Mobilität und weitere Anwendungen",
            description:
              "Solevas Schema nennt rund 150 km Solarladung pro Tag im Stand mit ausgefahrenen, geneigten Modulen, gegenüber 30 km mit flach eingefahrenen Modulen während der Fahrt, basierend auf der durchschnittlichen jährlichen Sonneneinstrahlung in der Schweiz. Ein 3,5-kW-DC/AC-Wechselrichter versorgt auch den Wohnraum und externe Veranstaltungen (V2X).",
          },
        ],
        title: "Solarsystem an Bord",
        shortTitle: "Solarenergie",
        shortDescription:
          "Ein ausfahrbares Photovoltaikdach, um die Energie der Reise direkt aus der Sonne zu erzeugen.",
        fullDescription:
          "Eine so grosse Solarfläche am Fahrzeug verlangt höchste Effizienz, sehr geringes Gewicht und Widerstandsfähigkeit gegen Wind und Wetter. Das System optimiert die Energieumwandlung von den Solarzellen zu Batterien und Antrieb und minimiert so den Batteriebedarf. Soleva arbeitet mit dem CSEM zusammen, das die Solarmodule für das Flugzeug Solar Impulse gebaut hat. Die erzeugte Energie kann dank V2X auch Veranstaltungen, Festivals und Geräte versorgen.",
        features: [
          "Hochleistungs-Solarmodule, entwickelt vom CSEM und dem EPFL PV-Lab",
          "5 kW Solarleistung an Bord",
          "Leichte, verstärkte, hagelresistente Struktur",
          "Ausfahrbares System zur Maximierung der Auffangfläche",
          "Rund 150 km Solarladung pro Tag im Stand mit ausgefahrenen Modulen",
          "V2X-Technologie: externe Stromversorgung für Events und Dienste",
          "BRUSA HyPower DC-DC-Konverter zur Optimierung des Flusses Module → Batterie",
        ],
        process: [
          {
            step: 1,
            title: "Konzeption",
            description:
              "Entwicklung von an die Dachfläche angepassten Modulen, in Zusammenarbeit mit dem CSEM und dem EPFL PV-Lab.",
          },
          {
            step: 2,
            title: "Fertigung",
            description:
              "Produktion leichter Module in Wabenstruktur, witterungsbeständig, hergestellt in der Schweiz.",
          },
          {
            step: 3,
            title: "Integration",
            description:
              "Installation des ausfahrbaren Systems auf dem Van-Dach mit Verstellmechanismus zur Optimierung der Ausrichtung.",
          },
          {
            step: 4,
            title: "Optimierung",
            description:
              "Kalibrierung der gesamten Energiekette: Module → Konverter → Batterie → Antrieb und Wohnraum.",
          },
        ],
        faqs: [
          {
            question: "Fährt der Van nur mit Solarenergie?",
            answer:
              "Ziel ist es, die Solarautonomie zu maximieren. Unter günstigen Bedingungen liefern die Module bis zu 150 km Ladung pro Tag. Der Van kann auch an üblichen Ladestationen geladen werden.",
          },
          {
            question: "Wer hat die Solarmodule entwickelt?",
            answer:
              "Die Module wurden vom CSEM (Schweizerisches Zentrum für Elektronik und Mikrotechnik) in Zusammenarbeit mit dem EPFL PV-Lab entwickelt, zwei führenden Institutionen in der Schweiz.",
          },
          {
            question: "Kann das Solarsystem auf andere Fahrzeuge übertragen werden?",
            answer:
              "Das ist eines der Ziele des Projekts: zu zeigen, dass diese Technologie auf andere Nutz- und Transportfahrzeuge übertragen werden kann.",
          },
        ],
      },
      it: {
        diagrams: [
          {
            image: "/images/solar-system.webp",
            title: "Pannelli solari dispiegabili e orientabili",
            description:
              "Una superficie principale rigida a nido d’ape continua a caricare con i pannelli ripiegati. Le superfici leggere dispiegabili usano celle bifacciali; l’inclinazione motorizzata consente di seguire il sole. I 24 m² dispiegati sono circa quattro volte la superficie del tetto.",
          },
          {
            image: "/images/solar-v2x.webp",
            title: "Energia solare per viaggiare e altri usi",
            description:
              "Lo schema Soleva indica circa 150 km di ricarica solare al giorno da fermi con pannelli dispiegati e inclinati, contro 30 km con pannelli ripiegati in piano durante la guida, sulla base dell’irraggiamento medio annuo svizzero. Un inverter DC/AC da 3,5 kW alimenta anche l’abitacolo ed eventi esterni (V2X).",
          },
        ],
        title: "Sistema solare a bordo",
        shortTitle: "Energia solare",
        shortDescription:
          "Un tetto fotovoltaico estensibile per produrre l'energia del viaggio direttamente dal sole.",
        fullDescription:
          "Integrare una superficie solare così ampia su un veicolo richiede alta efficienza, peso minimo e resistenza al vento e alle intemperie. Il sistema ottimizza la conversione dell’energia solare verso batterie e propulsione, limitando le batterie necessarie. Soleva collabora con il CSEM, che ha costruito i pannelli fotovoltaici dell’aereo Solar Impulse. Grazie al V2X, l’energia prodotta alimenta anche eventi, festival e attrezzature.",
        features: [
          "Pannelli solari ad alte prestazioni sviluppati dal CSEM e dal PV-Lab dell'EPFL",
          "5 kW di potenza solare a bordo",
          "Struttura leggera, rinforzata, resistente alla grandine",
          "Sistema estensibile per massimizzare la superficie di captazione",
          "Circa 150 km di ricarica solare al giorno da fermi con pannelli dispiegati",
          "Tecnologia V2X: alimentazione esterna per eventi e servizi",
          "Convertitore DC-DC BRUSA HyPower che ottimizza il flusso pannelli → batteria",
        ],
        process: [
          {
            step: 1,
            title: "Progettazione",
            description:
              "Sviluppo di pannelli adattati alla superficie del tetto, in collaborazione con il CSEM e il PV-Lab dell'EPFL.",
          },
          {
            step: 2,
            title: "Fabbricazione",
            description:
              "Produzione di moduli leggeri a struttura honeycomb, resistenti alle intemperie, fabbricati in Svizzera.",
          },
          {
            step: 3,
            title: "Integrazione",
            description:
              "Installazione del sistema estensibile sul tetto del van con meccanismo di regolazione per ottimizzare l'orientamento.",
          },
          {
            step: 4,
            title: "Ottimizzazione",
            description:
              "Calibrazione dell'intera catena energetica: pannelli → convertitore → batteria → propulsione e habitat.",
          },
        ],
        faqs: [
          {
            question: "Il van va solo a energia solare?",
            answer:
              "L'obiettivo è massimizzare l'autonomia solare. In condizioni favorevoli, i pannelli forniscono fino a 150 km di ricarica al giorno. Il van può anche essere ricaricato a colonnine elettriche classiche.",
          },
          {
            question: "Chi ha sviluppato i pannelli solari?",
            answer:
              "I pannelli sono stati sviluppati dal CSEM (Centro svizzero di elettronica e microtecnica) in collaborazione con il PV-Lab dell'EPFL, due istituzioni di riferimento in Svizzera.",
          },
          {
            question: "Il sistema solare può essere adattato ad altri veicoli?",
            answer:
              "È una delle ambizioni del progetto: dimostrare che questa tecnologia può essere trasferita ad altri veicoli utilitari e di trasporto professionale.",
          },
        ],
      },
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string): Service[] {
  const service = getServiceBySlug(slug);
  if (!service) return [];
  return service.relatedServices
    .map((s) => getServiceBySlug(s))
    .filter((s): s is Service => Boolean(s));
}
