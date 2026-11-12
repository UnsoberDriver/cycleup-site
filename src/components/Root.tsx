import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'
import { SearchContext } from './searchContext'
import { SearchDialog, type SearchDialogHandle } from './SearchDialog'

const ACCENTS: Record<string, [string, string]> = {
  'partie-1': ['var(--color-promesse)', 'var(--color-promesse-soft)'],
  'partie-2': ['var(--color-commun)', 'var(--color-commun-soft)'],
}

export function Root() {
  const searchRef = useRef<SearchDialogHandle>(null)
  const open = useCallback((q?: string) => searchRef.current?.open(q), [])
  const ctx = useMemo(() => ({ open }), [open])
  const { pathname } = useLocation()
  const section = pathname.split('/')[1] ?? ''
  const [accent, soft] = ACCENTS[section] ?? ['var(--color-ink)', 'var(--color-paper-deep)']

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <SearchContext.Provider value={ctx}>
      <a
        href="#contenu"
        className="fixed left-3 top-3 z-50 -translate-y-24 rounded bg-ink px-3 py-2 text-sm text-paper focus:translate-y-0"
      >
        Aller au contenu
      </a>
      <div className="flex min-h-screen flex-col" style={{ '--accent': accent, '--accent-soft': soft } as React.CSSProperties}>
        <div
          aria-hidden="true"
          className="reading-progress fixed inset-x-0 top-0 z-[60] h-[3px] bg-(--accent)"
        />
        <Header />
        <main id="contenu" className="flex-1 animate-[reveal-up_420ms_ease-out_both]">
          <Outlet />
        </main>
        <Footer />
      </div>
      <SearchDialog ref={searchRef} />
      <ScrollRestoration />
    </SearchContext.Provider>
  )
}
