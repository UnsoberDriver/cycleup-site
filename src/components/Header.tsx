import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { PRIMARY_NAV } from '../content/site'
import { ArrowRight, CloseIcon, MenuIcon, SearchIcon } from './Icons'
import { Logo } from './Logo'
import { useSearch } from './searchContext'

export function Header() {
  const { open } = useSearch()
  const [menu, setMenu] = useState(false)
  const location = useLocation()
  const projectDetailPaths = [
    '/partie-1/',
    '/partie-1/la-rochelle/',
    '/partie-2/tracemob/',
    '/partie-2/territoires-peu-denses/',
  ]

  useEffect(() => setMenu(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper-deep/95">
      {/* Le flou porte sur la barre uniquement : un backdrop-filter sur <header> ferait
          du header le containing block des éléments fixed, et casserait le panneau mobile. */}
      <div className="mx-auto flex h-[84px] max-w-[1280px] items-center justify-between gap-6 px-5 md:px-8 backdrop-blur-xl">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => {
            const isActive =
              item.section === 'accueil'
                ? location.pathname === '/'
                : item.section === 'partie-1'
                ? projectDetailPaths.includes(location.pathname)
                : item.section === 'partie-2'
                  ? location.pathname === '/partie-2/'
                  : item.section === 'ressources'
                    ? location.pathname === '/ressources/'
                    : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`relative rounded-sm px-3.5 py-2 text-[0.9375rem] transition-colors ${
                  isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-[13px] h-[3px] rounded-full transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background:
                      item.section === 'partie-1'
                        ? 'var(--color-promesse)'
                        : item.section === 'partie-2'
                          ? 'var(--color-commun)'
                          : 'var(--color-ink)',
                  }}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => open()}
            className="flex h-11 items-center gap-2.5 rounded-lg border border-ink/10 bg-ink px-3.5 text-sm text-paper shadow-sm transition-colors hover:bg-(--accent) md:w-56"
            aria-label="Rechercher dans le site"
          >
            <SearchIcon />
            <span className="hidden md:inline">Rechercher</span>
            <kbd className="ml-auto hidden rounded border border-paper/30 px-1.5 font-mono text-[11px] text-paper/70 md:inline">/</kbd>
          </button>
          <Link
            to="/connexion/"
            className="hidden h-11 items-center rounded-lg border border-ink/15 px-4 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:border-ink/30 hover:bg-commun-soft hover:text-ink sm:inline-flex"
          >
            Login
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink/15 text-ink transition-colors hover:bg-commun-soft lg:hidden"
            aria-expanded={menu}
            aria-controls="menu-mobile"
            aria-label={menu ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menu && (
        <div
          id="menu-mobile"
          className="fixed inset-x-3 top-[92px] z-50 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-rule bg-paper/95 px-4 pb-3 pt-2 shadow-2xl backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Navigation mobile">
            <ul className="divide-y divide-rule">
              {PRIMARY_NAV.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="group flex items-center justify-between gap-4 py-3">
                    <span>
                      <span className="block font-serif text-lg font-semibold leading-tight">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-muted">{item.sub}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
