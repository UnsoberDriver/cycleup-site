import { IMAGES } from './images'

export type PartKey = 'partie-1' | 'partie-2'

export type Part = {
  key: PartKey
  numeral: 'I' | 'II'
  path: string
  title: string
  question: string
  seoTitle: string
  description: string
  intro: string[]
  callout: string
  orderLabel: string
  image?: { src: string; alt: string; credit: string; caption: string }
}

export const PARTS: Record<PartKey, Part> = {
  'partie-1': {
    key: 'partie-1',
    numeral: 'I',
    path: '/partie-1/',
    title: 'Les projets',
    question: 'Quels projets transforment les idées en outils et en expérimentations ?',
    seoTitle: 'Projets — Cycle\'Up',
    description:
      'Self Data Territorial, TraceMob, Cycle\'Up et M covoit’ Lignes+ : les projets et cas d’application documentés.',
    intro: [
      'Cette section rassemble les expérimentations, outils et services documentés dans le corpus.',
      'Chaque projet renvoie vers sa fiche détaillée, ses sources et les questions qui restent ouvertes.',
    ],
    callout: 'Des projets documentés, avec leurs usages et leurs limites.',
    orderLabel: 'Expérimentations, outils et services',
    image: {
      ...IMAGES.laRochelleQuai,
      caption: 'La Rochelle : là où la promesse a été mise à l’épreuve des habitants.',
    },
  },
  'partie-2': {
    key: 'partie-2',
    numeral: 'II',
    path: '/partie-2/',
    title: 'Carte des rosalies',
    question: 'Où se situent les territoires et cas de mobilité documentés ?',
    seoTitle: 'Carte des rosalies — Cycle\'Up',
    description:
      'Carte des territoires et cas de mobilité documentés : La Rochelle, Moissac, Sobrarbe et Vercors.',
    intro: [
      'La carte situe les territoires présents dans les projets et enquêtes du site.',
      'Les marqueurs pourront être précisés avec les coordonnées exactes de chaque rosalie.',
    ],
    callout: 'Une carte pour relier chaque projet à son territoire.',
    orderLabel: 'Localisations documentées',
    image: {
      ...IMAGES.velos,
      caption: 'Fabriquer la mobilité : des outils partagés, entretenus par une communauté.',
    },
  },
}

/** Role of each Part II page in the "fabrique" chain */
export const CHAIN_ROLE: Record<string, string> = {
  '/partie-2/fabrique-des-mobilites/': 'Acteur',
  '/partie-2/tracemob/': 'Outil',
  '/partie-2/communs-numeriques/': 'Cadre',
  '/partie-2/guide-methodologique/': 'Méthode',
  '/partie-2/enquetes/': 'Enquête',
  '/partie-2/territoires-peu-denses/': 'Terrain',
}

export const PART1_ROLE: Record<string, string> = {
  '/partie-1/la-rochelle/': 'Expérimentation',
  '/partie-1/fing/': 'Prospective',
  '/partie-1/ademe-sdes/': 'Chiffres',
  '/partie-1/controverses/': 'Critique',
}
