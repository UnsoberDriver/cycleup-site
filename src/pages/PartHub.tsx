import { Link } from 'react-router'
import {
  ActorsIcon,
  ArrowRight,
  CommonsIcon,
  ExperimentIcon,
  MethodIcon,
  PromiseIcon,
  SourcesIcon,
  TimelineIcon,
} from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { StatusTag } from '../components/StatusTag'
import { PART_PAGES } from '../content/pages'
import { CHAIN_ROLE, PART1_ROLE, PARTS, type PartKey } from '../content/parts'
import { ACTEURS } from '../content/resources'
import { typo } from '../lib/inline'
import { useMeta } from '../lib/useMeta'

function Chain() {
  const pages = PART_PAGES['partie-2']
  return (
    <div className="mt-14 overflow-x-auto">
      <ol className="relative grid min-w-[720px] grid-cols-6" aria-label="La chaîne de la fabrique">
        <svg className="pointer-events-none absolute left-[8.33%] right-[8.33%] top-[9px] h-2 w-[83.33%]" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden="true">
          <line x1="0" y1="1" x2="100" y2="1" stroke="var(--color-commun)" strokeWidth="2" vectorEffect="non-scaling-stroke" className="trace-line" />
        </svg>
        {pages.map((p, i) => (
          <li key={p.path} className="relative flex flex-col items-center text-center">
            <Link to={p.path} className="group flex flex-col items-center">
              <span className={`relative z-10 h-5 w-5 border-2 border-commun ${i === pages.length - 1 ? 'bg-commun' : 'bg-paper group-hover:bg-commun'} transition-colors`} />
              <span className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-commun">{CHAIN_ROLE[p.path]}</span>
              <span className="mt-1 px-2 font-serif text-[1.05rem] leading-tight group-hover:underline">{p.navTitle}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

function RoleIcon({ role }: { role?: string }) {
  const Icon =
    role === 'Acteur'
      ? ActorsIcon
      : role === 'Expérimentation' || role === 'Outil'
        ? ExperimentIcon
        : role === 'Prospective'
          ? PromiseIcon
          : role === 'Cadre'
            ? CommonsIcon
            : role === 'Méthode' || role === 'Critique'
              ? MethodIcon
              : role === 'Terrain'
                ? TimelineIcon
                : SourcesIcon
  return <Icon className="h-6 w-6" />
}

export function PartHub({ partKey }: { partKey: PartKey }) {
  const part = PARTS[partKey]
  const pages = PART_PAGES[partKey]
  useMeta(part.seoTitle, part.description)
  const roles = partKey === 'partie-1' ? PART1_ROLE : CHAIN_ROLE
  const actors = partKey === 'partie-1' ? ['la-rochelle-agglo', 'fing', 'ademe', 'sdes'] : ['fabmob', 'la-rochelle-agglo', 'ademe']

  return (
    <div>
      <div className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 top-4 select-none font-serif text-[16rem] leading-none text-(--accent) opacity-[0.08] md:text-[28rem]"
        >
          {part.numeral}
        </span>
        <PageHeader crumbs={[{ label: `Partie ${part.numeral}` }]} kicker={`Partie ${part.numeral}`} title={part.title} question={part.question} />
      </div>

      <div className="mx-auto mt-16 grid max-w-[1240px] gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
        <div className="modern-surface reveal reveal-delay-2 max-w-[720px] self-start p-7 md:p-10">
          <p className="font-serif text-[1.35rem] leading-[1.5] md:text-[1.5rem]">{typo(part.intro[0])}</p>
          <p className="mt-6 text-[1.0625rem] leading-[1.75] text-ink-soft">{typo(part.intro[1])}</p>
          <aside className="mt-10 rounded-[1.25rem] bg-ink p-7 text-paper">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-(--accent)">Encadré</p>
            <p className="font-serif text-[1.65rem] leading-[1.3] tracking-[-0.01em] text-paper md:text-[1.9rem]">{typo(part.callout)}</p>
          </aside>
        </div>
        {part.image && (
          <figure className="reveal reveal-delay-3 relative lg:mt-2 lg:rotate-[1.5deg]">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-(--accent-soft)" aria-hidden="true" />
            <div className="overflow-hidden rounded-[1.75rem] bg-(--accent-soft) shadow-[0_32px_70px_-38px_rgba(27,26,23,0.6)]">
              <img src={part.image.src} alt={part.image.alt} className="photo-original aspect-[4/5] w-full object-cover" />
            </div>
            <figcaption className="mt-3 text-sm leading-snug text-muted">
              {typo(part.image.caption)}
              <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.1em]">Photo : {part.image.credit}</span>
            </figcaption>
          </figure>
        )}
      </div>

      <section className="mx-auto mt-24 max-w-[1240px] px-5 md:px-8" aria-labelledby="pages-partie">
        <div className="flex flex-col gap-2 border-b-2 border-ink pb-4 md:flex-row md:items-end md:justify-between">
          <h2 id="pages-partie" className="font-serif text-[2rem] font-medium tracking-[-0.01em]">
            {pages.length === 4 ? 'Les quatre pages' : 'Les six pages'}
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{part.orderLabel}</p>
        </div>
        {partKey === 'partie-2' && <Chain />}
        <ol className={`mt-8 grid gap-4 md:grid-cols-2 ${partKey === 'partie-2' ? 'lg:grid-cols-3' : ''}`}>
          {pages.map((p, i) => (
            <li key={p.path} className="modern-surface lift-card scroll-reveal overflow-hidden">
              <Link to={p.path} className="group flex h-full flex-col p-6">
                <span className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm text-(--accent)">{part.numeral}.{i + 1}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-(--accent-soft) text-(--accent)">
                    <RoleIcon role={roles[p.path]} />
                  </span>
                </span>
                <span className="mt-8">
                  <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{roles[p.path]}</span>
                  <span className="mt-2 block font-serif text-[1.65rem] leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                    {p.navTitle}
                  </span>
                </span>
                <span className="mt-4 flex-1 font-serif text-[1.05rem] leading-snug text-ink-soft">{typo(p.question)}</span>
                <span className="mt-7 flex items-center justify-between gap-3">
                  <StatusTag status={p.status} />
                  <ArrowRight className="h-5 w-5 text-(--accent) transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-20 max-w-[1240px] px-5 md:px-8" aria-labelledby="acteurs-partie">
        <h2 id="acteurs-partie" className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          Les acteurs de cette partie
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {actors.map((id) => {
            const a = ACTEURS.find((x) => x.id === id)!
            return (
              <li key={id}>
                <Link
                  to={`/ressources/acteurs/#${a.id}`}
                className="modern-surface lift-card inline-flex items-baseline gap-2 rounded-full px-4 py-2"
                >
                  <span className="font-serif text-[1.05rem]">{a.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{a.kind.split(' · ')[0]}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
