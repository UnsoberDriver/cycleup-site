import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ExternalIcon } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { PendingTag } from '../components/StatusTag'
import { ACTEURS, BIBLIOGRAPHIE, CHRONOLOGIE, GLOSSAIRE, type BiblioEntry } from '../content/resources'
import { Inline, typo } from '../lib/inline'
import { normalize } from '../lib/search'
import { useMeta } from '../lib/useMeta'

const RES = { label: 'Ressources', path: '/ressources/' }

function PageLinks({ pages }: { pages: { label: string; path: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {pages.map((p) => (
        <li key={p.path}>
          <Link to={p.path} className="group inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink">
            {p.label}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* ---------------- Chronologie ---------------- */

const PHASE = {
  promesse: { label: 'Promesse', cls: 'rounded-full border-promesse', text: 'text-promesse' },
  experimentation: { label: 'Expérimentation', cls: 'rotate-45 border-ink', text: 'text-ink' },
  commun: { label: 'Commun', cls: 'border-commun', text: 'text-commun' },
} as const

export function Chronologie() {
  useMeta('Chronologie', 'Les dates de l’histoire des mobilités numériques, de 1976 à 2025, chacune avec sa source.')
  return (
    <div>
      <PageHeader crumbs={[RES, { label: 'Chronologie' }]} kicker="Ressources · Chronologie" title="Chronologie" question="Dans quel ordre les choses se sont-elles passées ?">
        <div className="mt-8 flex flex-wrap gap-5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
          {Object.values(PHASE).map((p) => (
            <span key={p.label} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 border-2 ${p.cls}`} />
              {p.label}
            </span>
          ))}
        </div>
      </PageHeader>
      <ol className="mx-auto mt-9 max-w-[1000px] space-y-4 px-5 md:px-8">
        {CHRONOLOGIE.map((c) => {
          const ph = PHASE[c.phase]
          return (
            <li key={c.id} id={c.id} className="anchor-target modern-surface lift-card scroll-reveal relative grid gap-3 p-6 md:grid-cols-[180px_28px_minmax(0,1fr)] md:gap-6 md:p-8">
              <span className={`font-serif text-[2.2rem] leading-none tracking-[-0.02em] ${ph.text}`}>{c.date}</span>
              <span className={`hidden h-3.5 w-3.5 translate-y-3 border-2 bg-paper md:block ${ph.cls}`} aria-hidden="true" />
              <div>
                <p className="font-serif text-[1.4rem] leading-snug">{typo(c.event)}</p>
                <p className="mt-2 text-[1rem] leading-[1.6] text-ink-soft">{typo(c.detail)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">Source · {c.source}</span>
                  {c.link && <PageLinks pages={[c.link]} />}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ---------------- Glossaire ---------------- */

export function Glossaire() {
  useMeta('Glossaire', 'Self data, commun numérique, open source, trace de mobilité, E-Mission, MaaS, reliance, néo-nomadisme : les définitions et leurs sources.')
  const [filter, setFilter] = useState('')
  const entries = useMemo(() => {
    const f = normalize(filter.trim())
    const sorted = [...GLOSSAIRE].sort((a, b) => a.term.localeCompare(b.term, 'fr'))
    return f ? sorted.filter((g) => normalize(`${g.term} ${g.definition}`).includes(f)) : sorted
  }, [filter])
  const letters = [...new Set(GLOSSAIRE.map((g) => normalize(g.term[0]).toUpperCase()))].sort()

  return (
    <div>
      <PageHeader crumbs={[RES, { label: 'Glossaire' }]} kicker="Ressources · Glossaire" title="Glossaire" question="Que veulent dire les mots de la mobilité numérique ?" />
      <div className="mx-auto mt-8 max-w-[1000px] px-5 md:px-8">
        <div className="modern-surface flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <label className="flex flex-1 items-center gap-3">
            <span className="sr-only">Filtrer le glossaire</span>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrer les termes…"
              className="h-10 w-full max-w-sm rounded-full border border-rule bg-paper px-4 text-[0.95rem] outline-none focus:border-ink"
            />
          </label>
          <nav aria-label="Index alphabétique" className="flex flex-wrap gap-1">
            {letters.map((l) => (
              <a key={l} href={`#lettre-${l}`} className="flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs text-ink-soft hover:bg-paper-deep hover:text-ink">
                {l}
              </a>
            ))}
          </nav>
        </div>
        {entries.length === 0 && <p className="py-10 text-ink-soft">Aucun terme ne correspond à « {filter} ».</p>}
        <dl>
          {entries.map((g, i) => {
            const letter = normalize(g.term[0]).toUpperCase()
            const first = i === 0 || normalize(entries[i - 1].term[0]).toUpperCase() !== letter
            return (
              <div key={g.id} id={g.id} className="anchor-target scroll-reveal grid gap-3 border-b border-rule py-8 md:grid-cols-[64px_220px_minmax(0,1fr)] md:gap-6">
                <span id={first && !filter ? `lettre-${letter}` : undefined} className="hidden font-mono text-sm text-muted md:block">
                  {first ? letter : ''}
                </span>
                <dt className="font-serif text-[1.45rem] leading-tight">{g.term}</dt>
                <dd>
                  <p className="text-[1.0rem] leading-[1.65] text-ink-soft">{typo(g.definition)}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">Source · {g.source}</span>
                    <PageLinks pages={g.pages} />
                  </div>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </div>
  )
}

/* ---------------- Bibliographie ---------------- */

const GROUPS: { kind: BiblioEntry['kind']; title: string; intro: string }[] = [
  { kind: 'primaire', title: 'Sources primaires', intro: 'Documents produits par les acteurs eux-mêmes.' },
  { kind: 'secondaire', title: 'Sources secondaires', intro: 'Fiches, articles, enquêtes et états de l’art.' },
  { kind: 'citee', title: 'Auteurs cités par la FING (2012)', intro: 'Citations relevées dans le document FING.' },
]

export function Bibliographie() {
  useMeta('Bibliographie', 'Sources primaires et secondaires sur les mobilités numériques et les communs, avec liens vers les documents originaux.')
  return (
    <div>
      <PageHeader crumbs={[{ label: 'Sources' }]} kicker="Sources" title="Bibliographie" question="D’où viennent les informations de ce site ?" />
      <div className="mx-auto mt-8 max-w-[1000px] space-y-10 px-5 md:px-8">
        {GROUPS.map((g) => (
          <section key={g.kind} aria-labelledby={`groupe-${g.kind}`}>
            <div className="border-b-2 border-ink pb-3">
              <h2 id={`groupe-${g.kind}`} className="font-serif text-[1.8rem] font-medium">{g.title}</h2>
              <p className="mt-1 text-sm text-muted">{g.intro}</p>
            </div>
            <ol>
              {BIBLIOGRAPHIE.filter((b) => b.kind === g.kind).map((b) => (
                <li key={b.id} id={b.id} className="anchor-target grid gap-3 border-b border-rule py-5 md:grid-cols-[minmax(0,1fr)_260px] md:gap-8">
                  <div>
                    <p className="text-[1.0rem] leading-[1.55] text-ink">
                      <Inline text={b.ref} />
                    </p>
                    {b.note && <p className="mt-1 text-sm text-muted">{typo(b.note)}</p>}
                    <div className="mt-3">
                      <PageLinks pages={b.pages} />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1.5 text-sm">
                    {b.url ? (
                      <a href={b.url} target="_blank" rel="noreferrer" className="prose-link inline-flex items-center gap-1 break-all">
                        {b.url.replace(/^https?:\/\//, '')} <ExternalIcon />
                      </a>
                    ) : null}
                    {b.consulted && (
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">Consulté le {b.consulted}</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Acteurs ---------------- */

export function Acteurs() {
  useMeta('Fiches acteurs', 'La Rochelle Agglo, FING, ADEME, SDES, Fabrique des Mobilités, Cozy Cloud, Datactivist, CNAM/GRICO, Numéricité : qui fait quoi.')
  return (
    <div>
      <PageHeader crumbs={[RES, { label: 'Fiches acteurs' }]} kicker="Ressources · Fiches acteurs" title="Les acteurs" question="Qui porte les promesses, les expérimentations et les communs ?" />
      <div className="mx-auto mt-9 grid max-w-[1240px] gap-5 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-3">
        {ACTEURS.map((a) => (
          <article key={a.id} id={a.id} className="anchor-target modern-surface lift-card scroll-reveal flex flex-col border-t-4 border-t-ink p-7">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{a.kind}</p>
            <h2 className="mt-3 font-serif text-[1.9rem] leading-tight font-medium">{a.name}</h2>
            {a.dates && <p className="mt-1 font-mono text-xs text-promesse">{a.dates}</p>}
            <p className="mt-4 text-[1rem] leading-[1.6] text-ink">{typo(a.summary)}</p>
            <p className="mt-3 text-[0.95rem] leading-[1.6] text-ink-soft">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">Rôle · </span>
              {typo(a.role)}
            </p>
            {a.pending && (
              <p className="mt-3">
                <PendingTag>{a.pending}</PendingTag>
              </p>
            )}
            <div className="mt-auto pt-6">
              <PageLinks pages={a.pages} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
