import { CONTENT_PAGES } from '../content/pages'
import { PARTS } from '../content/parts'
import { ACTEURS, BIBLIOGRAPHIE, CHRONOLOGIE, GLOSSAIRE } from '../content/resources'
import type { Block } from '../content/types'
import { plain } from './inline'

export type SearchKind = 'Page' | 'Section' | 'Glossaire' | 'Chronologie' | 'Acteur' | 'Source'

export type SearchDoc = {
  kind: SearchKind
  title: string
  context: string
  path: string
  text: string
  norm: string
  normTitle: string
}

export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`]/g, ' ')
    .toLowerCase()

const STOPWORDS = new Set(
  'a au aux d de des du en et l la le les par pas pour sur un une ou qui que quoi est ce c'.split(' '),
)

function blockText(b: Block): string {
  switch (b.type) {
    case 'h2':
    case 'h3':
    case 'p':
      return plain(b.text)
    case 'quote':
      return [...(Array.isArray(b.text) ? b.text : [b.text]), b.author, b.year].filter(Boolean).join(' ')
    case 'list':
    case 'questions':
      return b.items.map(plain).join(' ')
    case 'table':
      return [b.caption, ...b.head, ...b.rows.flat()].filter(Boolean).join(' ')
    case 'callout':
      return plain(b.text)
    case 'cards':
      return b.items.map((c) => `${c.tag ?? ''} ${c.title} ${c.text}`).join(' ')
    case 'figures':
      return b.items.map((f) => `${f.value} ${f.label} ${f.source ?? ''}`).join(' ')
    case 'figure':
      return b.caption
    default:
      return ''
  }
}

function doc(kind: SearchKind, title: string, context: string, path: string, text: string): SearchDoc {
  return { kind, title, context, path, text, norm: normalize(`${title} ${context} ${text}`), normTitle: normalize(title) }
}

function buildIndex(): SearchDoc[] {
  const docs: SearchDoc[] = []

  for (const part of Object.values(PARTS)) {
    docs.push(doc('Page', part.title, part.question, part.path, [...part.intro, part.callout].join(' ')))
  }

  for (const page of CONTENT_PAGES) {
    docs.push(doc('Page', page.title, page.question, page.path, `${page.navTitle} ${page.description}`))
    // One document per h2 section so results can deep-link to stable anchors
    let current: { id: string; title: string; text: string[] } | null = null
    const flush = () => {
      if (current) docs.push(doc('Section', current.title, page.navTitle, `${page.path}#${current.id}`, current.text.join(' ')))
    }
    const intro: string[] = []
    for (const b of page.blocks) {
      if (b.type === 'h2') {
        flush()
        current = { id: b.id, title: b.text, text: [] }
      } else {
        ;(current ? current.text : intro).push(blockText(b))
      }
    }
    flush()
    if (intro.length) docs.push(doc('Section', page.title, page.navTitle, page.path, intro.join(' ')))
    if (page.sources?.length) {
      docs.push(doc('Section', 'Sources', page.navTitle, `${page.path}#sources`, page.sources.map((s) => `${s.label} ${s.note ?? ''}`).join(' ')))
    }
  }

  for (const g of GLOSSAIRE) docs.push(doc('Glossaire', g.term, 'Glossaire', `/ressources/glossaire/#${g.id}`, `${g.definition} ${g.source}`))
  for (const c of CHRONOLOGIE) docs.push(doc('Chronologie', `${c.date} — ${c.event}`, 'Chronologie', `/ressources/chronologie/#${c.id}`, `${c.detail} ${c.source}`))
  for (const a of ACTEURS) docs.push(doc('Acteur', a.name, a.kind, `/ressources/acteurs/#${a.id}`, `${a.summary} ${a.role} ${a.dates ?? ''}`))
  for (const b of BIBLIOGRAPHIE) docs.push(doc('Source', plain(b.ref), 'Bibliographie', `/ressources/bibliographie/#${b.id}`, b.note ?? ''))

  return docs
}

let INDEX: SearchDoc[] | null = null

export type SearchResult = SearchDoc & { score: number; snippet: string; terms: string[] }

function snippetFor(d: SearchDoc, terms: string[]) {
  const text = d.text
  const norm = normalize(text)
  const hit = terms.map((t) => norm.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0]
  if (hit === undefined) return text.slice(0, 140) + (text.length > 140 ? '…' : '')
  const start = Math.max(0, hit - 60)
  const end = Math.min(text.length, hit + 120)
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '')
}

const KIND_WEIGHT: Record<SearchKind, number> = { Page: 6, Acteur: 5, Glossaire: 5, Section: 3, Chronologie: 3, Source: 1 }

export function search(query: string, limit = 24): SearchResult[] {
  INDEX ??= buildIndex()
  const all = normalize(query)
    .split(/[^a-z0-9,]+/)
    .map((t) => t.replace(/,$/, ''))
    .filter(Boolean)
  const terms = all.filter((t) => !STOPWORDS.has(t))
  if (!terms.length) return []
  const phrase = normalize(query).trim()

  const scored = INDEX.map((d) => {
    const matched = terms.filter((t) => d.norm.includes(t))
    if (!matched.length) return null
    let score = (matched.length / terms.length) * 10
    if (matched.length === terms.length) score += 10
    if (terms.length > 1 && d.norm.includes(phrase)) score += 8
    score += terms.filter((t) => d.normTitle.includes(t)).length * 4
    if (d.normTitle === phrase) score += 10
    score += KIND_WEIGHT[d.kind]
    return { ...d, score, terms: matched, snippet: snippetFor(d, matched) }
  }).filter((r): r is SearchResult => r !== null)

  // Prefer documents that contain every term; fall back to partial matches
  const complete = scored.filter((r) => r.terms.length === terms.length)
  const pool = complete.length ? complete : scored
  return pool.sort((a, b) => b.score - a.score).slice(0, limit)
}
