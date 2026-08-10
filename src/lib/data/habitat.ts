import { IMAGES } from "@/lib/constants"
import type { Locale } from "@/lib/i18n/config"
import {
  BedDouble,
  CookingPot,
  Flame,
  Gauge,
  Leaf,
  Recycle,
  Route,
  ShowerHead,
  Sofa,
  Sun,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export interface HabitatPoint {
  icon: LucideIcon
  title: string
  body: string
}

export interface HabitatSpace {
  icon: LucideIcon
  title: string
  body: string
  image: string
}

export interface HabitatSpec {
  label: string
  value: string
}

export interface HabitatFaq {
  question: string
  answer: string
}

export interface HabitatContent {
  meta: { title: string; description: string }
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
  }
  concept: {
    eyebrow: string
    title: string
    intro: string
    points: HabitatPoint[]
  }
  living: {
    eyebrow: string
    title: string
    subtitle: string
    spaces: HabitatSpace[]
  }
  sustainability: {
    eyebrow: string
    title: string
    body: string
    items: string[]
    imageCaption: string
  }
  comfort: {
    eyebrow: string
    title: string
    body: string
    points: HabitatPoint[]
  }
  technical: {
    eyebrow: string
    title: string
    body: string
    specs: HabitatSpec[]
  }
  faq: {
    eyebrow: string
    title: string
    items: HabitatFaq[]
  }
  cta: { title: string; body: string; primary: string; secondary: string }
}

export const habitatSeoKeywords = [
  "habitat écologique",
  "habitat autonome",
  "maison sur roues autonome",
  "logement durable",
  "énergie renouvelable",
  "van solaire",
  "tiny house écologique",
  "habitat mobile durable",
]

export const habitatContent: Record<Locale, HabitatContent> = {
  fr: {
    meta: {
      title: "Habitat écologique et autonome - la maison sur roues solaire de Soleva",
      description:
        "Un habitat mobile durable et autonome : chambre, salle de bain, cuisine et salon réunis dans une tiny house écologique alimentée à l'énergie renouvelable, en matériaux réutilisés et recyclés.",
    },
    hero: {
      eyebrow: "Habitacle éco-responsable",
      title: "Un habitat écologique, autonome et confortable",
      subtitle:
        "Notre espace de vie ne manque d'aucun des éléments clés d'un vrai chez-soi : chambre, salle de bain, cuisine et salon. Toute la différence se joue dans les matériaux réutilisés et les intégrations intelligentes.",
      ctaPrimary: "Soutenir le projet",
      ctaSecondary: "Découvrir Soleva",
    },
    concept: {
      eyebrow: "Le concept",
      title: "Une maison autonome sur roues",
      intro:
        "Soleva applique le concept Low-Tech et la réutilisation des composants pour offrir un habitat à faible émission de carbone et sans déchet. Être confortable tout en respectant les limites planétaires.",
      points: [
        { icon: Sun, title: "Énergie renouvelable", body: "L'habitat est alimenté par les panneaux solaires embarqués qui couvrent éclairage, cuisine et appareils du quotidien." },
        { icon: Route, title: "Mobilité consciente", body: "Une maison qui se déplace au gré du soleil, pensée pour voyager sans dépendre des infrastructures." },
        { icon: Leaf, title: "Faible impact", body: "Chaque choix vise à réduire l'empreinte environnementale : du gros œuvre aux finitions intérieures." },
        { icon: Recycle, title: "Réemploi et recyclage", body: "Liège, laine et bois de récupération composent l'essentiel de l'aménagement." },
        { icon: Gauge, title: "Confort compact", body: "Un volume optimisé au centimètre près, sans jamais sacrifier le bien-être à bord." },
        { icon: Wrench, title: "Autonomie réelle", body: "Eau, énergie et chauffage gérés en circuit court pour vivre loin de tout raccordement." },
      ],
    },
    living: {
      eyebrow: "L'espace de vie",
      title: "Tout d'un vrai chez-soi, en plus intelligent",
      subtitle:
        "Quatre espaces essentiels cohabitent dans un volume compact, conçus pour le quotidien comme pour les longs voyages.",
      spaces: [
        { icon: BedDouble, title: "Chambre", body: "Des couchages confortables pour l'équipe, intégrés à l'aménagement pour libérer de l'espace en journée.", image: IMAGES.vanInterior },
        { icon: ShowerHead, title: "Salle de bain", body: "Une « douche perpétuelle » qui recycle l'eau et des toilettes sèches pour réduire drastiquement la consommation.", image: IMAGES.habitatFeatures },
        { icon: CookingPot, title: "Cuisine", body: "Une cuisine équipée et fonctionnelle, alimentée par l'énergie solaire produite à bord.", image: IMAGES.habitat },
        { icon: Sofa, title: "Salon", body: "Un coin de vie chaleureux pour se retrouver, travailler et se reposer, baigné de lumière naturelle.", image: IMAGES.habitatInterior },
      ],
    },
    sustainability: {
      eyebrow: "Durabilité",
      title: "Matériaux locaux et réutilisés",
      body: "L'impact environnemental de notre espace de vie est réduit au minimum grâce à des matériaux réutilisés et recyclés : liège et laine pour l'isolation, bois de récupération pour les meubles. Le tout pensé en circuit court et à faible énergie grise.",
      items: [
        "Énergie 100 % renouvelable produite à bord",
        "Vie hors réseau, sans raccordement permanent",
        "Matériaux réutilisés issus de filières locales",
        "Isolation en liège et laine recyclés",
        "Empreinte carbone et déchets réduits au minimum",
        "Mobilité consciente, au rythme du soleil",
      ],
      imageCaption: "Aménagement Low-Tech en matériaux réemployés.",
    },
    comfort: {
      eyebrow: "Confort",
      title: "Écologique ne veut pas dire spartiate",
      body: "Vivre durablement n'impose aucun renoncement. L'habitat conserve la sensation d'un vrai logement : agencement fonctionnel, atmosphère chaleureuse et usages pensés pour le quotidien.",
      points: [
        { icon: Sofa, title: "Sensation de vrai logement", body: "Un intérieur cohérent où chaque zone a sa place, comme dans une maison." },
        { icon: Flame, title: "Chaleur naturelle", body: "Un poêle à masse inertielle diffuse une chaleur douce et durable." },
        { icon: Gauge, title: "Compact mais complet", body: "Aucun essentiel ne manque malgré la surface réduite." },
        { icon: BedDouble, title: "Usage au quotidien", body: "Un espace que l'on habite vraiment, jour après jour, en mouvement." },
      ],
    },
    technical: {
      eyebrow: "Autonomie & technique",
      title: "Des systèmes simples, robustes et autonomes",
      body: "L'énergie solaire embarquée alimente à la fois la propulsion et la vie à bord. Les choix techniques privilégient la sobriété : des solutions Low-Tech faciles à entretenir et indépendantes des infrastructures.",
      specs: [
        { label: "Énergie", value: "Solaire embarqué" },
        { label: "Mode de vie", value: "Hors réseau" },
        { label: "Chauffage", value: "Poêle à masse" },
        { label: "Eau", value: "Douche perpétuelle" },
        { label: "Sanitaires", value: "Toilettes sèches" },
        { label: "Approche", value: "Low-Tech & réemploi" },
      ],
    },
    faq: {
      eyebrow: "Questions fréquentes",
      title: "Tout savoir sur l'habitat",
      items: [
        { question: "Qu'est-ce qu'un habitat autonome sur roues ?", answer: "C'est un logement mobile complet - chambre, salle de bain, cuisine et salon - capable de fonctionner hors réseau grâce à l'énergie solaire et à des systèmes Low-Tech à faible consommation." },
        { question: "L'énergie solaire alimente-t-elle aussi l'habitat ?", answer: "Oui. L'énergie produite par les panneaux solaires couvre la propulsion comme les besoins de la vie à bord : éclairage, cuisine et appareils." },
        { question: "Quels matériaux sont utilisés ?", answer: "L'aménagement privilégie les matériaux réutilisés et recyclés : liège et laine pour l'isolation, bois de récupération pour les meubles." },
        { question: "Comment l'eau est-elle économisée ?", answer: "Grâce à une « douche perpétuelle » qui recycle l'eau et à des toilettes sèches, la consommation d'eau est réduite au strict nécessaire." },
        { question: "Le confort est-il sacrifié ?", answer: "Non. L'habitat conserve toutes les fonctions d'un vrai logement, avec une atmosphère chaleureuse et un chauffage par poêle à masse inertielle." },
      ],
    },
    cta: {
      title: "Découvrez et soutenez l'aventure Soleva",
      body: "Un habitat durable qui prouve qu'on peut vivre confortablement en respectant les limites planétaires. Rejoignez le mouvement.",
      primary: "Soutenir le projet",
      secondary: "En savoir plus",
    },
  },
  en: {
    meta: {
      title: "Ecological, self-sufficient habitat - Soleva's solar house on wheels",
      description:
        "A sustainable, autonomous mobile home: bedroom, bathroom, kitchen and living room combined in an ecological tiny house powered by renewable energy and built from reused and recycled materials.",
    },
    hero: {
      eyebrow: "Eco-responsible habitat",
      title: "An ecological, self-sufficient and comfortable home",
      subtitle:
        "Our living space lacks none of the key elements of a real home: bedroom, bathroom, kitchen and living room. The difference lies in the reused materials and the intelligent integrations.",
      ctaPrimary: "Support the project",
      ctaSecondary: "Discover Soleva",
    },
    concept: {
      eyebrow: "The concept",
      title: "A self-sufficient house on wheels",
      intro:
        "Soleva applies the Low-Tech concept and the reuse of components to deliver a low-carbon, zero-waste habitat. Living comfortably while respecting planetary boundaries.",
      points: [
        { icon: Sun, title: "Renewable energy", body: "The habitat is powered by the on-board solar panels covering lighting, cooking and everyday appliances." },
        { icon: Route, title: "Conscious mobility", body: "A home that moves with the sun, designed to travel without depending on infrastructure." },
        { icon: Leaf, title: "Low impact", body: "Every decision aims to reduce the environmental footprint, from the structure to the interior finishes." },
        { icon: Recycle, title: "Reuse and recycling", body: "Cork, wool and reclaimed wood make up most of the interior." },
        { icon: Gauge, title: "Compact comfort", body: "A volume optimised to the centimetre, never sacrificing on-board well-being." },
        { icon: Wrench, title: "Real autonomy", body: "Water, energy and heating managed in short loops to live far from any connection." },
      ],
    },
    living: {
      eyebrow: "The living space",
      title: "Everything a real home has, only smarter",
      subtitle:
        "Four essential spaces coexist in a compact volume, designed for daily life as much as for long journeys.",
      spaces: [
        { icon: BedDouble, title: "Bedroom", body: "Comfortable sleeping space for the team, built into the layout to free up room during the day.", image: IMAGES.vanInterior },
        { icon: ShowerHead, title: "Bathroom", body: "A \"perpetual shower\" that recycles water and dry toilets to drastically cut consumption.", image: IMAGES.habitatFeatures },
        { icon: CookingPot, title: "Kitchen", body: "A functional, fully equipped kitchen powered by the solar energy produced on board.", image: IMAGES.habitat },
        { icon: Sofa, title: "Living room", body: "A warm living corner to gather, work and rest, bathed in natural light.", image: IMAGES.habitatInterior },
      ],
    },
    sustainability: {
      eyebrow: "Sustainability",
      title: "Local and reused materials",
      body: "The environmental impact of our living space is kept to a minimum thanks to reused and recycled materials: cork and wool for insulation, reclaimed wood for furniture. All designed in short loops with low embodied energy.",
      items: [
        "100% renewable energy produced on board",
        "Off-grid living, no permanent connection",
        "Reused materials from local sources",
        "Cork and recycled wool insulation",
        "Carbon footprint and waste reduced to a minimum",
        "Conscious mobility, at the pace of the sun",
      ],
      imageCaption: "Low-Tech interior built from reused materials.",
    },
    comfort: {
      eyebrow: "Comfort",
      title: "Ecological does not mean spartan",
      body: "Living sustainably requires no compromise. The habitat keeps the feeling of a real home: a functional layout, a warm atmosphere and uses designed for everyday life.",
      points: [
        { icon: Sofa, title: "Real home feeling", body: "A coherent interior where every zone has its place, just like in a house." },
        { icon: Flame, title: "Natural warmth", body: "An inertial mass stove radiates a gentle, lasting heat." },
        { icon: Gauge, title: "Compact yet complete", body: "Nothing essential is missing despite the reduced footprint." },
        { icon: BedDouble, title: "Daily usability", body: "A space you genuinely live in, day after day, on the move." },
      ],
    },
    technical: {
      eyebrow: "Autonomy & systems",
      title: "Simple, robust and self-sufficient systems",
      body: "On-board solar energy powers both propulsion and life aboard. The technical choices favour sobriety: Low-Tech solutions that are easy to maintain and independent from infrastructure.",
      specs: [
        { label: "Energy", value: "On-board solar" },
        { label: "Lifestyle", value: "Off-grid" },
        { label: "Heating", value: "Mass stove" },
        { label: "Water", value: "Perpetual shower" },
        { label: "Sanitation", value: "Dry toilets" },
        { label: "Approach", value: "Low-Tech & reuse" },
      ],
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Everything about the habitat",
      items: [
        { question: "What is a self-sufficient house on wheels?", answer: "It is a complete mobile home - bedroom, bathroom, kitchen and living room - able to run off-grid thanks to solar energy and low-consumption Low-Tech systems." },
        { question: "Does solar energy also power the habitat?", answer: "Yes. The energy produced by the solar panels covers both propulsion and the needs of life on board: lighting, cooking and appliances." },
        { question: "Which materials are used?", answer: "The interior favours reused and recycled materials: cork and wool for insulation, reclaimed wood for furniture." },
        { question: "How is water saved?", answer: "Thanks to a \"perpetual shower\" that recycles water and dry toilets, water consumption is reduced to the strict minimum." },
        { question: "Is comfort sacrificed?", answer: "No. The habitat keeps all the functions of a real home, with a warm atmosphere and heating from an inertial mass stove." },
      ],
    },
    cta: {
      title: "Discover and support the Soleva adventure",
      body: "A sustainable habitat proving you can live comfortably while respecting planetary boundaries. Join the movement.",
      primary: "Support the project",
      secondary: "Learn more",
    },
  },
  de: {
    meta: {
      title: "Ökologischer, autarker Wohnraum - Solevas Solar-Haus auf Rädern",
      description:
        "Ein nachhaltiges, autarkes mobiles Zuhause: Schlafraum, Bad, Küche und Wohnbereich vereint in einem ökologischen Tiny House mit erneuerbarer Energie und wiederverwendeten, recycelten Materialien.",
    },
    hero: {
      eyebrow: "Umweltbewusster Wohnraum",
      title: "Ein ökologischer, autarker und komfortabler Wohnraum",
      subtitle:
        "Unserem Wohnraum fehlt keines der Schlüsselelemente eines echten Zuhauses: Schlafraum, Bad, Küche und Wohnbereich. Der Unterschied liegt in den wiederverwendeten Materialien und den intelligenten Integrationen.",
      ctaPrimary: "Projekt unterstützen",
      ctaSecondary: "Soleva entdecken",
    },
    concept: {
      eyebrow: "Das Konzept",
      title: "Ein autarkes Haus auf Rädern",
      intro:
        "Soleva wendet das Low-Tech-Konzept und die Wiederverwendung von Komponenten an, um einen CO₂-armen und abfallfreien Wohnraum zu schaffen. Komfortabel leben und dabei die planetaren Grenzen respektieren.",
      points: [
        { icon: Sun, title: "Erneuerbare Energie", body: "Der Wohnraum wird von den Solarmodulen an Bord versorgt: Beleuchtung, Kochen und Alltagsgeräte." },
        { icon: Route, title: "Bewusste Mobilität", body: "Ein Zuhause, das sich mit der Sonne bewegt und reist, ohne von Infrastruktur abhängig zu sein." },
        { icon: Leaf, title: "Geringe Wirkung", body: "Jede Entscheidung reduziert den ökologischen Fussabdruck, vom Rohbau bis zum Innenausbau." },
        { icon: Recycle, title: "Wieder- und Weiterverwendung", body: "Kork, Wolle und Altholz bilden den Grossteil des Ausbaus." },
        { icon: Gauge, title: "Kompakter Komfort", body: "Ein auf den Zentimeter optimiertes Volumen, ohne Wohlbefinden zu opfern." },
        { icon: Wrench, title: "Echte Autarkie", body: "Wasser, Energie und Heizung im Kreislauf, um fern jeder Anschlüsse zu leben." },
      ],
    },
    living: {
      eyebrow: "Der Wohnraum",
      title: "Alles wie in einem echten Zuhause, nur cleverer",
      subtitle:
        "Vier wesentliche Bereiche teilen sich ein kompaktes Volumen, gedacht für den Alltag wie für lange Reisen.",
      spaces: [
        { icon: BedDouble, title: "Schlafraum", body: "Bequeme Schlafplätze für das Team, in den Ausbau integriert, um tagsüber Platz zu schaffen.", image: IMAGES.vanInterior },
        { icon: ShowerHead, title: "Bad", body: "Eine «immerwährende Dusche», die Wasser recycelt, und eine Trockentoilette zur drastischen Reduktion des Verbrauchs.", image: IMAGES.habitatFeatures },
        { icon: CookingPot, title: "Küche", body: "Eine funktionale, voll ausgestattete Küche, versorgt durch die an Bord erzeugte Solarenergie.", image: IMAGES.habitat },
        { icon: Sofa, title: "Wohnbereich", body: "Eine warme Wohnecke zum Zusammensein, Arbeiten und Ausruhen, durchflutet von Tageslicht.", image: IMAGES.habitatInterior },
      ],
    },
    sustainability: {
      eyebrow: "Nachhaltigkeit",
      title: "Lokale und wiederverwendete Materialien",
      body: "Die Umweltwirkung unseres Wohnraums wird durch wiederverwendete und recycelte Materialien minimiert: Kork und Wolle für die Dämmung, Altholz für die Möbel. Alles im kurzen Kreislauf und mit geringer grauer Energie gedacht.",
      items: [
        "100 % erneuerbare Energie an Bord erzeugt",
        "Leben abseits des Netzes, ohne festen Anschluss",
        "Wiederverwendete Materialien aus lokalen Quellen",
        "Dämmung aus Kork und recycelter Wolle",
        "CO₂-Fussabdruck und Abfall auf ein Minimum reduziert",
        "Bewusste Mobilität im Rhythmus der Sonne",
      ],
      imageCaption: "Low-Tech-Ausbau aus wiederverwendeten Materialien.",
    },
    comfort: {
      eyebrow: "Komfort",
      title: "Ökologisch heisst nicht spartanisch",
      body: "Nachhaltig zu leben verlangt keinen Verzicht. Der Wohnraum bewahrt das Gefühl eines echten Zuhauses: funktionale Aufteilung, warme Atmosphäre und alltagstaugliche Nutzung.",
      points: [
        { icon: Sofa, title: "Gefühl eines echten Zuhauses", body: "Ein stimmiges Interieur, in dem jede Zone ihren Platz hat, wie in einem Haus." },
        { icon: Flame, title: "Natürliche Wärme", body: "Ein Speicherofen verbreitet eine sanfte, lang anhaltende Wärme." },
        { icon: Gauge, title: "Kompakt und doch komplett", body: "Trotz reduzierter Fläche fehlt nichts Wesentliches." },
        { icon: BedDouble, title: "Alltagstauglich", body: "Ein Raum, den man wirklich bewohnt, Tag für Tag, in Bewegung." },
      ],
    },
    technical: {
      eyebrow: "Autarkie & Technik",
      title: "Einfache, robuste und autarke Systeme",
      body: "Die Solarenergie an Bord versorgt sowohl den Antrieb als auch das Leben an Bord. Die technischen Entscheidungen setzen auf Sparsamkeit: Low-Tech-Lösungen, leicht zu warten und unabhängig von Infrastruktur.",
      specs: [
        { label: "Energie", value: "Solar an Bord" },
        { label: "Lebensstil", value: "Netzunabhängig" },
        { label: "Heizung", value: "Speicherofen" },
        { label: "Wasser", value: "Immerwährende Dusche" },
        { label: "Sanitär", value: "Trockentoilette" },
        { label: "Ansatz", value: "Low-Tech & Reuse" },
      ],
    },
    faq: {
      eyebrow: "Häufige Fragen",
      title: "Alles über den Wohnraum",
      items: [
        { question: "Was ist ein autarkes Haus auf Rädern?", answer: "Es ist ein vollständiges mobiles Zuhause - Schlafraum, Bad, Küche und Wohnbereich -, das dank Solarenergie und sparsamen Low-Tech-Systemen netzunabhängig funktioniert." },
        { question: "Versorgt die Solarenergie auch den Wohnraum?", answer: "Ja. Die von den Solarmodulen erzeugte Energie deckt sowohl den Antrieb als auch die Bedürfnisse des Lebens an Bord: Beleuchtung, Kochen und Geräte." },
        { question: "Welche Materialien werden verwendet?", answer: "Der Ausbau bevorzugt wiederverwendete und recycelte Materialien: Kork und Wolle für die Dämmung, Altholz für die Möbel." },
        { question: "Wie wird Wasser gespart?", answer: "Dank einer «immerwährenden Dusche», die Wasser recycelt, und einer Trockentoilette wird der Wasserverbrauch auf das Nötigste reduziert." },
        { question: "Wird Komfort geopfert?", answer: "Nein. Der Wohnraum behält alle Funktionen eines echten Zuhauses, mit warmer Atmosphäre und Heizung durch einen Speicherofen." },
      ],
    },
    cta: {
      title: "Entdecken und unterstützen Sie das Abenteuer Soleva",
      body: "Ein nachhaltiger Wohnraum, der beweist, dass man komfortabel leben und die planetaren Grenzen respektieren kann. Werden Sie Teil der Bewegung.",
      primary: "Projekt unterstützen",
      secondary: "Mehr erfahren",
    },
  },
  it: {
    meta: {
      title: "Habitat ecologico e autonomo - la casa su ruote solare di Soleva",
      description:
        "Un habitat mobile sostenibile e autonomo: camera, bagno, cucina e soggiorno riuniti in una tiny house ecologica alimentata a energia rinnovabile, con materiali riutilizzati e riciclati.",
    },
    hero: {
      eyebrow: "Habitat eco-responsabile",
      title: "Un habitat ecologico, autonomo e confortevole",
      subtitle:
        "Al nostro spazio abitativo non manca nessuno degli elementi chiave di una vera casa: camera, bagno, cucina e soggiorno. La differenza sta nei materiali riutilizzati e nelle integrazioni intelligenti.",
      ctaPrimary: "Sostieni il progetto",
      ctaSecondary: "Scopri Soleva",
    },
    concept: {
      eyebrow: "Il concetto",
      title: "Una casa autonoma su ruote",
      intro:
        "Soleva applica il concetto Low-Tech e il riutilizzo dei componenti per offrire un habitat a basse emissioni e senza rifiuti. Vivere comodamente rispettando i limiti planetari.",
      points: [
        { icon: Sun, title: "Energia rinnovabile", body: "L'habitat è alimentato dai pannelli solari a bordo che coprono illuminazione, cucina e apparecchi quotidiani." },
        { icon: Route, title: "Mobilità consapevole", body: "Una casa che si sposta seguendo il sole, pensata per viaggiare senza dipendere dalle infrastrutture." },
        { icon: Leaf, title: "Basso impatto", body: "Ogni scelta mira a ridurre l'impronta ambientale, dalla struttura alle finiture interne." },
        { icon: Recycle, title: "Riutilizzo e riciclo", body: "Sughero, lana e legno di recupero compongono gran parte dell'allestimento." },
        { icon: Gauge, title: "Comfort compatto", body: "Un volume ottimizzato al centimetro, senza mai sacrificare il benessere a bordo." },
        { icon: Wrench, title: "Autonomia reale", body: "Acqua, energia e riscaldamento gestiti in circuito breve per vivere lontano da ogni allacciamento." },
      ],
    },
    living: {
      eyebrow: "Lo spazio abitativo",
      title: "Tutto di una vera casa, ma più intelligente",
      subtitle:
        "Quattro spazi essenziali convivono in un volume compatto, progettati per il quotidiano come per i lunghi viaggi.",
      spaces: [
        { icon: BedDouble, title: "Camera", body: "Posti letto confortevoli per il team, integrati nell'allestimento per liberare spazio di giorno.", image: IMAGES.vanInterior },
        { icon: ShowerHead, title: "Bagno", body: "Una «doccia perpetua» che ricicla l'acqua e una toilette a secco per ridurre drasticamente i consumi.", image: IMAGES.habitatFeatures },
        { icon: CookingPot, title: "Cucina", body: "Una cucina funzionale e attrezzata, alimentata dall'energia solare prodotta a bordo.", image: IMAGES.habitat },
        { icon: Sofa, title: "Soggiorno", body: "Un angolo di vita accogliente per ritrovarsi, lavorare e riposare, immerso nella luce naturale.", image: IMAGES.habitatInterior },
      ],
    },
    sustainability: {
      eyebrow: "Sostenibilità",
      title: "Materiali locali e riutilizzati",
      body: "L'impatto ambientale del nostro spazio abitativo è ridotto al minimo grazie a materiali riutilizzati e riciclati: sughero e lana per l'isolamento, legno di recupero per i mobili. Tutto pensato in circuito breve e a bassa energia grigia.",
      items: [
        "Energia 100% rinnovabile prodotta a bordo",
        "Vita off-grid, senza allacciamento permanente",
        "Materiali riutilizzati da filiere locali",
        "Isolamento in sughero e lana riciclati",
        "Impronta di carbonio e rifiuti ridotti al minimo",
        "Mobilità consapevole, al ritmo del sole",
      ],
      imageCaption: "Allestimento Low-Tech in materiali riutilizzati.",
    },
    comfort: {
      eyebrow: "Comfort",
      title: "Ecologico non significa spartano",
      body: "Vivere in modo sostenibile non impone rinunce. L'habitat mantiene la sensazione di una vera casa: disposizione funzionale, atmosfera calda e usi pensati per il quotidiano.",
      points: [
        { icon: Sofa, title: "Sensazione di vera casa", body: "Un interno coerente in cui ogni zona ha il suo posto, come in una casa." },
        { icon: Flame, title: "Calore naturale", body: "Una stufa a massa inerziale diffonde un calore dolce e duraturo." },
        { icon: Gauge, title: "Compatto ma completo", body: "Non manca nulla di essenziale nonostante la superficie ridotta." },
        { icon: BedDouble, title: "Uso quotidiano", body: "Uno spazio che si vive davvero, giorno dopo giorno, in movimento." },
      ],
    },
    technical: {
      eyebrow: "Autonomia e tecnica",
      title: "Sistemi semplici, robusti e autonomi",
      body: "L'energia solare a bordo alimenta sia la propulsione sia la vita a bordo. Le scelte tecniche privilegiano la sobrietà: soluzioni Low-Tech facili da mantenere e indipendenti dalle infrastrutture.",
      specs: [
        { label: "Energia", value: "Solare a bordo" },
        { label: "Stile di vita", value: "Off-grid" },
        { label: "Riscaldamento", value: "Stufa a massa" },
        { label: "Acqua", value: "Doccia perpetua" },
        { label: "Servizi", value: "Toilette a secco" },
        { label: "Approccio", value: "Low-Tech e riuso" },
      ],
    },
    faq: {
      eyebrow: "Domande frequenti",
      title: "Tutto sull'habitat",
      items: [
        { question: "Cos'è una casa autonoma su ruote?", answer: "È un'abitazione mobile completa - camera, bagno, cucina e soggiorno - capace di funzionare off-grid grazie all'energia solare e a sistemi Low-Tech a basso consumo." },
        { question: "L'energia solare alimenta anche l'habitat?", answer: "Sì. L'energia prodotta dai pannelli solari copre sia la propulsione sia i bisogni della vita a bordo: illuminazione, cucina e apparecchi." },
        { question: "Quali materiali sono utilizzati?", answer: "L'allestimento privilegia materiali riutilizzati e riciclati: sughero e lana per l'isolamento, legno di recupero per i mobili." },
        { question: "Come si risparmia l'acqua?", answer: "Grazie a una «doccia perpetua» che ricicla l'acqua e a una toilette a secco, il consumo d'acqua è ridotto allo stretto necessario." },
        { question: "Si sacrifica il comfort?", answer: "No. L'habitat mantiene tutte le funzioni di una vera casa, con un'atmosfera calda e il riscaldamento tramite una stufa a massa inerziale." },
      ],
    },
    cta: {
      title: "Scopri e sostieni l'avventura Soleva",
      body: "Un habitat sostenibile che dimostra come si possa vivere comodamente rispettando i limiti planetari. Unisciti al movimento.",
      primary: "Sostieni il progetto",
      secondary: "Scopri di più",
    },
  },
}
