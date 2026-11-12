export type ChronoEntry = {
  id: string
  date: string
  event: string
  detail: string
  source: string
  link?: { label: string; path: string }
  phase: 'promesse' | 'experimentation' | 'commun'
}

export const CHRONOLOGIE: ChronoEntry[] = [
  {
    id: 'annee-1976',
    date: '1976',
    event: 'Premier système de vélos en libre-service à La Rochelle',
    detail: 'La Rochelle installe l’un des tout premiers systèmes de vélos en libre-service.',
    source: 'Numéricité',
    link: { label: 'La Rochelle', path: '/partie-1/la-rochelle/' },
    phase: 'experimentation',
  },
  {
    id: 'annee-2000',
    date: '2000',
    event: 'Création de la FING par Daniel Kaplan',
    detail: 'Fondation internet nouvelle génération, association loi 1901, think & do tank sur les transformations numériques.',
    source: 'FING / Wikipédia',
    link: { label: 'La FING', path: '/partie-1/fing/#qui-est-la-fing' },
    phase: 'promesse',
  },
  {
    id: 'annee-2009',
    date: '2009',
    event: 'Bruno Marzloff : la place de marché peut devenir un cauchemar',
    detail: 'Une des premières mises en garde, citée dans le document de la FING de 2012.',
    source: 'FING',
    link: { label: 'Citations', path: '/partie-1/fing/#citations' },
    phase: 'promesse',
  },
  {
    id: 'annee-2012',
    date: '2012',
    event: 'Prospective FING « Une mobilité plus libre, plus diverse, plus riche, plus durable »',
    detail: 'Page mise à jour le 12 novembre 2012 ; atelier de Paris le 24 octobre 2012.',
    source: 'FING',
    link: { label: 'La promesse initiale', path: '/partie-1/fing/#promesse-initiale' },
    phase: 'promesse',
  },
  {
    id: 'annee-2017',
    date: '2017',
    event: 'Création de la Fabrique des Mobilités',
    detail: 'Association dédiée aux modèles ouverts et aux ressources pérennes pour la mobilité.',
    source: 'FabMob',
    link: { label: 'La Fabrique des Mobilités', path: '/partie-2/fabrique-des-mobilites/' },
    phase: 'commun',
  },
  {
    id: 'annee-2018-2019',
    date: '2018-2019',
    event: 'Self Data Territorial à La Rochelle',
    detail: 'Avec la FING, l’agglomération identifie des cas d’usage ; Coach CO2 est retenu.',
    source: 'Numéricité',
    link: { label: 'La Rochelle', path: '/partie-1/la-rochelle/#ce-que-c-est' },
    phase: 'experimentation',
  },
  {
    id: 'annee-2021-2023',
    date: '2021-2023',
    event: 'Expérimentation Coach CO2 / TraceMob',
    detail: '35 mois ; 80 bêta-testeurs dès janvier 2021 ; TraceMob en production en mars 2021.',
    source: 'Numéricité',
    link: { label: 'Le déroulé', path: '/partie-1/la-rochelle/#deroule' },
    phase: 'experimentation',
  },
  {
    id: 'annee-2023',
    date: '2023',
    event: 'TraceMob présenté comme un commun',
    detail: 'Article « TraceMob, sur les traces d’un commun de la mobilité ? ».',
    source: 'FabMob',
    link: { label: 'TraceMob', path: '/partie-2/tracemob/' },
    phase: 'commun',
  },
  {
    id: 'annee-2024',
    date: '2024',
    event: '« 10 communs numériques essentiels pour une mobilité décarbonée »',
    detail: 'La FabMob hiérarchise les ressources partagées à maintenir en priorité.',
    source: 'FabMob',
    link: { label: 'Les dix communs', path: '/partie-2/fabrique-des-mobilites/#dix-communs' },
    phase: 'commun',
  },
  {
    id: 'annee-2025',
    date: '2025',
    event: 'Publication ADEME sur les dispositifs d’enquête',
    detail: 'Février 2025 : « L’utilisation des dispositifs d’enquête pour l’action publique ».',
    source: 'ADEME',
    link: { label: 'Dispositifs d’enquête', path: '/partie-2/enquetes/' },
    phase: 'commun',
  },
]

export type GlossaryEntry = {
  id: string
  term: string
  definition: string
  source: string
  pages: { label: string; path: string }[]
}

export const GLOSSAIRE: GlossaryEntry[] = [
  {
    id: 'anonymisation',
    term: 'Anonymisation',
    definition:
      'Traitement qui rend impossible, de façon irréversible, la réidentification d’une personne. À distinguer de la pseudonymisation, réversible. Les traces de mobilité sont réputées difficiles à anonymiser : quelques points suffisent souvent à retrouver un domicile.',
    source: 'CNIL',
    pages: [{ label: 'TraceMob', path: '/partie-2/tracemob/#questions-a-poser' }],
  },
  {
    id: 'commun-numerique',
    term: 'Commun numérique',
    definition:
      'Ressource numérique produite et gouvernée collectivement, dont l’accès et la réutilisation sont organisés par des règles explicites. Quatre dimensions : ressource, communauté, règles, gouvernance.',
    source: 'Ce site, d’après la Fabrique des Mobilités',
    pages: [{ label: 'Communs numériques', path: '/partie-2/communs-numeriques/#definition' }],
  },
  {
    id: 'donnee-personnelle',
    term: 'Donnée personnelle',
    definition:
      'Toute information se rapportant à une personne physique identifiée ou identifiable. Une trace de mobilité en est une : elle révèle lieux de vie, de travail et habitudes.',
    source: 'RGPD, article 4',
    pages: [{ label: 'TraceMob', path: '/partie-2/tracemob/#questions-a-poser' }],
  },
  {
    id: 'e-mission',
    term: 'E-Mission',
    definition:
      'Plateforme open source de collecte et d’analyse de traces de mobilité sur smartphone. Elle sert de base logicielle à TraceMob.',
    source: 'Numéricité ; Fabrique des Mobilités',
    pages: [
      { label: 'TraceMob', path: '/partie-2/tracemob/#e-mission' },
      { label: 'La Rochelle', path: '/partie-1/la-rochelle/' },
    ],
  },
  {
    id: 'gouvernance',
    term: 'Gouvernance',
    definition:
      'Ensemble des règles et des instances qui déterminent qui décide des évolutions d’une ressource, comment, et comment on entre dans un commun ou on en sort.',
    source: 'Ce site',
    pages: [{ label: 'Communs numériques', path: '/partie-2/communs-numeriques/#quatre-dimensions' }],
  },
  {
    id: 'innovation-ouverte',
    term: 'Innovation ouverte',
    definition:
      'Démarche d’innovation qui s’appuie sur des contributions extérieures à une organisation et partage ses résultats, pour que chaque contribution profite aux suivantes.',
    source: 'Fabrique des Mobilités',
    pages: [{ label: 'Fabrique des Mobilités', path: '/partie-2/fabrique-des-mobilites/#methode' }],
  },
  {
    id: 'intermodalite',
    term: 'Intermodalité',
    definition:
      'Utilisation successive de plusieurs modes de transport au cours d’un même déplacement. La FING en faisait en 2012 l’une des sept attentes envers le numérique.',
    source: 'FING, 2012',
    pages: [{ label: 'Les sept attentes', path: '/partie-1/fing/#sept-attentes' }],
  },
  {
    id: 'licence-libre',
    term: 'Licence libre',
    definition:
      'Licence qui accorde les libertés d’utiliser, d’étudier, de modifier et de redistribuer une œuvre ou un logiciel. Exemples : MIT, GPL pour le code ; CC BY-SA pour les textes.',
    source: 'Ce site',
    pages: [
      { label: 'Communs numériques', path: '/partie-2/communs-numeriques/#quatre-dimensions' },
      { label: 'Licence du site', path: '/a-propos/#licence' },
    ],
  },
  {
    id: 'living-lab',
    term: 'Living Lab',
    definition:
      'Démarche de conception et d’expérimentation menée en conditions réelles, avec les usagers comme co-concepteurs. Cycle\'Up s’appuie sur un panel de volontaires.',
    source: 'État de l’art Cycle\'Up, 2026',
    pages: [{ label: 'Territoires peu denses', path: '/partie-2/territoires-peu-denses/#cycle-up' }],
  },
  {
    id: 'maas',
    term: 'MaaS',
    definition:
      'Mobility as a Service. Intégration, dans un service unique, de l’information, de la réservation et du paiement de plusieurs offres de mobilité. Une forme contemporaine de la promesse d’intermodalité.',
    source: 'Ce site',
    pages: [{ label: 'Les sept attentes', path: '/partie-1/fing/#sept-attentes' }],
  },
  {
    id: 'masse-critique',
    term: 'Masse critique',
    definition:
      'Nombre minimal d’usagers à partir duquel un service partagé, comme une ligne de covoiturage, devient fiable et donc attractif. En territoire peu dense, elle est souvent le vrai verrou.',
    source: 'État de l’art Cycle\'Up, 2026',
    pages: [{ label: 'Territoires peu denses', path: '/partie-2/territoires-peu-denses/' }],
  },
  {
    id: 'neo-nomadisme',
    term: 'Néo-nomadisme',
    definition:
      'Notion de Yasmine Abbas (2011) : un mode de vie qui capitalise sur les avantages de la mobilité multiple, physique et numérique.',
    source: 'Abbas, 2011, cité par la FING',
    pages: [{ label: 'Controverses', path: '/partie-1/controverses/#reliance-et-nomadisme' }],
  },
  {
    id: 'open-source',
    term: 'Open source',
    definition:
      'Logiciel dont le code source est publié sous une licence permettant de l’étudier, de le modifier et de le redistribuer. L’ouverture du code ne dit rien, à elle seule, de la gouvernance ni du financement.',
    source: 'Open Source Initiative',
    pages: [
      { label: 'Communs numériques', path: '/partie-2/communs-numeriques/#a-eviter' },
      { label: 'TraceMob', path: '/partie-2/tracemob/' },
    ],
  },
  {
    id: 'part-modale',
    term: 'Part modale',
    definition:
      'Proportion des déplacements effectués avec un mode donné (voiture, vélo, marche…). Mesurée à l’échelle nationale par le SDES ; rarement disponible à l’échelle d’une vallée.',
    source: 'SDES',
    pages: [{ label: 'Ordres de grandeur', path: '/partie-1/ademe-sdes/#ordres-de-grandeur' }],
  },
  {
    id: 'reappropriation',
    term: 'Réappropriation',
    definition:
      'Fait, pour un usager, de récupérer les données qui le concernent et d’en faire usage pour ses propres fins. Objectif affiché de l’expérimentation de La Rochelle.',
    source: 'Numéricité',
    pages: [{ label: 'La Rochelle', path: '/partie-1/la-rochelle/' }],
  },
  {
    id: 'reliance',
    term: 'Reliance',
    definition:
      'Notion de Georges Amar (2012) : la valeur d’un déplacement tient aux liens qu’il crée plutôt qu’à la distance parcourue. Elle invite à mesurer la mobilité autrement qu’en kilomètres — en reliance par kilomètre plutôt qu’en vitesse.',
    source: 'Amar, 2012, cité par la FING',
    pages: [
      { label: 'Controverses', path: '/partie-1/controverses/#reliance-et-nomadisme' },
      { label: 'La FING', path: '/partie-1/fing/#contradictions' },
    ],
  },
  {
    id: 'self-data',
    term: 'Self data',
    definition:
      'Production, exploitation et partage de données personnelles par les individus eux-mêmes, sous leur contrôle et à leurs propres fins. Notion portée en France par la FING.',
    source: 'FING',
    pages: [{ label: 'La Rochelle', path: '/partie-1/la-rochelle/#ce-que-c-est' }],
  },
  {
    id: 'self-data-territorial',
    term: 'Self Data Territorial',
    definition:
      'Application du self data à l’échelle d’un territoire : une collectivité aide ses habitants à récupérer et utiliser leurs données. Exploré à La Rochelle en 2018-2019 avec la FING.',
    source: 'Numéricité',
    pages: [{ label: 'La Rochelle', path: '/partie-1/la-rochelle/#ce-que-c-est' }],
  },
  {
    id: 'tiers-lieu',
    term: 'Tiers-lieu',
    definition:
      'Lieu intermédiaire de travail et de socialisation, ni domicile ni bureau. La FING de 2012 y voyait un moyen de réduire les déplacements ; Rallet et Torre rappellent qu’il ne remplace pas le face-à-face.',
    source: 'FING, 2012',
    pages: [{ label: 'Le face-à-face', path: '/partie-1/controverses/#face-a-face' }],
  },
  {
    id: 'trace-de-mobilite',
    term: 'Trace de mobilité',
    definition:
      'Enregistrement horodaté des positions successives d’une personne ou d’un véhicule (GPS, capteurs du téléphone). Elle dit l’itinéraire, pas le motif.',
    source: 'Ce site',
    pages: [
      { label: 'TraceMob', path: '/partie-2/tracemob/' },
      { label: 'Dispositifs d’enquête', path: '/partie-2/enquetes/#typologie' },
    ],
  },
]

export type BiblioEntry = {
  id: string
  ref: string
  kind: 'primaire' | 'secondaire' | 'citee'
  url?: string
  consulted?: string
  note?: string
  pages: { label: string; path: string }[]
}

export const BIBLIOGRAPHIE: BiblioEntry[] = [
  {
    id: 'numericite-2021',
    ref: 'Numéricité, *Promouvoir les mobilités durables en favorisant la réappropriation par les usagers de leurs données*, 2021-2023.',
    kind: 'primaire',
    url: 'https://numericite.eu/realisations/promouvoir-les-mobilites-durables-en-favorisant-la-reappropriation-par-les-usagers-de-leurs-donnees',
    pages: [{ label: 'La Rochelle', path: '/partie-1/la-rochelle/' }],
  },
  {
    id: 'fing-2012',
    ref: 'FING, *Une mobilité plus libre, plus diverse, plus riche, plus durable*, mis à jour le 12 novembre 2012 par Margaux Pasquet.',
    kind: 'primaire',
    url: 'https://archives.fing.org/reseau/pages/view/116442/index.html',
    note: 'Archive statique du réseau social de la FING, page 116442.',
    pages: [
      { label: 'La FING', path: '/partie-1/fing/' },
      { label: 'Controverses', path: '/partie-1/controverses/' },
    ],
  },
  {
    id: 'fing-atelier-2012',
    ref: 'FING, compte-rendu de l’atelier de Paris, 24 octobre 2012.',
    kind: 'primaire',
    url: 'https://archives.fing.org/reseau/pages/view/120774/index.html',
    pages: [{ label: 'La FING', path: '/partie-1/fing/' }],
  },
  {
    id: 'fabmob-tracemob',
    ref: 'Fabrique des Mobilités, page *TraceMob*.',
    kind: 'primaire',
    url: 'https://lafabriquedesmobilites.fr/tracemob',
    pages: [{ label: 'TraceMob', path: '/partie-2/tracemob/' }],
  },
  {
    id: 'fabmob-socle',
    ref: 'Fabrique des Mobilités, *Socle de compréhension des Communs Numériques de la Mobilité*.',
    kind: 'primaire',
    url: 'https://librairie.ademe.fr/mobilite-et-transports/6330-socle-de-comprehension-des-communs-numeriques-de-la-mobilite.html',
    pages: [{ label: 'Communs numériques', path: '/partie-2/communs-numeriques/#socle' }],
  },
  {
    id: 'fabmob-guide',
    ref: 'Fabrique des Mobilités, *Guide méthodologique pour structurer un commun numérique dans la mobilité*.',
    kind: 'primaire',
    url: 'https://librairie.ademe.fr/mobilite-et-transports/6330-socle-de-comprehension-des-communs-numeriques-de-la-mobilite.html',
    note: 'Publié par l’ADEME, collection Expertises.',
    pages: [{ label: 'Guide méthodologique', path: '/partie-2/guide-methodologique/' }],
  },
  {
    id: 'fabmob-10-communs',
    ref: 'Fabrique des Mobilités, *10 communs numériques essentiels pour une mobilité décarbonée*, 2024.',
    kind: 'primaire',
    url: 'https://github.com/fabmob/fabmob.io/blob/master/contenu/articles/2024/dix_communs_numeriques_essentiels_mobilite.md',
    pages: [{ label: 'Fabrique des Mobilités', path: '/partie-2/fabrique-des-mobilites/#dix-communs' }],
  },
  {
    id: 'ademe-2025',
    ref: 'ADEME, *L’utilisation des dispositifs d’enquête pour l’action publique*, février 2025.',
    kind: 'primaire',
    url: 'https://infos.ademe.fr/lettre-strategie-fevrier-2025/lutilisation-des-dispositifs-denquete-pour-laction-publique',
    pages: [
      { label: 'Dispositifs d’enquête', path: '/partie-2/enquetes/' },
      { label: 'ADEME et SDES', path: '/partie-1/ademe-sdes/#dispositifs-d-enquete' },
    ],
  },
  {
    id: 'sdes-2023',
    ref: 'SDES, *Environnement, consommation d’énergie et mobilités en 2023*.',
    kind: 'primaire',
    url: 'https://www.statistiques.developpement-durable.gouv.fr/chiffres-cles-des-transports-edition-2023',
    pages: [{ label: 'Ordres de grandeur', path: '/partie-1/ademe-sdes/#ordres-de-grandeur' }],
  },
  {
    id: 'france-mobilites-2021',
    ref: 'France Mobilités, fiche *TraceMob*, 2021.',
    kind: 'secondaire',
    url: 'https://www.francemobilites.fr/solutions/traceur-mobilite-tracemob',
    pages: [{ label: 'TraceMob', path: '/partie-2/tracemob/' }],
  },
  {
    id: 'tracemob-commun-2023',
    ref: '« TraceMob, sur les traces d’un commun de la mobilité ? », 2023.',
    kind: 'secondaire',
    url: 'https://lafabriquedesmobilites.fr/blog/tracemob-commun',
    note: 'Auteur à préciser.',
    pages: [{ label: 'TraceMob', path: '/partie-2/tracemob/' }],
  },
  {
    id: 'smmag',
    ref: 'SMMAG, *M covoit’ Lignes+*, données sur les arrêts 2020-2025.',
    kind: 'secondaire',
    url: 'https://www.lignesplus-m.fr',
    pages: [{ label: 'Territoires peu denses', path: '/partie-2/territoires-peu-denses/#m-covoit' }],
  },
  {
    id: 'aragon',
    ref: 'Gobierno de Aragón, données démographiques de la comarca du Sobrarbe.',
    kind: 'secondaire',
    url: 'https://icearagon.aragon.es/atlas/Aragon/info/poblacion/densidad-de-poblacion/',
    pages: [{ label: 'Territoires peu denses', path: '/partie-2/territoires-peu-denses/#cycle-up' }],
  },
  {
    id: 'hal-moissac-2023',
    ref: 'Kodjo Olivier Adjoto, Mahmoud El Amri et Jean-Baptiste Welté, *Les pratiques de covoiturage en milieu rural : freins et conditions d’acceptation* (enquête de Moissac, 108 entretiens, mars 2023), HAL, 2024.',
    kind: 'secondaire',
    url: 'https://ube.hal.science/hal-04598258v1',
    note: 'Enquête de 108 entretiens menée à Moissac en mars 2023 ; publication HAL en 2024.',
    pages: [{ label: 'Territoires peu denses', path: '/partie-2/territoires-peu-denses/#moissac' }],
  },
  {
    id: 'senat-rural',
    ref: 'Sénat, part des déplacements en voiture en zone rurale.',
    kind: 'secondaire',
    url: 'https://www.senat.fr/rap/r20-313/r20-313.html',
    pages: [{ label: 'Ordres de grandeur', path: '/partie-1/ademe-sdes/#ordres-de-grandeur' }],
  },
  ...(
    [
      ['ascher-2004', 'François Ascher, 2004.'],
      ['rallet-torre-2009', 'Alain Rallet et André Torre, 2009.'],
      ['virilio-2010', 'Paul Virilio, 2010.'],
      ['plassat-2010', 'Gabriel Plassat, 2010.'],
      ['amar-2012', 'Georges Amar, 2012.'],
      ['abbas-2011', 'Yasmine Abbas, 2011.'],
      ['marzloff-2009', 'Bruno Marzloff, 2009.'],
      ['rifkin-2012', 'Jeremy Rifkin, 2012.'],
      ['loviton-1989', 'Christian Loviton, 1989.'],
      ['berhault-2008', 'Gilles Berhault, 2008.'],
    ] as const
  ).map(
    ([id, ref]): BiblioEntry => ({
      id,
      ref,
      kind: 'citee',
      pages: [{ label: 'La FING', path: '/partie-1/fing/#citations' }],
    }),
  ),
]

export type Actor = {
  id: string
  name: string
  kind: string
  summary: string
  role: string
  dates?: string
  pending?: string
  pages: { label: string; path: string }[]
}

export const ACTEURS: Actor[] = [
  {
    id: 'la-rochelle-agglo',
    name: 'La Rochelle Agglo',
    kind: 'Collectivité territoriale',
    summary: 'Communauté d’agglomération de La Rochelle, territoire précurseur des mobilités partagées.',
    role: 'Porte l’exploration du Self Data Territorial (2018-2019) puis l’expérimentation Coach CO2 (2021-2023).',
    dates: 'Vélos en libre-service dès 1976',
    pages: [{ label: 'La Rochelle', path: '/partie-1/la-rochelle/' }],
  },
  {
    id: 'fing',
    name: 'FING',
    kind: 'Association loi 1901 · think & do tank',
    summary: 'Fondation internet nouvelle génération, fondée en 2000 par Daniel Kaplan. Prospective, innovation ouverte, communs, design.',
    role: 'Formule en 2012 la promesse « Une mobilité plus libre… » ; accompagne La Rochelle sur le Self Data Territorial.',
    dates: 'Fondée en 2000',
    pages: [
      { label: 'La FING', path: '/partie-1/fing/' },
      { label: 'La Rochelle', path: '/partie-1/la-rochelle/' },
    ],
  },
  {
    id: 'ademe',
    name: 'ADEME',
    kind: 'Agence publique',
    summary: 'Agence de la transition écologique. Produit des connaissances, des méthodes et des financements.',
    role: 'Publie en février 2025 une étude sur les dispositifs d’enquête pour l’action publique ; source des chiffres sur le covoiturage.',
    pages: [
      { label: 'ADEME et SDES', path: '/partie-1/ademe-sdes/' },
      { label: 'Dispositifs d’enquête', path: '/partie-2/enquetes/' },
    ],
  },
  {
    id: 'sdes',
    name: 'SDES',
    kind: 'Service statistique ministériel',
    summary: 'Service statistique du ministère de la Transition écologique.',
    role: 'Produit les statistiques nationales de référence : parts modales, énergie, émissions.',
    pages: [{ label: 'ADEME et SDES', path: '/partie-1/ademe-sdes/#ordres-de-grandeur' }],
  },
  {
    id: 'fabmob',
    name: 'Fabrique des Mobilités (FabMob)',
    kind: 'Association',
    summary: 'Intermédiaire des communs de la mobilité : outille, documente, anime, met en relation.',
    role: 'Développe TraceMob ; publie le Socle, le guide méthodologique et les « 10 communs numériques essentiels » (2024).',
    dates: 'Créée en 2017',
    pages: [
      { label: 'Fabrique des Mobilités', path: '/partie-2/fabrique-des-mobilites/' },
      { label: 'TraceMob', path: '/partie-2/tracemob/' },
    ],
  },
  {
    id: 'cozy-cloud',
    name: 'Cozy Cloud',
    kind: 'Entreprise',
    summary: 'Éditeur d’une plateforme de cloud personnel, où l’usager stocke et croise ses propres données.',
    role: 'Membre du consortium de La Rochelle.',
    pending: 'Rôle précis dans le projet à documenter.',
    pages: [{ label: 'La Rochelle', path: '/partie-1/la-rochelle/#consortium' }],
  },
  {
    id: 'datactivist',
    name: 'Datactivist',
    kind: 'Coopérative',
    summary: 'Structure spécialisée dans l’ouverture et l’usage des données.',
    role: 'Membre du consortium de La Rochelle ; l’objectif de 500 bêta-testeurs lui est attribué.',
    pending: 'Rôle précis dans le projet à documenter.',
    pages: [{ label: 'La Rochelle', path: '/partie-1/la-rochelle/#consortium' }],
  },
  {
    id: 'cnam-grico',
    name: 'CNAM/GRICO',
    kind: 'Recherche',
    summary: 'Équipe de recherche associée au Conservatoire national des arts et métiers.',
    role: 'Partenaire de recherche du consortium de La Rochelle.',
    pending: 'Rôle précis et productions scientifiques à documenter.',
    pages: [{ label: 'La Rochelle', path: '/partie-1/la-rochelle/#consortium' }],
  },
  {
    id: 'numericite',
    name: 'Numéricité',
    kind: 'Accompagnement des collectivités',
    summary: 'Structure d’accompagnement des territoires dans leurs projets numériques.',
    role: 'Accompagne le projet de La Rochelle (2021-2023) et en publie la présentation qui sert de source principale.',
    pages: [{ label: 'La Rochelle', path: '/partie-1/la-rochelle/#sources' }],
  },
]
