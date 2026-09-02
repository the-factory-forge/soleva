// Team data. Bios come verbatim from the source exports:
//   content-export/soleva.org/fr/team.json
//   content-export/soleva.org/en/team.json
// Roles are DISPLAYED from the per-locale dict (dict.equipe.roles.<roleKey> /
// dict.equipe.mentorRoles.<roleKey>), never from the `role` string below (kept
// for backwards compatibility). Bios hold fr/en verbatim source text plus
// faithful de/it translations of the same content. Lucanaël and Roman have no
// bio in either source export, so their `bio` is left undefined.

export type BioLocales = "fr" | "en" | "de" | "it";

export interface TeamMember {
  name: string;
  /** @deprecated Render role from dict.equipe.roles.<roleKey> instead. */
  role: string;
  roleKey: string;
  email?: string;
  linkedin?: string;
  bio?: Record<BioLocales, string>;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Curdin Wüthrich",
    role: "CEO et co-fondateur",
    roleKey: "curdin",
    email: "curdin.wuethrich@soleva.org",
    linkedin: "https://www.linkedin.com/in/curdin-wuethrich/",
    bio: {
      fr: "Les premières graines de Soleva ont été plantées dans son esprit il y a environ trois ans, à partir du rêve d'un moyen plus durable de voyager avec tout le confort de la vie en van. Le concept est passé d'un simple espace de vie durable, avec un moteur à hydrogène alimenté par l'énergie solaire, à ce qu'il est aujourd'hui. En dehors de la photographie de paysages ou de l'escalade, Curdin fait des recherches sur la fusion nucléaire dans le cadre de son doctorat à l'EPFL. Il est titulaire d'un master en physique et ingénierie de l'EPFL et a acquis une expérience dans le domaine de la recherche sur la fabrication de produits photovoltaïques au CSEM. Désormais notre PDG, Curdin tient les rênes du projet, s'occupe des relations extérieures, gère notre équipe et, comme il aime à le dire, fait tout ce que personne d'autre n'a le temps de faire.",
      en: "Starting with the dream about a more sustainable way to travel with all the comfort of van life, the first seeds of Soleva were planted in his mind about 3 years ago. The concept grew from just a sustainable living space, over a solar-powered hydrogen engine, to what it is now. Aside of photographing landscapes or climbing, Curdin is researching nuclear fusion for his PhD position at the EPFL. He has a Master degree in physics & engineering from EPFL and experience in the field of photovoltaics manufacturing research at CSEM. Now our CEO, Curdin holds the reins of the project, handles external relations, manages our team, and, as he likes to say, does everything that no one else has time to do.",
      de: "Die ersten Samen von Soleva wurden vor etwa drei Jahren in seinem Kopf gepflanzt, aus dem Traum von einer nachhaltigeren Art zu reisen, mit dem ganzen Komfort des Van-Lebens. Das Konzept wuchs von einem nachhaltigen Wohnraum über einen solarbetriebenen Wasserstoffmotor zu dem, was es heute ist. Neben Landschaftsfotografie oder Klettern forscht Curdin im Rahmen seiner Doktorarbeit an der EPFL an der Kernfusion. Er hat einen Master in Physik und Ingenieurwesen der EPFL und Erfahrung in der Forschung zur Herstellung von Photovoltaik-Produkten am CSEM. Als unser CEO hält Curdin die Zügel des Projekts in der Hand, kümmert sich um die Außenbeziehungen, leitet unser Team und macht, wie er gerne sagt, alles, wofür sonst niemand Zeit hat.",
      it: "I primi semi di Soleva sono stati piantati nella sua mente circa tre anni fa, partendo dal sogno di un modo più sostenibile di viaggiare con tutto il comfort della vita in van. Il concetto è cresciuto da un semplice spazio abitativo sostenibile, passando per un motore a idrogeno alimentato dal sole, fino a quello che è oggi. Oltre alla fotografia di paesaggi o all'arrampicata, Curdin fa ricerca sulla fusione nucleare per il suo dottorato all'EPFL. Ha un master in fisica e ingegneria dell'EPFL ed esperienza nella ricerca sulla produzione di prodotti fotovoltaici al CSEM. Ora il nostro CEO, Curdin tiene le redini del progetto, si occupa delle relazioni esterne, gestisce il nostro team e, come ama dire, fa tutto ciò per cui nessun altro ha tempo.",
    },
  },
  {
    name: "Matthieu Bourgois",
    role: "CTO, co-fondateur, intégration mécanique",
    roleKey: "matthieu",
    email: "matthieu.bourgois@soleva.org",
    linkedin: "https://www.linkedin.com/in/matthieu-bourgois-1302/",
    bio: {
      fr: "Matthieu est le cerveau technique de Soleva et a été au cœur du concept dès le début en tant que cofondateur. Il a étudié le génie mécanique à l'EPFL et travaille maintenant dans l'industrie des composites en fibres naturelles. Il est passionné par les véhicules de toutes sortes et n'a pas peur de se salir les mains. Pour la Formula Student, Matthieu a construit une voiture de course entièrement à partir de zéro en tant que membre du Lausanne Racing Team. Chez Soleva, Matthieu s'occupe de l'aspect technique du projet, en coordonnant les différents domaines. Avec sa grande expertise dans le travail sur les voitures et dans la conception mécanique, il est un membre inestimable de notre équipe.",
      en: "Matthieu is our technical mastermind behind Soleva and has been at the heart of the concept from the beginning as co-founder. He studied mechanical engineering at EPFL and is now working in the natural fibre composite industry. He is passionate about vehicles of all kinds and is not afraid to get his hands dirty. For the Formula Student, Matthieu built a racing car completely from scratch as a member of the Lausanne Racing Team. At Soleva, Matthieu handles the technical side of the project, coordinating the various domains. With his vast expertise in working on cars and in mechanical design, he is an invaluable member of our Team.",
      de: "Matthieu ist der technische Kopf hinter Soleva und war von Anfang an als Mitgründer am Konzept beteiligt. Er studierte Maschinenbau an der EPFL und arbeitet heute in der Industrie für Naturfaserverbundstoffe. Er begeistert sich für Fahrzeuge aller Art und hat keine Angst, sich die Hände schmutzig zu machen. Für die Formula Student baute Matthieu als Mitglied des Lausanne Racing Team ein Rennfahrzeug komplett von Grund auf. Bei Soleva kümmert sich Matthieu um die technische Seite des Projekts und koordiniert die verschiedenen Bereiche. Mit seiner großen Erfahrung in der Arbeit an Autos und im mechanischen Design ist er ein unschätzbares Mitglied unseres Teams.",
      it: "Matthieu è il cervello tecnico di Soleva ed è stato al centro del concetto fin dall'inizio come cofondatore. Ha studiato ingegneria meccanica all'EPFL e ora lavora nell'industria dei compositi in fibre naturali. È appassionato di veicoli di ogni tipo e non ha paura di sporcarsi le mani. Per la Formula Student, Matthieu ha costruito un'auto da corsa completamente da zero come membro del Lausanne Racing Team. A Soleva, Matthieu si occupa dell'aspetto tecnico del progetto, coordinando i vari ambiti. Con la sua vasta esperienza nel lavorare sulle auto e nella progettazione meccanica, è un membro inestimabile del nostro team.",
    },
  },
  {
    name: "Max Chevron",
    role: "Trésorier, gestion batteries",
    roleKey: "max",
    email: "max.chevron@soleva.org",
    linkedin: "https://www.linkedin.com/in/maxchevron/",
    bio: {
      fr: "Max est chargé de remplacer le réservoir de carburant par des batteries. Après des études en économie et un travail dans le conseil en gestion, son envie de contribuer à la transition énergétique l'a conduit à une réorientation professionnelle. Il est désormais ingénieur électricien spécialisé dans les systèmes énergétiques. Il a été membre de l'équipe batterie de l'hyperloop de l'EPFL et travaille actuellement dans une startup dans le contrôle des systèmes de stockage d'énergie par batterie. De plus, Max est toujours partant pour une nouvelle aventure, surtout si elle inclut la montagne et l'escalade ! Ainsi, avec sa passion pour les voyages et son souci de la durabilité, il s'est senti intrinsèquement motivé pour contribuer à la mission de Soleva.",
      en: "Max is responsible of replacing the fuel tank with batteries. After studies in economics and work in management consulting, his urge to contribute to the energy transition led him to a career shift. He is now an electrical engineer specialised in energy systems. He was a battery team member of EPFL hyperloop and is currently working in a startup in battery energy storage systems control. Moreover, Max is always up for a new adventure, especially if it includes mountains and rock climbing! Hence, with a passion for travelling and care for sustainability, he felt intrinsically motivated to contribute into Soleva's mission.",
      de: "Max ist dafür verantwortlich, den Kraftstofftank durch Batterien zu ersetzen. Nach einem Studium der Wirtschaftswissenschaften und einer Tätigkeit in der Managementberatung führte ihn sein Wunsch, zur Energiewende beizutragen, zu einem beruflichen Wechsel. Er ist heute Elektroingenieur mit Spezialisierung auf Energiesysteme. Er war Mitglied des Batterieteams des EPFL-Hyperloop und arbeitet derzeit in einem Startup im Bereich der Steuerung von Batterie-Energiespeichersystemen. Außerdem ist Max immer für ein neues Abenteuer zu haben, vor allem wenn es Berge und Klettern einschließt! Mit seiner Reiselust und seinem Sinn für Nachhaltigkeit fühlte er sich daher intrinsisch motiviert, zur Mission von Soleva beizutragen.",
      it: "Max è incaricato di sostituire il serbatoio del carburante con delle batterie. Dopo studi in economia e un lavoro nella consulenza gestionale, il suo desiderio di contribuire alla transizione energetica lo ha portato a un cambio di carriera. Ora è un ingegnere elettrico specializzato in sistemi energetici. È stato membro del team batterie dell'hyperloop dell'EPFL e attualmente lavora in una startup nel controllo dei sistemi di accumulo di energia a batteria. Inoltre, Max è sempre pronto per una nuova avventura, soprattutto se include montagna e arrampicata! Così, con la passione per i viaggi e la cura per la sostenibilità, si è sentito intrinsecamente motivato a contribuire alla missione di Soleva.",
    },
  },
  {
    name: "Tobia Wyss",
    role: "Co-fondateur, intégration solaire",
    roleKey: "tobia",
    email: "tobia.wyss@soleva.org",
    linkedin: "https://www.linkedin.com/in/tobiawyss/",
    bio: {
      fr: "Titulaire d'un MSc en gestion de l'énergie et durabilité à l'EPFL, Tobia travaille dans la rénovation de bâtiments, et aide les gens à accomplir leur transition énergétique. Après avoir passé un an autour du monde sur son vélo, il est impatient de contribuer à la création de notre véhicule entièrement solaire. Son travail à SOLEVA est de superviser la conception et la construction du système solaire pliable, afin de servir le véhicule électrique de la manière la plus efficace possible.",
      en: "With a MSc in Energy management and sustainability at EPFL, Tobia works in building renovation, and helps people to accomplish their energy transition. After having spent a year around the world on his bicycle, he's eager to contribute to the creation of our entirely solar powered vehicle. His job at SOLEVA is to supervise the design and building of the foldable solar system, in order to serve the electric vehicle in the most efficient way.",
      de: "Mit einem MSc in Energiemanagement und Nachhaltigkeit an der EPFL arbeitet Tobia in der Gebäudesanierung und hilft Menschen, ihre Energiewende zu vollziehen. Nachdem er ein Jahr mit dem Fahrrad um die Welt gereist ist, ist er bestrebt, zur Schaffung unseres komplett solarbetriebenen Fahrzeugs beizutragen. Seine Aufgabe bei SOLEVA ist es, die Konstruktion und den Bau des faltbaren Solarsystems zu überwachen, um das Elektrofahrzeug so effizient wie möglich zu versorgen.",
      it: "Con un MSc in gestione dell'energia e sostenibilità all'EPFL, Tobia lavora nella ristrutturazione degli edifici e aiuta le persone a compiere la loro transizione energetica. Dopo aver passato un anno in giro per il mondo in bicicletta, non vede l'ora di contribuire alla creazione del nostro veicolo completamente alimentato dal sole. Il suo lavoro a SOLEVA è supervisionare la progettazione e la costruzione del sistema solare pieghevole, per servire il veicolo elettrico nel modo più efficiente possibile.",
    },
  },
  {
    name: "Sara Bossuyt",
    role: "Co-fondatrice, communication et habitat",
    roleKey: "sara",
    email: "sara.bossuyt@soleva.org",
    linkedin: "https://www.linkedin.com/in/sarabossuyt/",
    bio: {
      fr: "Après avoir étudié l'ingénierie environnementale à Louvain, en Belgique, Sara travaille maintenant dans le domaine de la distribution de l'eau en Valais, en Suisse. Elle est motivée par la recherche de nouveaux moyens de réduire notre empreinte écologique. Alors que le camping et les voyages dans la nature sont parmi ses formes de voyage préférées, pourquoi ne pas y chercher des solutions ? Chez Soleva, Sara est en charge de la communication (comme les profils sur les médias sociaux) et de la conception de l'espace de vie intérieur. Elle fait également partie du voyage depuis le début en tant que cofondatrice.",
      en: "After studying Environmental engineering in Leuven, Belgium, Sara now works in the field of water distribution in Valais, Switzerland. She is driven to find new ways to reduce our environmental footprint. While camping and travelling through nature is among her favorite forms of travel, why not search for solutions there? At Soleva, Sara is in charge of the communication (such as social media profiles) and the design of the interior living space. She is also part of the journey from the beginning as co-founder.",
      de: "Nach ihrem Studium der Umwelttechnik in Löwen, Belgien, arbeitet Sara heute im Bereich der Wasserverteilung im Wallis, in der Schweiz. Sie ist motiviert, neue Wege zur Verringerung unseres ökologischen Fußabdrucks zu finden. Da Camping und Reisen in der Natur zu ihren liebsten Reiseformen gehören, warum nicht dort nach Lösungen suchen? Bei Soleva ist Sara für die Kommunikation (wie die Profile in den sozialen Medien) und die Gestaltung des Innenraums zuständig. Sie ist seit Beginn als Mitgründerin Teil des Projekts.",
      it: "Dopo aver studiato ingegneria ambientale a Lovanio, in Belgio, Sara ora lavora nel campo della distribuzione dell'acqua in Vallese, in Svizzera. È motivata dalla ricerca di nuovi modi per ridurre la nostra impronta ecologica. Poiché il campeggio e i viaggi nella natura sono tra le sue forme di viaggio preferite, perché non cercare lì delle soluzioni? A Soleva, Sara è responsabile della comunicazione (come i profili sui social media) e della progettazione dello spazio abitativo interno. Fa parte del viaggio fin dall'inizio come cofondatrice.",
    },
  },
  {
    name: "Sévane Bercher",
    role: "Co-fondatrice, juridique",
    roleKey: "sevane",
    email: "sevane.bercher@soleva.org",
    linkedin: "https://www.linkedin.com/in/s%C3%A9vane-bercher-715969144/",
    bio: {
      fr: "Sévane a étudié le droit dans les universités de Genève et de Lausanne et travaille actuellement comme avocate stagiaire dans la région. Même si ce n'est pas son domaine, elle adore en apprendre davantage sur le \"retrofitting\", la mobilité solaire et les voyages durables. En tant que bonne amie de Curdin, elle a immédiatement aimé le concept et a contribué à construire ce projet à partir de zéro en tant que co-fondatrice. Ses connaissances sont très précieuses pour suivre toutes les législations suisses. Sévane dispose également d'un excellent réseau de personnes intéressantes en Suisse et de grandes compétences en communication qui nous ont permis d'obtenir une visibilité dans les journaux locaux, à la radio et même à la télévision.",
      en: "Sévane studied law in the universities of Geneva and Lausanne and is now working as a trainee lawyer in the area. Even though it's not her field, she loves to learn more about “retrofitting”, solar mobility and sustainable travel. As a good friend of Curdin, she immediately loved the concept and contributed to building this project from scratch as co-founder. Her knowledge is very precious to follow all Swiss legislations. Sévane also has a great network of interesting people in Switzerland and has great communication skills that helped us get visibility in the local newspaper, radio and even TV.",
      de: "Sévane studierte Jura an den Universitäten Genf und Lausanne und arbeitet derzeit als Rechtsanwältin in Ausbildung in der Region. Auch wenn es nicht ihr Fachgebiet ist, lernt sie gerne mehr über \"Retrofitting\", solare Mobilität und nachhaltiges Reisen. Als gute Freundin von Curdin gefiel ihr das Konzept sofort und sie trug von Anfang an als Mitgründerin zum Aufbau dieses Projekts bei. Ihr Wissen ist sehr wertvoll, um alle Schweizer Gesetzgebungen zu verfolgen. Sévane verfügt außerdem über ein ausgezeichnetes Netzwerk interessanter Menschen in der Schweiz und über große kommunikative Fähigkeiten, die uns Sichtbarkeit in lokalen Zeitungen, im Radio und sogar im Fernsehen verschafft haben.",
      it: "Sévane ha studiato giurisprudenza alle università di Ginevra e Losanna e ora lavora come avvocato tirocinante nella regione. Anche se non è il suo campo, ama imparare di più sul \"retrofitting\", la mobilità solare e i viaggi sostenibili. In quanto buona amica di Curdin, le è subito piaciuto il concetto e ha contribuito a costruire questo progetto da zero come cofondatrice. Le sue conoscenze sono molto preziose per seguire tutte le legislazioni svizzere. Sévane ha anche un'ottima rete di persone interessanti in Svizzera e grandi capacità comunicative che ci hanno aiutato a ottenere visibilità sui giornali locali, alla radio e persino in televisione.",
    },
  },
  {
    name: "Lucanaël Kopf",
    role: "Chef de projet intégration mécanique",
    roleKey: "lucanael",
    linkedin: "https://www.linkedin.com/in/lucanaël-kopf-60a334198/",
    // No bio in the source exports (fr/en) - left undefined.
  },
  {
    name: "Roman Schmitz",
    role: "Chef de projet électrification",
    roleKey: "roman",
    email: "roman.schmitz@soleva.org",
    linkedin: "https://www.linkedin.com/in/roman-schmitz-bba165b2/",
    // No bio in the source exports (fr/en) - left undefined.
  },
  {
    name: "Nicola Offeddu",
    role: "Construction habitat durable",
    roleKey: "nicola",
    linkedin: "https://www.linkedin.com/in/nicola-offeddu-63b07a130/",
    bio: {
      fr: "Nico est un alpiniste passionné par la nature et tout ce qui touche au plein air. Passionné d'escalade et de bois, il a construit des saunas et des cabanes dans les arbres et travaille actuellement comme professeur d'escalade à Lausanne. Après avoir obtenu son doctorat en fusion nucléaire à l'EPFL, il a rejoint Soleva et est maintenant en charge du travail du bois, de la construction de l'habitat et de rendre Sunny le van plus acceuillant que jamais !",
      en: "Nico is an avid mountaineer with a passion for nature and all things outdoors. Crazy about climbing and wood, he has built saunas and treehouses and currently works as a climbing teacher in Lausanne. After earning his PhD in Nuclear Fusion from EPFL, he joined Soleva and is now in charge of woodworking, building the habitat and making Sunny the van cozier than ever!",
      de: "Nico ist ein begeisterter Bergsteiger mit einer Leidenschaft für die Natur und alles, was draußen stattfindet. Er ist verrückt nach Klettern und Holz, hat Saunen und Baumhäuser gebaut und arbeitet derzeit als Kletterlehrer in Lausanne. Nach seiner Promotion in Kernfusion an der EPFL kam er zu Soleva und ist jetzt für die Holzbearbeitung, den Bau des Wohnraums und dafür zuständig, den Van Sunny gemütlicher denn je zu machen!",
      it: "Nico è un alpinista appassionato di natura e di tutto ciò che riguarda la vita all'aria aperta. Pazzo per l'arrampicata e il legno, ha costruito saune e case sugli alberi e attualmente lavora come insegnante di arrampicata a Losanna. Dopo aver ottenuto il dottorato in fusione nucleare all'EPFL, è entrato a far parte di Soleva e ora è responsabile della lavorazione del legno, della costruzione dell'habitat e del rendere Sunny il van più accogliente che mai!",
    },
  },
];

export const mentors: TeamMember[] = [
  {
    name: "Marc Müller",
    role: "Fondateur ICARE (tour du monde solaire), Président Impact Living",
    roleKey: "marc",
    linkedin: "https://www.linkedin.com/in/marc-muller-b255156/",
    bio: {
      fr: "Fondateur du projet ICARE : un des premiers à réaliser le tour du monde à l'énergie solaire autoportée. Fondateur et Président de Impact Living",
      en: "Founder of ICARE project as one of the first around the world trip purely using self carried solar energy Founder and CEO of Impact Living",
      de: "Gründer des Projekts ICARE: einer der ersten, die eine Weltreise mit autarker Solarenergie unternommen haben. Gründer und Präsident von Impact Living",
      it: "Fondatore del progetto ICARE: uno dei primi a realizzare il giro del mondo con energia solare autosufficiente. Fondatore e Presidente di Impact Living",
    },
  },
  {
    name: "André Hodder",
    role: "Enseignant-chercheur EPFL, moteurs électriques",
    roleKey: "andre",
    linkedin: "https://www.linkedin.com/in/andr%C3%A9-hodder-phd-8249961a/",
    bio: {
      fr: "Enseignant et chercheur à l'EPFL Expert en moteurs électriques et conversion d'énergie",
      en: "EPFL lecturer and researcher Expert in Electrical motors and Energy Conversion",
      de: "Dozent und Forscher an der EPFL. Experte für Elektromotoren und Energieumwandlung",
      it: "Docente e ricercatore all'EPFL. Esperto di motori elettrici e conversione dell'energia",
    },
  },
  {
    name: "Louis Palmer",
    role: "Fondateur SolarTaxi, SolarButterfly, WAVE",
    roleKey: "louis",
    linkedin: "https://www.linkedin.com/in/louis-palmer-094b9923/",
    bio: {
      fr: "Expert en énergie solaire et pionnier en mobilité solaire électrique Fondateur de WAVE “ World Advanced Vehicle Expedition” et du SolarTaxi Fondateur du projet SolarButterfly",
      en: "Solar energy expert and pioneer in solar electric mobility Founder of WAVE World Advanced Vehicle Expedition and the Solar Taxi Founder of the SolarButterfly project",
      de: "Experte für Solarenergie und Pionier der solarelektrischen Mobilität. Gründer von WAVE World Advanced Vehicle Expedition und des SolarTaxi. Gründer des Projekts SolarButterfly",
      it: "Esperto di energia solare e pioniere della mobilità solare elettrica. Fondatore di WAVE World Advanced Vehicle Expedition e del SolarTaxi. Fondatore del progetto SolarButterfly",
    },
  },
  {
    name: "Prof. Dr. Werner Stednitz",
    role: "Professeur « Advanced Automotive Concepts » HTW Berlin",
    roleKey: "werner",
    linkedin: "https://www.htw-berlin.de/hochschule/personen/person/?eid=1026",
    bio: {
      fr: "Professeur de Concepts Automobiles Avancés\" au HTW de Berlin",
      en: "Professor for advanced Automotive Concepts at the HTW Berlin",
      de: "Professor für Advanced Automotive Concepts an der HTW Berlin",
      it: "Professore di Advanced Automotive Concepts alla HTW Berlin",
    },
  },
];
