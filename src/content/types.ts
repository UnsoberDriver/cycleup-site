export type SectionKey = 'accueil' | 'partie-1' | 'partie-2' | 'ressources' | 'a-propos'

/** Editorial status displayed on each page: the site never hides what remains unverified. */
export type Status = 'documente' | 'a-verifier' | 'a-documenter'

export type Card = { title: string; text: string; href?: string; tag?: string }

export type Block =
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; id?: string; text: string }
  | { type: 'p'; text: string; lead?: boolean; framed?: boolean }
  | { type: 'quote'; text: string | string[]; author?: string; year?: string; id?: string }
  | { type: 'list'; items: string[]; ordered?: boolean; id?: string }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string; centered?: boolean }
  | { type: 'callout'; text: string; label?: string; tone?: 'encadre' | 'critique' | 'alerte' }
  | { type: 'questions'; title?: string; items: string[] }
  | { type: 'cards'; items: Card[]; columns?: 2 | 3 | 4; numbered?: boolean }
  | { type: 'figures'; items: { value: string; label: string; source?: string }[] }
  | { type: 'figure'; src: string; alt: string; caption: string; credit: string }
  | { type: 'widget'; name: 'grille-communs' }

export type SourceRef = { label: string; url?: string; note?: string }

export type Page = {
  path: string
  section: SectionKey
  /** Short label for menus and breadcrumbs */
  navTitle: string
  title: string
  /** The question the page answers */
  question: string
  seoTitle: string
  description: string
  status: Status
  statusNote?: string
  updated: string
  blocks: Block[]
  sources?: SourceRef[]
}
