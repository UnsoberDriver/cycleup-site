export const SITE = {
  name: 'Cycle\'Up',
  seoTitle: 'Cycle\'Up',
  description:
    'De la prospective de la FING aux communs de la Fabrique des Mobilités : une histoire critique des acteurs, des données et des méthodes qui transforment la mobilité.',
  updated: '12 novembre 2026',
}

export const PRIMARY_NAV = [
  { label: 'Projets', sub: 'Les cas documentés', path: '/partie-1/', section: 'partie-1' },
  { label: 'Carte', sub: 'Localisation des rosalies', path: '/partie-2/', section: 'partie-2' },
  { label: 'Forum', sub: 'Discussions ouvertes', path: '/ressources/', section: 'ressources' },
  { label: 'À propos', sub: 'Méthode, licence, contact', path: '/a-propos/', section: 'a-propos' },
] as const

export const STATUS_LABEL = {
  documente: 'Sourcé',
  'a-verifier': 'Chiffres à revérifier',
  'a-documenter': 'À documenter',
} as const
