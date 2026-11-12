import { Link } from 'react-router'
import { SITE } from '../content/site'

const LOGO_SRC = `${import.meta.env.BASE_URL}logo-cycleup.webp`

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={`${SITE.name} — accueil`}>
      <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-ink/10 transition-transform duration-300 group-hover:scale-105">
        <img src={LOGO_SRC} alt="Cycle'Up" width={480} height={406} className="h-full w-full object-contain" />
      </span>
      <span className={`font-serif text-[1.15rem] font-medium leading-none tracking-[-0.01em] ${inverted ? 'text-paper' : ''}`}>{SITE.name}</span>
    </Link>
  )
}
