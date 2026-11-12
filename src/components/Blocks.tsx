import { lazy, Suspense } from 'react'
import { Link } from 'react-router'
import type { Block } from '../content/types'
import { Inline, typo } from '../lib/inline'
import { CommonsGrid } from './CommonsGrid'
import { ArrowRight } from './Icons'

/** Viewer 3D chargé à la demande (three.js dans un chunk séparé, compatible CSP). */
const Rosalie3D = lazy(() => import('./Rosalie3D').then((m) => ({ default: m.Rosalie3D })))

export function AnchorHeading({ id, children, level = 2 }: { id: string; children: React.ReactNode; level?: 2 | 3 }) {
  const Tag = level === 2 ? 'h2' : 'h3'
  return (
    <Tag
      id={id}
      className={`anchor-target group relative -mx-2 rounded-sm px-2 font-serif tracking-[-0.01em] text-ink ${
        level === 2 ? 'mt-16 mb-5 text-[1.85rem] leading-[1.15] font-medium md:text-[2.1rem]' : 'mt-10 mb-3 text-[1.35rem] font-medium'
      }`}
    >
      {children}
      <a
        href={`#${id}`}
        className="ml-2 align-middle font-mono text-base text-muted opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        aria-label="Lien vers cette section"
      >
        #
      </a>
    </Tag>
  )
}

function Cell({ value }: { value: string }) {
  if (value === 'vérifié')
    return <span className="rounded-full bg-commun-soft px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-commun">vérifié</span>
  return <Inline text={value} />
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return <AnchorHeading id={block.id}>{typo(block.text)}</AnchorHeading>
    case 'h3':
      return block.id ? (
        <AnchorHeading id={block.id} level={3}>
          {typo(block.text)}
        </AnchorHeading>
      ) : (
        <h3 className="mt-10 mb-3 font-serif text-[1.35rem] font-medium">{typo(block.text)}</h3>
      )
    case 'p':
      return block.lead ? (
        <p className="mb-6 font-serif text-[1.35rem] leading-[1.5] text-ink md:text-[1.45rem]">
          <Inline text={block.text} />
        </p>
      ) : block.framed ? (
        <p className="modern-surface mb-7 w-full border-l-4 border-l-(--accent) px-5 py-4 text-[1.0625rem] leading-[1.7] text-ink-soft md:px-6 md:py-5">
          <Inline text={block.text} />
        </p>
      ) : (
        <p className="mb-5 text-[1.0625rem] leading-[1.75] text-ink-soft">
          <Inline text={block.text} />
        </p>
      )
    case 'quote': {
      const lines = Array.isArray(block.text) ? block.text : [block.text]
      return (
        <figure id={block.id} className="anchor-target modern-surface scroll-reveal my-10 overflow-hidden border-l-[6px] border-l-(--accent) p-6 md:p-8">
          <blockquote className="space-y-3 font-serif text-[1.3rem] leading-[1.5] italic text-ink md:text-[1.4rem]">
            {lines.map((l, i) => (
              <p key={i}>
                {i === 0 && <span aria-hidden="true">«&nbsp;</span>}
                {typo(l)}
                {i === lines.length - 1 && <span aria-hidden="true">&nbsp;»</span>}
              </p>
            ))}
          </blockquote>
          {block.author && (
            <figcaption className="mt-3 font-mono text-[11.5px] uppercase tracking-[0.1em] text-muted">
              — {block.author}
              {block.year && <span className="text-(--accent)">, {block.year}</span>}
            </figcaption>
          )}
        </figure>
      )
    }
    case 'list':
      return block.ordered ? (
        <ol className="my-6 divide-y divide-rule border-y border-rule">
          {block.items.map((item, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2 py-3.5 text-[1.0625rem] leading-[1.6] text-ink-soft">
              <span className="pt-0.5 font-mono text-sm text-(--accent)">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="my-6 space-y-2 text-[1.0625rem] leading-[1.6] text-ink-soft">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-[0.7em] h-px w-3 shrink-0 bg-(--accent)" aria-hidden="true" />
              <span>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <figure className={`scroll-reveal my-10 ${block.centered ? 'mx-auto max-w-[640px]' : ''}`}>
          {block.caption && <figcaption className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{block.caption}</figcaption>}
          <div className="modern-surface overflow-x-auto rounded-[1.25rem] border-t-4 border-t-(--accent)">
            <table className="w-full min-w-[520px] border-collapse text-left text-[0.95rem]">
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col" className={`border-b border-ink/70 py-2.5 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted ${block.centered ? 'text-center' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="border-b border-rule align-top">
                    {row.map((c, j) => (
                      <td key={j} className={`py-3 pr-4 leading-snug ${j === 0 ? 'font-medium text-ink' : 'text-ink-soft'} ${block.centered ? 'text-center' : ''}`}>
                        <Cell value={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      )
    case 'callout': {
      const tone = block.tone ?? 'encadre'
      if (tone === 'encadre')
        return (
          <aside className="scroll-reveal my-12 overflow-hidden rounded-[1.5rem] bg-ink p-7 text-paper shadow-[0_28px_55px_-35px_rgba(27,26,23,0.7)] md:p-9">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-(--accent)">{block.label ?? 'Encadré'}</p>
            <p className="font-serif text-[1.75rem] leading-[1.25] tracking-[-0.02em] text-paper md:text-[2.15rem]">
              <Inline text={block.text} />
            </p>
          </aside>
        )
      return (
        <aside
          className={`scroll-reveal my-8 rounded-[1.5rem] p-6 shadow-[0_18px_45px_-36px_rgba(27,26,23,0.5)] ${tone === 'critique' ? 'border border-dashed border-(--accent) bg-paper' : 'border border-alerte/25 bg-alerte-soft/70'}`}
        >
          <p className={`mb-2 font-mono text-[11px] uppercase tracking-[0.14em] ${tone === 'critique' ? 'text-(--accent)' : 'text-alerte'}`}>
            {block.label ?? (tone === 'critique' ? 'Lecture critique' : 'Attention')}
          </p>
          <p className="text-[1.0625rem] leading-[1.65] text-ink">
            <Inline text={block.text} />
          </p>
        </aside>
      )
    }
    case 'questions':
      return (
        <div className="modern-surface scroll-reveal my-10 p-6 md:p-8">
          {block.title && <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{block.title}</p>}
          <ol className="space-y-3">
            {block.items.map((q, i) => (
              <li key={i} className="grid grid-cols-[2.25rem_1fr] font-serif text-[1.2rem] leading-snug text-ink">
                <span className="pt-1 font-mono text-xs text-(--accent)">Q{i + 1}</span>
                <span>{typo(q)}</span>
              </li>
            ))}
          </ol>
        </div>
      )
    case 'cards': {
      const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[block.columns ?? 3]
      return (
        <div className={`my-10 grid gap-4 ${cols}`}>
          {block.items.map((c, i) => {
            const inner = (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  {block.numbered ? (
                    <span className="font-mono text-xs text-(--accent)">{String(i + 1).padStart(2, '0')}</span>
                  ) : (
                    c.tag && <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{c.tag}</span>
                  )}
                  {block.numbered && c.tag && <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-alerte">{c.tag}</span>}
                </div>
                <p className="mt-3 font-serif text-[1.25rem] leading-tight text-ink">{typo(c.title)}</p>
                <p className="mt-2 text-[0.9375rem] leading-[1.55] text-ink-soft">{typo(c.text)}</p>
                {c.href && (
                  <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-(--accent)">
                    Voir <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </>
            )
            return c.href ? (
              <Link key={i} to={c.href} className="modern-surface lift-card group flex flex-col p-5">
                {inner}
              </Link>
            ) : (
              <div key={i} className="modern-surface lift-card flex flex-col p-5">
                {inner}
              </div>
            )
          })}
        </div>
      )
    }
    case 'figures':
      return (
        <dl className="my-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {block.items.map((f) => (
            <div key={f.value + f.label} className="modern-surface lift-card scroll-reveal p-5">
              <dt className="font-serif text-[2.6rem] leading-none tracking-[-0.02em] text-(--accent)">{f.value}</dt>
              <dd className="mt-3 text-[0.9rem] leading-snug text-ink-soft">{typo(f.label)}</dd>
              {f.source && <dd className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">{f.source}</dd>}
            </div>
          ))}
        </dl>
      )
    case 'figure':
      return (
        <figure className="scroll-reveal my-12 md:-mr-16">
          <div className="overflow-hidden rounded-[1.75rem] bg-(--accent-soft) shadow-[0_30px_60px_-38px_rgba(27,26,23,0.6)]">
            <img src={block.src} alt={block.alt} loading="lazy" className="photo-original aspect-[16/9] w-full object-cover" />
          </div>
          <figcaption className="mt-3 flex flex-col gap-1 text-[0.875rem] leading-snug text-muted sm:flex-row sm:justify-between sm:gap-6">
            <span>{typo(block.caption)}</span>
            <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.1em]">Photo : {block.credit}</span>
          </figcaption>
        </figure>
      )
    case 'widget':
      return <CommonsGrid />
    case 'viewer':
      return (
        <Suspense
          fallback={
            <div className="modern-surface my-10 flex aspect-[4/3] w-full items-center justify-center rounded-[1.25rem]">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-commun border-t-transparent" aria-hidden="true" />
            </div>
          }
        >
          <Rosalie3D />
        </Suspense>
      )
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </>
  )
}
