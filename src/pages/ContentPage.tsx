import { Link } from 'react-router'
import { AnchorHeading, Blocks } from '../components/Blocks'
import { ArrowLeft, ArrowRight, ExternalIcon } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { StatusTag } from '../components/StatusTag'
import { PART_PAGES } from '../content/pages'
import { CHAIN_ROLE, PART1_ROLE, PARTS } from '../content/parts'
import type { Page } from '../content/types'
import { plain, typo } from '../lib/inline'
import { useMeta } from '../lib/useMeta'

function readingMinutes(page: Page) {
  const words = page.blocks
    .map((b) => ('text' in b ? (Array.isArray(b.text) ? b.text.join(' ') : b.text) : 'items' in b ? JSON.stringify(b.items) : ''))
    .join(' ')
  return Math.max(2, Math.round(plain(words).split(/\s+/).length / 200))
}

export function ContentPage({ page }: { page: Page }) {
  useMeta(page.seoTitle, page.description)
  const partKey = page.section === 'partie-1' || page.section === 'partie-2' ? page.section : null
  const part = partKey ? PARTS[partKey] : null
  const siblings = partKey ? PART_PAGES[partKey] : []
  const index = siblings.findIndex((p) => p.path === page.path)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]
  const role = CHAIN_ROLE[page.path] ?? PART1_ROLE[page.path]
  const toc = page.blocks.filter((b): b is Extract<typeof b, { type: 'h2' }> => b.type === 'h2')

  const crumbs = part ? [{ label: part.title, path: part.path }, { label: page.navTitle }] : [{ label: page.navTitle }]

  return (
    <article>
      <PageHeader
        crumbs={crumbs}
        title={page.title}
        question={page.question}
        kicker={
          part ? (
            <span>
              {part.title}
              <span className="text-muted">
                {' '}
                — {index + 1}/{siblings.length}
                {role && ` · ${role}`}
              </span>
            </span>
          ) : undefined
        }
      >
        <div className="reveal reveal-delay-3 mt-6 flex w-fit flex-wrap items-center gap-x-5 gap-y-3 rounded-full border border-rule bg-paper/70 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted shadow-sm backdrop-blur">
          <StatusTag status={page.status} />
          <span>Mis à jour le {page.updated}</span>
          <span>Lecture · {readingMinutes(page)} min</span>
        </div>
        {page.statusNote && <p className="mt-3 max-w-2xl text-sm leading-snug text-muted">{typo(page.statusNote)}</p>}
      </PageHeader>

      <div className="mx-auto mt-8 grid max-w-[1240px] gap-10 px-5 md:px-8 lg:mt-12 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
          {part && (
            <nav aria-label={`Pages de la partie ${part.numeral}`} className="hidden lg:block">
              <Link to={part.path} className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted hover:text-ink">
                Dans cette rubrique
              </Link>
              <ol className="modern-surface mt-4 space-y-0.5 rounded-[1.25rem] p-3">
                {siblings.map((s, i) => {
                  const current = s.path === page.path
                  return (
                    <li key={s.path}>
                      <Link
                        to={s.path}
                        aria-current={current ? 'page' : undefined}
                        className={`-ml-px flex gap-3 border-l-2 py-1.5 pl-4 text-[0.9rem] leading-snug transition-colors ${
                          current ? 'border-(--accent) text-ink' : 'border-transparent text-muted hover:text-ink'
                        }`}
                      >
                        <span className="font-mono text-[11px] leading-5">{i + 1}</span>
                        {s.navTitle}
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </nav>
          )}
          {toc.length > 1 && (
            <details className="group rounded-sm border border-rule p-4 lg:mt-10 lg:border-0 lg:p-0" open>
              <summary className="cursor-pointer list-none font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted lg:pointer-events-none">
                Sur cette page <span className="lg:hidden">({toc.length})</span>
              </summary>
              <ul className="mt-4 space-y-2">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="block text-[0.875rem] leading-snug text-ink-soft hover:text-ink">
                      {typo(h.text)}
                    </a>
                  </li>
                ))}
                {page.sources && (
                  <li>
                    <a href="#sources" className="block text-[0.875rem] leading-snug text-ink-soft hover:text-ink">
                      Sources
                    </a>
                  </li>
                )}
              </ul>
            </details>
          )}
        </aside>

        <div className="max-w-[720px] min-w-0 [&>*:first-child]:mt-0">
          <Blocks blocks={page.blocks} />

          {page.sources && (
            <section aria-labelledby="sources" className="modern-surface mt-20 border-t-4 border-t-ink p-6 md:p-8">
              <AnchorHeading id="sources">Sources</AnchorHeading>
              <ol className="space-y-4">
                {page.sources.map((s, i) => (
                  <li key={i} className="grid grid-cols-[2rem_1fr] text-[0.95rem] leading-snug">
                    <span className="font-mono text-xs text-muted">[{i + 1}]</span>
                    <span className="text-ink-soft">
                      {typo(s.label)}{' '}
                      {s.url && (
                        <a href={s.url} target="_blank" rel="noreferrer" className="prose-link inline-flex items-center gap-1 break-all text-ink">
                          {s.url.replace(/^https?:\/\//, '')}
                          <ExternalIcon />
                        </a>
                      )}
                      {s.note && <span className="ml-1 text-[0.85rem] text-muted">({s.note})</span>}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-muted">
                Toutes les références sont rassemblées dans la{' '}
                <Link to="/ressources/bibliographie/" className="prose-link">
                  bibliographie
                </Link>
                .
              </p>
            </section>
          )}

          {part && (
            <nav aria-label="Pages précédente et suivante" className="mt-20 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link to={prev.path} className="modern-surface lift-card group p-5">
                  <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                    <ArrowLeft className="h-3.5 w-3.5" /> Précédent
                  </span>
                  <span className="mt-2 block font-serif text-lg leading-snug">{prev.navTitle}</span>
                </Link>
              ) : (
                <Link to={part.path} className="modern-surface lift-card group p-5">
                  <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                    <ArrowLeft className="h-3.5 w-3.5" /> Introduction
                  </span>
                  <span className="mt-2 block font-serif text-lg leading-snug">{part.title}</span>
                </Link>
              )}
              {next ? (
                <Link to={next.path} className="modern-surface lift-card group p-5 text-right">
                  <span className="flex items-center justify-end gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-(--accent)">
                    Suivant <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block font-serif text-lg leading-snug">{next.navTitle}</span>
                </Link>
              ) : partKey === 'partie-1' ? (
                <Link to="/partie-2/" className="modern-surface lift-card group p-5 text-right">
                  <span className="flex items-center justify-end gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-commun">
                    Carte <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block font-serif text-lg leading-snug">Carte des rosalies</span>
                </Link>
              ) : (
                <Link to="/ressources/bibliographie/" className="modern-surface lift-card group p-5 text-right">
                  <span className="flex items-center justify-end gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                    Sources <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block font-serif text-lg leading-snug">Chronologie, glossaire, sources</span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </article>
  )
}
