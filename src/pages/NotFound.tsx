import { Link, useLocation } from 'react-router'
import { ArrowRight, SearchIcon } from '../components/Icons'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { useSearch } from '../components/searchContext'
import { useMeta } from '../lib/useMeta'

export function NotFound() {
  useMeta('Page introuvable', 'Cette page n’existe pas ou plus.')
  const { open } = useSearch()
  const { pathname } = useLocation()
  const guess = pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? ''

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 md:px-8 md:pt-14">
      <Breadcrumbs items={[{ label: 'Page introuvable' }]} />
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-sm text-promesse">404</p>
          <h1 className="mt-4 font-serif text-[3rem] leading-[1.02] font-medium tracking-[-0.025em] md:text-[4.4rem]">
            Cette trace ne mène nulle part.
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-ink-soft">
            La page demandée n’existe pas, ou pas encore. Les URLs publiées de ce site ne changent pas : si vous suivez un lien ancien, signalez-le-nous.
          </p>
          <button
            type="button"
            onClick={() => open(guess && guess !== '404' ? guess : '')}
            className="mt-10 inline-flex h-12 items-center gap-3 rounded-full bg-ink px-6 text-[0.9375rem] text-paper hover:bg-promesse"
          >
            <SearchIcon /> Rechercher{guess && guess !== '404' ? ` « ${guess} »` : ' dans le site'}
          </button>
        </div>
        <ul className="self-end border-t-2 border-ink">
          {[
            { to: '/', label: 'Accueil' },
            { to: '/partie-1/', label: 'Projets' },
            { to: '/partie-2/', label: 'Carte des rosalies' },
            { to: '/ressources/', label: 'Forum' },
          ].map((l) => (
            <li key={l.to} className="border-b border-rule">
              <Link to={l.to} className="group flex items-center justify-between py-4 font-serif text-[1.25rem]">
                {l.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
