import { IMAGES } from './images'
import type { Page } from './types'

const UPDATED = '12 novembre 2026'

/* ------------------------------------------------------------------ */
/* Partie I — Généalogie des promesses                                 */
/* ------------------------------------------------------------------ */

const laRochelle: Page = {
  path: '/partie-1/la-rochelle/',
  section: 'partie-1',
  navTitle: 'La Rochelle',
  title: 'La Rochelle : la donnée rendue à l’usager',
  question: 'Que se passe-t-il quand une collectivité rend ses données de mobilité aux usagers ?',
  seoTitle: 'La Rochelle — rendre les données de mobilité aux usagers',
  description:
    'Self Data Territorial, Coach CO2, TraceMob : comment une collectivité et ses partenaires ont testé la réappropriation des données de mobilité par les habitants.',
  status: 'a-verifier',
  statusNote: 'Les chiffres proviennent de la page Numéricité ; ils doivent être recontrôlés à la source avant publication.',
  updated: UPDATED,
  blocks: [
    { type: 'h2', id: 'ce-que-c-est', text: 'Ce que c’est' },
    {
      type: 'p',
      lead: true,
      text: 'L’agglomération de La Rochelle est un territoire précurseur : elle a installé l’un des premiers systèmes de vélos en libre-service dès 1976. En 2018-2019, avec la [FING](/partie-1/fing/), elle explore une autre innovation : le **Self Data Territorial**, c’est-à-dire la possibilité pour les usagers de reprendre la main sur leurs propres données.',
    },
    {
      type: 'p',
      text: 'Le cas d’usage retenu est **Coach CO2** : un outil qui analyse les données de mobilité pour sensibiliser au lien entre déplacements et émissions de CO2, et accompagner des choix plus sobres. Pour collecter les données, une application est développée : **[TraceMob](/partie-2/tracemob/)**, basée sur le logiciel open source E-Mission.',
    },
    {
      type: 'p',
      text: 'Le projet associe la [Fabrique des Mobilités](/partie-2/fabrique-des-mobilites/), Cozy Cloud, Datactivist et le CNAM/GRICO, avec un accompagnement de Numéricité. Il court de janvier 2021 à décembre 2023, soit 35 mois.',
    },
    {
      type: 'figure',
      ...IMAGES.laRochelle,
      caption: 'La Rochelle, territoire pionnier du vélo en libre-service (1976), puis du self data appliqué à la mobilité (2018-2023).',
    },
    { type: 'h2', id: 'deroule', text: 'Le déroulé du projet' },
    {
      type: 'p',
      text: 'Le recrutement de 80 bêta-testeurs est atteint dès janvier 2021 ; l’objectif annoncé, attribué à Datactivist, est de 500. Une première version de TraceMob est mise en production en mars 2021. Les outils sont développés en open source et, selon la page du projet, pérennisés au-delà de l’expérimentation.',
    },
    {
      type: 'table',
      caption: 'Ce qui est documenté par la page Numéricité',
      head: ['Élément', 'Donnée', 'Source'],
      rows: [
        ['Premier vélo en libre-service', '1976', 'Numéricité'],
        ['Self Data Territorial', '2018-2019, avec la FING', 'Numéricité'],
        ['Durée du projet', 'janvier 2021 – décembre 2023 (35 mois)', 'Numéricité'],
        ['Bêta-testeurs', '80 recrutés dès janvier 2021', 'Numéricité'],
        ['Objectif', '500 bêta-testeurs', 'Numéricité'],
        ['TraceMob', 'première version en production en mars 2021', 'Numéricité'],
        ['Base logicielle', 'E-Mission, open source', 'Numéricité'],
        ['Partenaires', 'FabMob, Cozy Cloud, Datactivist, CNAM/GRICO', 'Numéricité'],
      ],
    },
    { type: 'h2', id: 'consortium', text: 'Qui fait quoi' },
    {
      type: 'p',
      text: 'Le projet repose sur un consortium hétérogène : une collectivité, une association, une entreprise, une coopérative, un laboratoire et un cabinet d’accompagnement. Cette diversité est une force de conception ; elle complique aussi la question de la suite : qui reste responsable quand le projet s’arrête ?',
    },
    {
      type: 'cards',
      columns: 3,
      items: [
        { tag: 'Collectivité', title: 'La Rochelle Agglo', text: 'Porte le projet et ouvre son territoire à l’expérimentation.', href: '/ressources/acteurs/#la-rochelle-agglo' },
        { tag: 'Association', title: 'Fabrique des Mobilités', text: 'Développe TraceMob et l’inscrit dans une logique de commun.', href: '/ressources/acteurs/#fabmob' },
        { tag: 'Entreprise', title: 'Cozy Cloud', text: 'Plateforme de cloud personnel. Rôle précis dans le projet à documenter.', href: '/ressources/acteurs/#cozy-cloud' },
        { tag: 'Coopérative', title: 'Datactivist', text: 'Spécialiste de l’ouverture des données. Partenaire du consortium.', href: '/ressources/acteurs/#datactivist' },
        { tag: 'Recherche', title: 'CNAM/GRICO', text: 'Partenaire de recherche. Rôle précis à documenter.', href: '/ressources/acteurs/#cnam-grico' },
        { tag: 'Accompagnement', title: 'Numéricité', text: 'Accompagne le projet et publie la page qui sert de source.', href: '/ressources/acteurs/#numericite' },
      ],
    },
    { type: 'h2', id: 'ce-qui-reste-ouvert', text: 'Ce qui reste ouvert' },
    {
      type: 'callout',
      tone: 'critique',
      label: 'Lecture critique',
      text: 'Le chiffre de 80 bêta-testeurs est un succès de recrutement, pas une preuve d’usage durable. Et 80 n’est pas 500. La communication du projet ne dit pas ce que les habitants ont fait de leurs données.',
    },
    {
      type: 'questions',
      title: 'Les questions que la page consultée ne tranche pas',
      items: [
        'Combien d’usagers étaient encore actifs après six mois ?',
        'Quels effets ont été mesurés sur les déplacements ou les émissions ?',
        'Quelles données ont été collectées, et lesquelles ont réellement été réappropriées ?',
        'L’objectif de 500 bêta-testeurs a-t-il été atteint ?',
        'Qui gouverne les outils après décembre 2023, et qui finance leur maintenance ?',
      ],
    },
    { type: 'h2', id: 'point-de-jonction', text: 'Le point de jonction' },
    {
      type: 'p',
      text: 'La Rochelle relie les deux parties du site. La promesse formulée par la FING en 2012 devient ici une expérimentation (2021), qui produit un outil présenté comme un commun : TraceMob (2023). La suite de l’histoire se lit dans la [partie II](/partie-2/), à partir de la page [TraceMob](/partie-2/tracemob/).',
    },
  ],
  sources: [
    { label: 'Numéricité, Promouvoir les mobilités durables en favorisant la réappropriation par les usagers de leurs données, 2021-2023.', url: 'https://numericite.eu/realisations/promouvoir-les-mobilites-durables-en-favorisant-la-reappropriation-par-les-usagers-de-leurs-donnees' },
    { label: 'Fabrique des Mobilités, page TraceMob.', url: 'https://lafabriquedesmobilites.fr/tracemob' },
    { label: 'France Mobilités, fiche TraceMob, 2021.', url: 'https://www.francemobilites.fr/solutions/traceur-mobilite-tracemob' },
  ],
}

const fing: Page = {
  path: '/partie-1/fing/',
  section: 'partie-1',
  navTitle: 'La FING',
  title: 'La FING : la prospective des mobilités',
  question: 'Que promettait exactement la prospective française des mobilités numériques ?',
  seoTitle: 'La FING — la prospective des mobilités numériques (2012)',
  description:
    '« Une mobilité plus libre, plus diverse, plus riche, plus durable » : la promesse de 2012, ses citations, ses attentes et ses contradictions.',
  status: 'documente',
  statusNote: 'Citations relevées dans la page FING du 12 novembre 2012. Le compte-rendu de l’atelier du 24 octobre 2012 reste à consulter.',
  updated: UPDATED,
  blocks: [
    { type: 'h2', id: 'qui-est-la-fing', text: 'Qui est la FING' },
    {
      type: 'p',
      lead: true,
      text: 'La **Fondation internet nouvelle génération** (FING) est une association loi 1901 fondée en 2000 par Daniel Kaplan. Elle se présente comme un *think & do tank* sur les transformations numériques : prospective, innovation ouverte, communs, design.',
    },
    {
      type: 'p',
      text: 'Elle a animé des cycles de travail comme *Questions Numériques*, dont l’édition 2013 portait sur les « promesses ». La page qui sert de source a été mise à jour le 12 novembre 2012 par Margaux Pasquet. Elle est consultable dans une archive statique du réseau social de la FING (page 116442).',
    },
    { type: 'h2', id: 'promesse-initiale', text: 'La promesse initiale' },
    {
      type: 'quote',
      id: 'citation-promesse',
      author: 'FING, Questions Numériques',
      year: '2012',
      text: [
        'Le numérique outillera les nouvelles mobilités et dé-mobilités en transformant les contraintes environnementales, économiques et énergétiques en opportunités.',
        'Les mobilités seront plus efficaces, plus humaines et plus durables grâce à des systèmes technologiques permettant de les optimiser.',
        'Chacun pourra jongler entre les différents modes de transports comme il le souhaite.',
        'On pourra faire le choix de sa mobilité, hybride ou virtuelle : vivre et travailler "à distance" sera possible grâce aux outils nomades comme à la multiplication de lieux intermédiaires de travail et de socialisation.',
      ],
    },
    { type: 'h2', id: 'sept-attentes', text: 'Les sept attentes' },
    {
      type: 'p',
      text: 'Le document liste ce que l’on attend du numérique. Chaque attente est reliée ici à la page du site qui la met à l’épreuve.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Optimiser les systèmes de transport existants par le pilotage intelligent. → [Vitesse et complexité](/partie-1/controverses/#vitesse-et-complexite)',
        'Faciliter l’intermodalité en brouillant la frontière entre transports individuels et collectifs. → [Dispositifs d’enquête](/partie-2/enquetes/)',
        'Articuler transports doux, transports électriques et modes partagés. → [Ordres de grandeur](/partie-1/ademe-sdes/#ordres-de-grandeur)',
        'Substituer la mobilité physique par le virtuel : consommer, travailler, se socialiser à distance. → [Le face-à-face](/partie-1/controverses/#face-a-face)',
        'Créer un réseau de lieux de travail partagés, interconnectés, multifonctionnels et flexibles. → [Le face-à-face](/partie-1/controverses/#face-a-face)',
        'Déplacer les services et les ressources vers les gens plutôt que l’inverse. → [Territoires peu denses](/partie-2/territoires-peu-denses/)',
        'Enrichir l’expérience et le temps de la mobilité. → [Reliance et nomadisme](/partie-1/controverses/#reliance-et-nomadisme)',
      ],
    },
    { type: 'h2', id: 'citations', text: 'Les citations qui comptent' },
    {
      type: 'p',
      text: 'La page assemble des voix hétérogènes : une entreprise informatique, des prospectivistes, un essayiste, des acteurs du développement durable. Elle cite aussi Cécile Duflot (2012).',
    },
    { type: 'quote', author: 'IBM', text: 'Des systèmes de gestion de la circulation intelligents peuvent améliorer les trajets quotidiens…' },
    {
      type: 'quote',
      id: 'marzloff-2009',
      author: 'Bruno Marzloff',
      year: '2009',
      text: 'La place de marché qui organise la confrontation de ces demandes et de ces offres s’enrichit tous les jours. Cela peut se transformer en cauchemar.',
    },
    {
      type: 'quote',
      author: 'Jeremy Rifkin',
      year: '2012',
      text: 'Nos enfants conduiront des véhicules silencieux, propres, intelligents et branchables à un réseau interactif…',
    },
    { type: 'quote', author: 'Christian Loviton', year: '1989', text: 'Le living-room va céder sa place à la "commedia room"…' },
    {
      type: 'quote',
      author: 'Gilles Berhault',
      year: '2008',
      text: 'Le fait de partager un lieu avec d’autres habitants d’un même quartier plutôt que des collègues de la même entreprise ne peut que resocialiser.',
    },
    { type: 'h2', id: 'contradictions', text: 'Les contradictions, dans le même document' },
    {
      type: 'p',
      text: 'La même page fait place aux objections. Elles sont développées dans [Controverses](/partie-1/controverses/).',
    },
    {
      type: 'quote',
      author: 'Alain Rallet et André Torre',
      year: '2009',
      text: 'La complexité des interactions requiert des moments de face à face, dont les avantages ne peuvent être complètement reproduits par les moyens numériques.',
    },
    { type: 'quote', author: 'Paul Virilio', year: '2010', text: 'La vitesse des transports et des transmissions instantanées réduit le monde à rien.' },
    {
      type: 'quote',
      author: 'François Ascher',
      year: '2004',
      text: 'La mobilité physique et virtuelle devient donc un élément de plus en plus important dans la formation des inégalités individuelles et sociales.',
    },
    {
      type: 'quote',
      author: 'Gabriel Plassat',
      year: '2010',
      text: 'Cette complexité sera, une nouvelle fois, gérée par des machines. Nous l’accepterons… à condition de ne pas sous-estimer les risques.',
    },
    { type: 'quote', author: 'Georges Amar', year: '2012', text: 'Ce que j’appelle "la reliance" devient la valeur nouvelle de la mobilité.' },
    {
      type: 'quote',
      author: 'Yasmine Abbas',
      year: '2011',
      text: 'Le néo-nomadisme durable capitalise sur les avantages de la mobilité multiple…',
    },
    { type: 'h2', id: 'lecture', text: 'Lecture' },
    {
      type: 'p',
      text: 'La force de ce document est de contenir, dans les mêmes pages, la promesse et sa critique. Il ne dit pas que le numérique échouera ; il dit que ses effets dépendront de ce qu’on en fait. C’est exactement la question que posent aujourd’hui les [communs](/partie-2/communs-numeriques/) : qui décide, qui entretient, qui peut réutiliser ?',
    },
    {
      type: 'callout',
      text: 'Une promesse datée de 2012, à lire avec ses propres angles morts.',
    },
  ],
  sources: [
    { label: 'FING, Une mobilité plus libre, plus diverse, plus riche, plus durable, 12 novembre 2012.', url: 'https://archives.fing.org/reseau/pages/view/116442/index.html' },
    { label: 'FING, compte-rendu de l’atelier de Paris du 24 octobre 2012.', url: 'https://archives.fing.org/reseau/pages/view/120774/index.html' },
  ],
}

const ademeSdes: Page = {
  path: '/partie-1/ademe-sdes/',
  section: 'partie-1',
  navTitle: 'ADEME et SDES',
  title: 'L’ADEME, le SDES et les chiffres',
  question: 'Quels chiffres et quels dispositifs d’enquête encadrent le débat ?',
  seoTitle: 'ADEME et SDES — les chiffres et les enquêtes de mobilité',
  description:
    'Les données nationales de mobilité, leurs limites, et les dispositifs d’enquête qui permettent d’agir sur un territoire.',
  status: 'documente',
  statusNote: 'Chiffres marqués « vérifiés » dans le dossier de travail. Chaque valeur doit être datée et reliée à sa publication.',
  updated: UPDATED,
  blocks: [
    { type: 'h2', id: 'role-des-institutions', text: 'Rôle des institutions' },
    {
      type: 'p',
      lead: true,
      text: 'L’**ADEME** (Agence de la transition écologique) produit des connaissances, des méthodes et des financements sur la mobilité durable. Le **SDES** (service statistique du ministère de la Transition écologique) produit les grandes statistiques nationales : part modale, consommation d’énergie, émissions.',
    },
    {
      type: 'p',
      text: 'Ces deux sources ne disent pas la même chose : l’une outille l’action, l’autre mesure la situation. Il faut donc distinguer clairement la **donnée de cadrage national** et la **donnée d’action locale**.',
    },
    {
      type: 'cards',
      columns: 2,
      items: [
        { tag: 'Outiller', title: 'ADEME', text: 'Méthodes, guides, financements, publications sur les dispositifs d’enquête et le covoiturage.', href: '/ressources/acteurs/#ademe' },
        { tag: 'Mesurer', title: 'SDES', text: 'Statistiques nationales : parts modales, énergie, émissions. Publication « Environnement, consommation d’énergie et mobilités en 2023 ».', href: '/ressources/acteurs/#sdes' },
      ],
    },
    { type: 'h2', id: 'ordres-de-grandeur', text: 'Les ordres de grandeur à retenir' },
    {
      type: 'table',
      head: ['Donnée', 'Valeur', 'Source', 'Statut'],
      rows: [
        ['Déplacements en voiture en zone rurale', '80 %', 'Sénat', 'vérifié'],
        ['Part modale du vélo', '2,6 % des déplacements locaux en 2019', 'SDES', 'vérifié'],
        ['Part modale de la marche', '23,9 % en 2019', 'SDES', 'vérifié'],
        ['Covoiturage informel', '13 M de personnes par an', 'ADEME, 2025', 'vérifié'],
        ['Covoiturage via plateforme', '0,8 M de personnes par an', 'ADEME, 2025', 'vérifié'],
      ],
    },
    {
      type: 'p',
      text: 'Un écart saute aux yeux : le covoiturage organisé par plateforme touche environ seize fois moins de personnes que le covoiturage informel. L’outil numérique n’est pas, à ce jour, le principal canal du partage de la voiture.',
    },
    { type: 'h2', id: 'limites', text: 'Les limites des chiffres' },
    {
      type: 'callout',
      tone: 'alerte',
      label: 'Précaution',
      text: 'Ces chiffres sont nationaux. Aucune donnée de part modale n’existe à l’échelle des vallées ou des comarcas. Une moyenne nationale ne permet pas de dimensionner un service local.',
    },
    {
      type: 'p',
      text: 'C’est l’une des raisons pour lesquelles les collectivités cherchent à produire leurs propres données — par enquête, par comptage ou par collecte de traces, comme à [La Rochelle](/partie-1/la-rochelle/). Ces données locales posent à leur tour la question de leur gouvernance.',
    },
    { type: 'h2', id: 'dispositifs-d-enquete', text: 'Les dispositifs d’enquête' },
    {
      type: 'p',
      text: 'La publication ADEME de février 2025 sur « l’utilisation des dispositifs d’enquête pour l’action publique » pose une question simple : comment produire une connaissance qui serve réellement à décider ? Elle distingue les dispositifs selon leur coût, leur finesse et leur usage. C’est la boîte à outils méthodologique de la partie II, présentée dans [Dispositifs d’enquête](/partie-2/enquetes/).',
    },
    { type: 'callout', text: 'Les chiffres disent la moyenne, pas la vallée.' },
  ],
  sources: [
    { label: 'ADEME, L’utilisation des dispositifs d’enquête pour l’action publique, février 2025.', url: 'https://infos.ademe.fr/lettre-strategie-fevrier-2025/lutilisation-des-dispositifs-denquete-pour-laction-publique' },
    { label: 'SDES, Environnement, consommation d’énergie et mobilités en 2023.', url: 'https://www.statistiques.developpement-durable.gouv.fr/chiffres-cles-des-transports-edition-2023' },
    { label: 'Sénat, donnée sur la part des déplacements en voiture en zone rurale.', url: 'https://www.senat.fr/rap/r20-313/r20-313.html' },
  ],
}

const controverses: Page = {
  path: '/partie-1/controverses/',
  section: 'partie-1',
  navTitle: 'Controverses',
  title: 'Ce que la promesse ne règle pas',
  question: 'Qu’est-ce que la promesse numérique ne règle pas ?',
  seoTitle: 'Les controverses de la mobilité numérique',
  description: 'Inégalités, face-à-face, vitesse, reliance : ce que la promesse numérique ne règle pas.',
  status: 'documente',
  statusNote: 'Citations reprises du document FING de 2012. Les références originales des auteurs restent à compléter.',
  updated: UPDATED,
  blocks: [
    {
      type: 'p',
      lead: true,
      text: 'Les critiques ci-dessous ne viennent pas de l’extérieur : elles figurent dans le document même qui formule la promesse. Elles dessinent quatre tensions, toujours actuelles.',
    },
    { type: 'h2', id: 'inegalites', text: '1. La mobilité comme inégalité' },
    {
      type: 'quote',
      author: 'François Ascher',
      year: '2004',
      text: 'La possibilité de se déplacer dans une série de champs ouvre des potentialités qui ne sont pas également accessibles à tous.',
    },
    {
      type: 'p',
      text: 'Le numérique peut réduire certaines barrières (information, réservation) et en créer d’autres (équipement, compétence, couverture réseau). La question n’est pas « la mobilité est-elle numérique ? » mais « qui a accès à quoi ? ».',
    },
    { type: 'h2', id: 'face-a-face', text: '2. Le face-à-face ne se remplace pas' },
    {
      type: 'quote',
      author: 'Alain Rallet et André Torre',
      year: '2009',
      text: 'Les interactions à distance ont complété, et complèteront toujours, les rencontres en face-à-face, mais ne s’y substitueront jamais de manière parfaite.',
    },
    {
      type: 'p',
      text: '**Conséquence** pour les tiers-lieux et le télétravail : ils ne remplacent pas la rencontre, ils la déplacent.',
    },
    { type: 'h2', id: 'vitesse-et-complexite', text: '3. La vitesse et la complexité' },
    { type: 'quote', author: 'Paul Virilio', year: '2010', text: 'La vitesse des transports et des transmissions instantanées réduit le monde à rien.' },
    {
      type: 'quote',
      author: 'Gabriel Plassat',
      year: '2010',
      text: 'Cette complexité sera, une nouvelle fois, gérée par des machines. Nous l’accepterons… à condition de ne pas sous-estimer les risques.',
    },
    {
      type: 'p',
      text: '**Conséquence** : plus d’options ne signifie pas plus de liberté. L’optimisation peut produire de la dépendance — à un opérateur, à un algorithme, à un équipement.',
    },
    { type: 'h2', id: 'reliance-et-nomadisme', text: '4. La reliance et le nomadisme' },
    {
      type: 'quote',
      author: 'Georges Amar',
      year: '2012',
      text: 'La mobilité est de plus en plus comprise en termes de création de liens… Ce que j’appelle "la reliance" devient la valeur nouvelle de la mobilité.',
    },
    {
      type: 'quote',
      author: 'Yasmine Abbas',
      year: '2011',
      text: 'Le néo-nomadisme durable capitalise sur les avantages de la mobilité multiple…',
    },
    {
      type: 'p',
      text: '**Conséquence** : mesurer la mobilité en kilomètres est insuffisant. Ce qui compte, c’est ce que le déplacement permet — la reliance produite plutôt que la distance parcourue. Voir [reliance](/ressources/glossaire/#reliance) et [néo-nomadisme](/ressources/glossaire/#neo-nomadisme) dans le glossaire.',
    },
    { type: 'h2', id: 'synthese', text: 'Synthèse' },
    {
      type: 'callout',
      text: 'Ces critiques ne disqualifient pas le numérique ; elles fixent ses conditions.',
    },
    {
      type: 'p',
      text: 'Elles disent que l’effet du numérique dépend de la gouvernance, de l’accès et du sens. C’est précisément ce que la [partie II](/partie-2/) essaie d’outiller.',
    },
  ],
  sources: [
    { label: 'FING, Une mobilité plus libre, plus diverse, plus riche, plus durable, 12 novembre 2012.', note: 'Source des citations' },
  ],
}

/* ------------------------------------------------------------------ */
/* Partie II — La fabrique des communs                                 */
/* ------------------------------------------------------------------ */

const fabmob: Page = {
  path: '/partie-2/fabrique-des-mobilites/',
  section: 'partie-2',
  navTitle: 'Fabrique des Mobilités',
  title: 'La Fabrique des Mobilités',
  question: 'Qui fabrique les communs de la mobilité en France ?',
  seoTitle: 'La Fabrique des Mobilités — un intermédiaire des communs',
  description:
    'Association créée en 2017, la Fabrique des Mobilités (FabMob) outille, documente et fédère les acteurs autour de ressources ouvertes et pérennes.',
  status: 'documente',
  updated: UPDATED,
  blocks: [
    { type: 'h2', id: 'qui', text: 'Qui est la Fabrique des Mobilités' },
    {
      type: 'p',
      lead: true,
      text: 'La **Fabrique des Mobilités** (FabMob) est une association créée en 2017. Elle n’est pas un opérateur de transport : c’est un **intermédiaire**. Elle outille, documente, anime et met en relation. Son rôle est de rendre réutilisable ce qui, sinon, resterait dans des projets isolés.',
    },
    { type: 'h2', id: 'missions', text: 'Quatre missions' },
    {
      type: 'cards',
      columns: 2,
      numbered: true,
      items: [
        { title: 'Faire évoluer les pratiques', text: 'Contribuer à transformer les pratiques de mobilité par les modèles ouverts.' },
        { title: 'Fédérer', text: 'Réunir acteurs publics et privés dans une culture d’innovation ouverte.' },
        { title: 'Pérenniser', text: 'Favoriser l’émergence de ressources ouvertes et pérennes.' },
        { title: 'Diffuser', text: 'Étendre le modèle « Fab Mob » au-delà du secteur des mobilités.' },
      ],
    },
    { type: 'h2', id: 'dix-communs', text: 'Les dix communs essentiels (2024)' },
    {
      type: 'p',
      text: 'En 2024, la FabMob publie une liste de « 10 communs numériques essentiels pour une mobilité décarbonée ». Le geste est significatif : il hiérarchise. Il désigne les ressources dont la disparition coûterait le plus à l’ensemble des acteurs, et sur lesquelles l’effort de maintenance devrait porter en priorité.',
    },
    {
      type: 'callout',
      tone: 'alerte',
      label: 'À documenter',
      text: 'Le détail des dix communs et les critères de sélection doivent être relevés dans la publication de 2024 avant d’être reproduits ici.',
    },
    { type: 'h2', id: 'methode', text: 'Une méthode d’innovation ouverte' },
    {
      type: 'p',
      text: 'La méthode revendiquée est celle de l’innovation ouverte : partir de besoins communs à plusieurs acteurs, mutualiser le développement, documenter publiquement, et faire en sorte que chaque contribution profite aux suivants. À [La Rochelle](/partie-1/la-rochelle/), cette méthode s’incarne dans [TraceMob](/partie-2/tracemob/) : un outil conçu pour un territoire, pensé pour être repris ailleurs.',
    },
    {
      type: 'p',
      text: 'Elle publie aussi deux ressources méthodologiques : le *Socle de compréhension des Communs Numériques de la Mobilité*, présenté dans [Communs numériques](/partie-2/communs-numeriques/), et un [guide méthodologique](/partie-2/guide-methodologique/) pour structurer un commun.',
    },
    { type: 'h2', id: 'a-retenir', text: 'Ce qu’il faut retenir' },
    {
      type: 'p',
      text: 'Un commun ne se décrète pas. Il se maintient. La FabMob insiste sur la **pérennité** des ressources, pas seulement sur leur ouverture.',
    },
    { type: 'callout', text: 'Un acteur de l’intermédiation, pas un opérateur de transport.' },
  ],
  sources: [
    { label: 'Fabrique des Mobilités, site institutionnel et pages Communs.', url: 'https://lafabriquedesmobilites.fr' },
    { label: 'Fabrique des Mobilités, 10 communs numériques essentiels pour une mobilité décarbonée, 2024.', url: 'https://github.com/fabmob/fabmob.io/blob/master/contenu/articles/2024/dix_communs_numeriques_essentiels_mobilite.md' },
  ],
}

const tracemob: Page = {
  path: '/partie-2/tracemob/',
  section: 'partie-2',
  navTitle: 'TraceMob',
  title: 'TraceMob : un traceur comme commun',
  question: 'À quoi sert un traceur de mobilité, et à quelles conditions est-il un commun ?',
  seoTitle: 'TraceMob — à quelles conditions un traceur de mobilité est-il un commun ?',
  description:
    'Application de collecte de traces basée sur E-Mission, utilisée à La Rochelle : ce que TraceMob permet, et les questions de gouvernance qu’elle pose.',
  status: 'documente',
  statusNote: 'Le contenu de l’article de 2023 « TraceMob, sur les traces d’un commun de la mobilité ? » reste à intégrer.',
  updated: UPDATED,
  blocks: [
    { type: 'h2', id: 'ce-que-c-est', text: 'Ce que c’est' },
    {
      type: 'p',
      lead: true,
      text: '**TraceMob** est une application mobile développée par la [Fabrique des Mobilités](/partie-2/fabrique-des-mobilites/) pour collecter les traces de mobilité. Elle est présentée comme un commun : un ensemble de projets et d’expérimentations territoriales, réutilisable librement, basé sur l’application open source **E-Mission**.',
    },
    {
      type: 'quote',
      author: 'France Mobilités, fiche TraceMob',
      year: '2021',
      text: 'Traceur de mobilité réutilisable librement pour tout projet visant à mesurer la mobilité individuelle et collective sur un territoire.',
    },
    { type: 'h2', id: 'e-mission', text: 'Une base open source : E-Mission' },
    {
      type: 'p',
      text: 'TraceMob ne part pas de zéro. Elle reprend [E-Mission](/ressources/glossaire/#e-mission), une plateforme open source de collecte de traces sur smartphone. C’est déjà une logique de commun : réutiliser un socle existant plutôt que de reconstruire un outil propriétaire pour chaque territoire.',
    },
    { type: 'h2', id: 'la-rochelle', text: 'L’usage à La Rochelle' },
    {
      type: 'p',
      text: 'TraceMob a été utilisée à [La Rochelle](/partie-1/la-rochelle/) pour l’expérimentation Coach CO2 : une première version est mise en production en mars 2021, auprès de 80 bêta-testeurs recrutés dès janvier. D’autres expérimentations territoriales sont mentionnées par la FabMob ; elles restent à recenser.',
    },
    { type: 'h2', id: 'questions-a-poser', text: 'Les questions à poser' },
    {
      type: 'p',
      text: 'Une trace de mobilité est une [donnée personnelle](/ressources/glossaire/#donnee-personnelle) particulièrement sensible : elle révèle un domicile, un lieu de travail, des habitudes. Avant de réutiliser un traceur, il faut pouvoir répondre à six questions.',
    },
    {
      type: 'questions',
      items: [
        'Qui collecte la donnée, et pour qui ?',
        'Où est-elle stockée ? Qui peut y accéder ?',
        'Combien de temps est-elle conservée ?',
        'Les usagers peuvent-ils l’effacer ?',
        'Le code est-il réellement réutilisable, ou seulement consultable ?',
        'Qui finance la maintenance après le projet ?',
      ],
    },
    { type: 'h2', id: 'gouvernance-et-limites', text: 'Gouvernance et limites' },
    {
      type: 'p',
      text: 'Que le code soit ouvert ne suffit pas à faire de TraceMob un commun. Il faut une communauté qui l’entretient, des règles de réutilisation et une instance qui décide des évolutions. Ces quatre dimensions sont détaillées dans [Communs numériques](/partie-2/communs-numeriques/#quatre-dimensions).',
    },
    { type: 'h2', id: 'lecture', text: 'Lecture' },
    {
      type: 'p',
      text: 'Une trace dit qu’on est passé, pas pourquoi. C’est pourquoi les [méthodes d’enquête](/partie-2/enquetes/) sont indispensables : sans récit, la donnée est muette.',
    },
    { type: 'callout', text: 'Collecter des traces, ce n’est pas produire de la connaissance.' },
  ],
  sources: [
    { label: 'Fabrique des Mobilités, page TraceMob.', url: 'https://lafabriquedesmobilites.fr/tracemob' },
    { label: 'France Mobilités, fiche TraceMob, 2021.', url: 'https://www.francemobilites.fr/solutions/traceur-mobilite-tracemob' },
    { label: '« TraceMob, sur les traces d’un commun de la mobilité ? », 2023.', url: 'https://lafabriquedesmobilites.fr/blog/tracemob-commun', note: 'Auteur à préciser' },
  ],
}

const communs: Page = {
  path: '/partie-2/communs-numeriques/',
  section: 'partie-2',
  navTitle: 'Communs numériques',
  title: 'Reconnaître un commun numérique',
  question: 'Qu’est-ce qu’un commun numérique de la mobilité, et comment le reconnaître ?',
  seoTitle: 'Communs numériques de la mobilité — définition et critères',
  description:
    'Ressource, communauté, règles, gouvernance : les quatre dimensions d’un commun numérique, et une grille pour situer une initiative.',
  status: 'documente',
  statusNote: 'La grille de lecture est une proposition éditoriale du site, à confronter au Socle de la FabMob.',
  updated: UPDATED,
  blocks: [
    { type: 'h2', id: 'definition', text: 'Définition' },
    {
      type: 'p',
      lead: true,
      text: 'Un **commun numérique** est une ressource numérique produite et gouvernée collectivement, dont l’accès et la réutilisation sont organisés par des règles explicites.',
    },
    { type: 'h2', id: 'quatre-dimensions', text: 'Les quatre dimensions' },
    {
      type: 'cards',
      columns: 4,
      numbered: true,
      items: [
        { title: 'Une ressource', text: 'Logiciel, donnée, méthode, documentation.' },
        { title: 'Une communauté', text: 'Des contributeurs, des usagers, des mainteneurs.' },
        { title: 'Des règles', text: 'Licence, charte, conditions d’accès, modèle économique.' },
        { title: 'Une gouvernance', text: 'Qui décide, comment, et comment on sort du commun.' },
      ],
    },
    { type: 'h2', id: 'socle', text: 'Le Socle de compréhension' },
    {
      type: 'p',
      text: 'Le *Socle de compréhension des Communs Numériques de la Mobilité*, publié par la [Fabrique des Mobilités](/partie-2/fabrique-des-mobilites/), propose un cadre pour situer une initiative sur ces quatre dimensions. Le [guide méthodologique](/partie-2/guide-methodologique/) en tire une démarche.',
    },
    { type: 'h2', id: 'exemples', text: 'Exemples dans ce dossier' },
    {
      type: 'cards',
      columns: 3,
      items: [
        { tag: 'Logiciel', title: 'E-Mission', text: 'Plateforme open source de collecte de traces. Ressource réutilisée par TraceMob.', href: '/ressources/glossaire/#e-mission' },
        { tag: 'Outil territorial', title: 'TraceMob', text: 'Traceur réutilisable, issu de l’expérimentation de La Rochelle.', href: '/partie-2/tracemob/' },
        { tag: 'Méthode', title: 'Le Socle et le guide', text: 'Des ressources méthodologiques, elles-mêmes destinées à être partagées.', href: '/partie-2/guide-methodologique/' },
      ],
    },
    { type: 'h2', id: 'grille', text: 'Grille de lecture' },
    {
      type: 'p',
      text: 'Cochez ce qui est **documenté publiquement** pour l’initiative que vous examinez. Une case non cochée n’est pas une faute : c’est une question à poser au porteur du projet.',
    },
    { type: 'widget', name: 'grille-communs' },
    { type: 'h2', id: 'a-eviter', text: 'Ce qu’il faut éviter' },
    {
      type: 'callout',
      tone: 'critique',
      label: 'Confusion fréquente',
      text: 'Présenter un commun comme un simple « open source ». L’ouverture du code ne dit rien de la gouvernance, du financement, ni de la capacité de réutilisation réelle.',
    },
    {
      type: 'callout',
      text: 'La question n’est pas « est-ce open source ? » mais « qui décide, qui entretient, qui peut réutiliser ? »',
    },
  ],
  sources: [
    { label: 'Fabrique des Mobilités, Socle de compréhension des Communs Numériques de la Mobilité.', url: 'https://librairie.ademe.fr/mobilite-et-transports/6330-socle-de-comprehension-des-communs-numeriques-de-la-mobilite.html' },
  ],
}

const guide: Page = {
  path: '/partie-2/guide-methodologique/',
  section: 'partie-2',
  navTitle: 'Guide méthodologique',
  title: 'Structurer un commun : le guide',
  question: 'Comment structurer un commun numérique dans la mobilité ?',
  seoTitle: 'Guide méthodologique — structurer un commun numérique de la mobilité',
  description:
    'Présentation du guide de la Fabrique des Mobilités pour structurer un commun numérique. Page en cours de documentation.',
  status: 'a-documenter',
  statusNote: 'Le guide n’a pas encore été lu en détail. Cette page sera rédigée après lecture complète, pas à partir de son titre.',
  updated: UPDATED,
  blocks: [
    {
      type: 'callout',
      tone: 'alerte',
      label: 'Statut : à documenter',
      text: 'Les étapes ci-dessous sont une **hypothèse de lecture**, pas le contenu du guide. Elles seront vérifiées et remplacées par la structure réelle du document avant publication.',
    },
    { type: 'h2', id: 'presentation', text: 'Présentation' },
    {
      type: 'p',
      text: 'La [Fabrique des Mobilités](/partie-2/fabrique-des-mobilites/) publie un *guide méthodologique pour structurer un commun numérique dans la mobilité*. Il prolonge le [Socle de compréhension](/partie-2/communs-numeriques/#socle) : après la définition, la démarche.',
    },
    { type: 'h2', id: 'etapes-hypothese', text: 'Étapes à documenter (hypothèse)' },
    {
      type: 'cards',
      columns: 2,
      numbered: true,
      items: [
        { tag: 'Hypothèse', title: 'Cadrer le besoin', text: 'Définir le besoin et le périmètre de la ressource.' },
        { tag: 'Hypothèse', title: 'Identifier la communauté', text: 'Repérer les contributeurs, usagers, mainteneurs, et leurs rôles.' },
        { tag: 'Hypothèse', title: 'Choisir la licence', text: 'Fixer les conditions de réutilisation.' },
        { tag: 'Hypothèse', title: 'Organiser la gouvernance', text: 'Décider de la manière dont on décide.' },
        { tag: 'Hypothèse', title: 'Financer la maintenance', text: 'Organiser l’entretien dans la durée.' },
        { tag: 'Hypothèse', title: 'Mesurer l’usage', text: 'Suivre l’usage et l’impact réels.' },
        { tag: 'Hypothèse', title: 'Prévoir la sortie', text: 'Organiser la transmission ou la fin du commun.' },
      ],
    },
    { type: 'h2', id: 'vigilance', text: 'Points de vigilance' },
    {
      type: 'p',
      text: 'À relever dans le guide lui-même. En attendant, les [questions posées à TraceMob](/partie-2/tracemob/#questions-a-poser) et la [grille de lecture des communs](/partie-2/communs-numeriques/#grille) donnent un premier cadre.',
    },
  ],
  sources: [
    { label: 'Fabrique des Mobilités, Guide méthodologique pour structurer un commun numérique dans la mobilité. Publié par l’ADEME, collection Expertises.', url: 'https://librairie.ademe.fr/mobilite-et-transports/6330-socle-de-comprehension-des-communs-numeriques-de-la-mobilite.html' },
  ],
}

const enquetes: Page = {
  path: '/partie-2/enquetes/',
  section: 'partie-2',
  navTitle: 'Dispositifs d’enquête',
  title: 'Produire les données qui permettent d’agir',
  question: 'Comment produire les données qui permettent d’agir ?',
  seoTitle: 'Dispositifs d’enquête de mobilité — forces et limites',
  description:
    'Comptages, enquêtes ménages, enquêtes cordon, traces GPS, entretiens : ce que chaque dispositif dit, ce qu’il tait, et comment les combiner.',
  status: 'a-verifier',
  statusNote: 'La typologie est une synthèse éditoriale. Elle doit être confrontée au contenu détaillé de la publication ADEME de février 2025.',
  updated: UPDATED,
  blocks: [
    { type: 'h2', id: 'publication-ademe', text: 'La publication ADEME de février 2025' },
    {
      type: 'p',
      lead: true,
      text: 'La publication de l’[ADEME](/partie-1/ademe-sdes/) sur « l’utilisation des dispositifs d’enquête pour l’action publique » part d’un constat : les dispositifs sont nombreux, mais leur usage pour l’action publique reste inégal. Elle propose de choisir un dispositif en fonction de la question posée, du territoire et des moyens.',
    },
    { type: 'h2', id: 'typologie', text: 'Une typologie simple' },
    {
      type: 'table',
      head: ['Dispositif', 'Ce qu’il dit', 'Ce qu’il ne dit pas'],
      rows: [
        ['Comptages', 'Combien, où, quand', 'Qui se déplace, et pourquoi'],
        ['Enquêtes ménages', 'Qui se déplace, comment, pourquoi', 'Le détail des itinéraires ; coûteuses, donc rares'],
        ['Enquêtes cordon', 'Qui entre et sort d’un territoire', 'Les déplacements internes ; photographie ponctuelle'],
        ['Traces GPS', 'Les itinéraires réels, finement', 'Le motif ; dépend des volontaires équipés'],
        ['Entretiens', 'Motifs, freins, représentations', 'Les volumes ; non représentatifs'],
      ],
    },
    {
      type: 'p',
      text: 'Aucun dispositif ne dit tout. La connaissance se construit par combinaison : un comptage révèle un flux, une enquête ménages l’explique statistiquement, un entretien en donne le sens.',
    },
    { type: 'h2', id: 'articulation-avec-les-communs', text: 'Articulation avec les communs' },
    {
      type: 'p',
      text: 'Les communs peuvent abaisser le coût de certains dispositifs : un traceur réutilisable comme [TraceMob](/partie-2/tracemob/) évite de redévelopper un outil de collecte ; une méthode partagée rend les résultats comparables d’un territoire à l’autre. Ils ne remplacent pas le travail d’enquête qualitatif.',
    },
    {
      type: 'p',
      text: 'L’enquête menée à Moissac en 2023 (108 personnes) le montre : les freins au covoiturage sont relationnels avant d’être techniques. Voir [Territoires peu denses](/partie-2/territoires-peu-denses/#moissac).',
    },
    { type: 'callout', text: 'Une trace n’est pas un récit : le chiffre ne dit pas pourquoi on se déplace.' },
  ],
  sources: [
    { label: 'ADEME, L’utilisation des dispositifs d’enquête pour l’action publique, février 2025.', url: 'https://infos.ademe.fr/lettre-strategie-fevrier-2025/lutilisation-des-dispositifs-denquete-pour-laction-publique' },
  ],
}

const territoires: Page = {
  path: '/partie-2/territoires-peu-denses/',
  section: 'partie-2',
  navTitle: 'Territoires peu denses',
  title: 'Un commun peut-il fonctionner à 3,5 habitants au km² ?',
  question: 'Un commun de mobilité peut-il fonctionner à 3,5 habitants au km² ?',
  seoTitle: 'Territoires peu denses — ce que les communs changent (ou pas)',
  description:
    'Le cas Cycle\'Up, les freins sociaux à Moissac, les lignes de covoiturage M covoit’ : ce que les communs peuvent et ne peuvent pas faire en territoire peu dense.',
  status: 'a-verifier',
  statusNote: 'Cas d’application tiré de l’état de l’art Cycle\'Up (2026). Les chiffres sont à recontrôler auprès des sources primaires.',
  updated: UPDATED,
  blocks: [
    {
      type: 'p',
      lead: true,
      text: 'Les communs de la mobilité ont surtout été expérimentés en ville. Ce cas d’application déplace la question vers des territoires où la voiture est souvent le seul mode réellement disponible.',
    },
    {
      type: 'figures',
      items: [
        { value: '3,5', label: 'habitants au km² dans le Sobrarbe, contre 129 pour la zone POCTEFA', source: 'Gobierno de Aragón' },
        { value: '80 %', label: 'des déplacements se font en voiture en zone rurale', source: 'Sénat' },
        { value: '5 min', label: 'de retard toléré au maximum par les personnes interrogées à Moissac', source: 'HAL, 2023' },
        { value: '15 → 38', label: 'arrêts de covoiturage M covoit’ Lignes+ en cinq ans', source: 'SMMAG' },
      ],
    },
    { type: 'h2', id: 'cycle-up', text: 'Le cas Cycle\'Up' },
    {
      type: 'p',
      text: 'Le Sobrarbe compte 7 755 habitants pour 2 202,2 km², soit 3,5 habitants au km². La voiture y est le seul mode réellement disponible hors saison. Les lignes de covoiturage y sont techniquement possibles, mais la masse critique et la confiance sont les vrais verrous.',
    },
    {
      type: 'p',
      text: 'Cycle\'Up s’appuie sur une démarche de [Living Lab](/ressources/glossaire/#living-lab) et un panel de volontaires. Il n’est pas le sujet de ce site : il sert ici de terrain d’épreuve pour les idées des parties I et II.',
    },
    { type: 'figure', ...IMAGES.village, caption: 'En territoire peu dense, la distance aux services fait de la voiture une condition d’accès plus qu’un choix.' },
    { type: 'h2', id: 'moissac', text: 'Les freins sociaux : Moissac' },
    {
      type: 'p',
      text: 'À Moissac, 108 personnes interrogées en mars 2023 décrivent la voiture comme « une frontière intime » et tolèrent au maximum cinq minutes de retard. Elles se projettent systématiquement comme conductrices, jamais comme passagères.',
    },
    {
      type: 'p',
      text: 'Le problème n’est donc pas l’application : c’est la relation sociale au déplacement. On retrouve ici la critique de [Rallet et Torre](/partie-1/controverses/#face-a-face) et la notion de [reliance](/partie-1/controverses/#reliance-et-nomadisme) : ce qui compte est le lien, et le lien ne se programme pas.',
    },
    { type: 'h2', id: 'm-covoit', text: 'Les lignes de covoiturage : M covoit’' },
    {
      type: 'p',
      text: 'M covoit’ Lignes+ montre pourtant qu’un service public de covoiturage peut se développer en montagne : 15 arrêts en 2020, 38 en cinq ans, dont 4 dans le Massif du Vercors. La montée en charge est lente. Elle doit être budgétée.',
    },
    { type: 'h2', id: 'mesure', text: 'La question de la mesure' },
    {
      type: 'p',
      text: 'Aucune donnée de part modale n’existe à l’échelle de ces vallées (voir [Les limites des chiffres](/partie-1/ademe-sdes/#limites)). Avant d’évaluer un service, il faut produire la donnée qui permettra de l’évaluer — ce qui renvoie aux [dispositifs d’enquête](/partie-2/enquetes/).',
    },
    { type: 'h2', id: 'ce-que-les-communs-peuvent', text: 'Ce que les communs peuvent, et ne peuvent pas' },
    {
      type: 'cards',
      columns: 2,
      items: [
        { tag: 'Ils peuvent', title: 'Outiller', text: 'Fournir des outils réutilisables, des méthodes d’enquête, des données comparables.' },
        { tag: 'Ils ne peuvent pas', title: 'Remplacer', text: 'Créer une masse critique qui n’existe pas, ni remplacer la confiance par un algorithme.' },
      ],
    },
    {
      type: 'callout',
      text: 'En territoire peu dense, le problème n’est pas l’outil, c’est la masse critique et la confiance.',
    },
  ],
  sources: [
    { label: 'SMMAG, M covoit’ Lignes+.', url: 'https://www.lignesplus-m.fr' },
    { label: 'Gobierno de Aragón, données démographiques du Sobrarbe.', url: 'https://icearagon.aragon.es/atlas/Aragon/info/poblacion/densidad-de-poblacion/' },
  ],
}

/* ------------------------------------------------------------------ */
/* À propos                                                            */
/* ------------------------------------------------------------------ */

export const aPropos: Page = {
  path: '/a-propos/',
  section: 'a-propos',
  navTitle: 'À propos',
  title: 'À propos de ce site',
  question: 'Qui a fait ce site, pourquoi, et comment le citer ?',
  seoTitle: 'À propos — Cycle\'Up',
  description: 'Objectifs, méthode, citation, licence, accessibilité et données personnelles.',
  status: 'documente',
  updated: UPDATED,
  blocks: [
    { type: 'h2', id: 'pourquoi', text: 'Pourquoi ce site' },
    {
      type: 'p',
      lead: true,
      text: 'Ce site documentaire rend lisible une histoire : celle des acteurs, des promesses, des expérimentations et des communs qui se sont construits autour de la donnée de mobilité. Il ne fait ni l’actualité, ni la promotion d’un produit, ni le plaidoyer pour ou contre la voiture.',
    },
    {
      type: 'p',
      text: 'Il n’a de valeur que s’il montre l’écart entre la promesse et ce qui a été fait, et s’il outille le lecteur pour construire quelque chose de mieux.',
    },
    { type: 'h2', id: 'qui', text: 'Qui l’a fait' },
    {
      type: 'p',
      text: 'Le site est construit à partir d’un dossier de travail organisé en deux parties : des acteurs historiques (La Rochelle, la FING, l’ADEME, le SDES), puis la fabrique des communs (Fabrique des Mobilités, TraceMob, Socle, guide, dispositifs d’enquête). Il s’adresse d’abord aux étudiants, aux agents de collectivités, aux professionnels de la mobilité et aux chercheurs.',
    },
    { type: 'h2', id: 'rosalie', text: 'À propos de la rosalie' },
    {
      type: 'p',
      lead: true,
      text: 'Le véhicule qui porte le projet est une **rosalie** : un vélo collectif à pédales, de 2 à 9 places selon les modèles, monté sur 3 ou 4 roues. Née pour les balades de bord de mer et de camping, elle combine convivialité, effort doux et plaisir de rouler à plusieurs — c’est aussi un excellent objet d’expérimentation pour penser la mobilité en territoire peu dense.',
    },
    {
      type: 'p',
      text: 'Le modèle 3D présenté ci-dessous est celui du **Vhéliotech**, un vélo-car utilitaire à trois roues et à assistance électrique, conçu pour être **autoconstruit** : ses plans, son guide de montage et sa nomenclature sont téléchargeables gratuitement sous licence libre (CERN-OHL-S v2) par l’association Vélo Solaire Pour Tous. Sa géométrie vient directement des fichiers de conception officiels, convertis ici pour le web.',
    },
    { type: 'viewer', name: 'vheliotech' },
    {
      type: 'table',
      centered: true,
      head: ['Caractéristique', 'Valeur'],
      caption: 'Fiche technique du Vhéliotech (association Vélo Solaire Pour Tous, mai 2023).',
      rows: [
        ['Dimensions', '207 cm de long · 85 cm de large · 160 cm de haut'],
        ['Poids à vide', '≈ 85 kg'],
        ['Charge utile', '200 kg (conducteur et passagers inclus)'],
        ['Embarquement', '2 adultes et 2 enfants ; conducteur de 150 à 210 cm'],
        ['Roues', '3 (une arrière : mécanique de vélo standard)'],
        ['Assistance', 'limitée à 25 km/h — reste un vélo au sens du code de la route'],
        ['Autonomie', '25 km par batterie, + 8 km par heure de plein soleil (panneau solaire)'],
      ],
    },
    {
      type: 'p',
      text: 'Sans assistance ni moteur, la rosalie reste ce qu’elle a toujours été : un vélo à pédales, sans homologation ni permis, qui roule partout où passe un vélo. Le Vhéliotech l’étend à l’usage du quotidien — courses, école, chantiers — avec une charge utile de 200 kg et deux plateformes latérales accueillant des caisses standards. Le projet est un commun numérique : plans, documentation et communauté d’entraide sont ouverts sur [communaute.vhelio.org](https://communaute.vhelio.org).',
    },
    { type: 'h2', id: 'methode', text: 'Méthode et statuts' },
    {
      type: 'p',
      framed: true,
      text: 'Chaque page affiche un statut éditorial et une date de mise à jour. Les citations sont reproduites à l’identique ; les chiffres sont toujours accompagnés d’une source et d’une date.',
    },
    {
      type: 'table',
      centered: true,
      head: ['Statut', 'Signification'],
      rows: [
        ['Sourcé', 'Le contenu repose sur des sources identifiées et citées.'],
        ['Chiffres à revérifier', 'Les sources sont identifiées, mais certains chiffres doivent être recontrôlés à la source primaire.'],
        ['À documenter', 'La source n’a pas encore été lue en entier. La page présente une hypothèse, signalée comme telle.'],
      ],
    },
    { type: 'h2', id: 'citer', text: 'Comment citer' },
    {
      type: 'callout',
      label: 'Format proposé',
      text: '*Cycle\'Up*, « Titre de la page », mis à jour le 12 novembre 2026, URL de la page, consulté le [date].',
    },
    {
      type: 'p',
      text: 'Les ancres sont stables et peuvent être citées directement, par exemple `/partie-1/fing/#promesse-initiale`. Une URL publiée ne change plus.',
    },
    { type: 'h2', id: 'contact', text: 'Contact' },
    {
      type: 'p',
      text: 'Pour signaler une erreur, une source manquante ou une citation inexacte, écrivez à l’équipe éditoriale depuis le [formulaire de contact](/contact/).',
    },
    { type: 'h2', id: 'licence', text: 'Licence' },
    {
      type: 'p',
      text: 'Les textes sont publiés sous licence **CC BY-SA 4.0** : vous pouvez les reprendre et les adapter, en citant la source et en partageant dans les mêmes conditions. Le code est publié sous licence **MIT**. Les citations restent la propriété de leurs auteurs ; les photographies proviennent d’Unsplash.',
    },
    { type: 'h2', id: 'accessibilite', text: 'Accessibilité' },
    {
      type: 'p',
      text: 'Le site vise la conformité au RGAA : structure de titres hiérarchisée, navigation au clavier (la recherche s’ouvre avec la touche `/`), contrastes suffisants, textes alternatifs pour les images, respect du réglage « réduire les animations ».',
    },
    { type: 'h2', id: 'donnees-personnelles', text: 'Données personnelles' },
    {
      type: 'p',
      text: 'Ce site ne dépose aucun cookie de suivi et ne collecte aucune donnée personnelle. La recherche fonctionne entièrement dans votre navigateur. Les URLs ne comportent aucun paramètre de suivi.',
    },
  ],
  sources: [
    {
      label: 'Association Vélo Solaire Pour Tous, fiche « Vhéliotech »',
      url: 'https://vhelio.fr/objets/vheliotech',
      note: 'Fiche technique complète : dimensions, charge, autonomie.',
    },
    {
      label: 'Association Vélo Solaire Pour Tous, *Guide de montage du Vhéliotech*, v1.0.0, mai 2023',
      url: 'https://documentation.vhelio.org/vheliotech/guide-de-montage/v1.0.0',
      note: 'Documentation sous licence CERN-OHL-S version 2.',
    },
    {
      label: 'Fabrique des Mobilités, page communautaire « Vheliotech »',
      url: 'https://wiki.lafabriquedesmobilites.fr/wiki/Vheliotech',
      note: 'Présentation du projet comme commun de la communauté.',
    },
  ],
}

export const PART_PAGES: Record<'partie-1' | 'partie-2', Page[]> = {
  'partie-1': [laRochelle, fing, ademeSdes, controverses],
  'partie-2': [fabmob, tracemob, communs, guide, enquetes, territoires],
}

export const CONTENT_PAGES: Page[] = [...PART_PAGES['partie-1'], ...PART_PAGES['partie-2'], aPropos]
