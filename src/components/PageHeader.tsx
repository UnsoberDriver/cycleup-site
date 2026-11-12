import { typo } from '../lib/inline'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

export function PageHeader({
  crumbs,
  kicker,
  title,
  question,
  children,
}: {
  crumbs: Crumb[]
  kicker?: React.ReactNode
  title: string
  question?: string
  children?: React.ReactNode
}) {
  return (
    <header className="relative mx-auto max-w-[1280px] overflow-hidden px-5 pt-8 md:px-8 md:pt-10">
      <div className="page-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[24rem]" aria-hidden="true" />
      <Breadcrumbs items={crumbs} />
      <div className="mt-7 max-w-5xl md:mt-9">
        {kicker && <div className="eyebrow-pill reveal mb-4 font-mono text-[11.5px] uppercase tracking-[0.14em] text-(--accent)">{kicker}</div>}
        <h1 className="reveal reveal-delay-1 font-serif text-[2.6rem] leading-[0.98] font-semibold tracking-[-0.04em] text-balance md:text-[3.75rem]">{typo(title)}</h1>
        {question && (
          <p className="reveal reveal-delay-2 mt-6 flex max-w-3xl gap-4 border-l-2 border-(--accent) pl-5 font-serif text-[1.15rem] leading-snug text-ink-soft md:text-[1.35rem]">
            <span className="mt-2.5 shrink-0 font-mono text-[10.5px] not-italic uppercase tracking-[0.14em] text-(--accent)">Question</span>
            <span>{typo(question)}</span>
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
