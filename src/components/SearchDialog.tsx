import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { normalize, search, type SearchResult } from '../lib/search'
import { typo } from '../lib/inline'
import { ArrowRight, SearchIcon } from './Icons'

export const SUGGESTIONS = ['FING', 'FabMob', 'self data', 'commun numérique', 'La Rochelle', 'Moissac', 'reliance par kilomètre', '2012']

/** Wraps every occurrence of the search terms, accent-insensitively. */
export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const norm = normalize(text)
  if (norm.length !== text.length || !terms.length) return <>{text}</>
  const marks: [number, number][] = []
  for (const t of terms) {
    let i = norm.indexOf(t)
    while (i >= 0) {
      marks.push([i, i + t.length])
      i = norm.indexOf(t, i + t.length)
    }
  }
  marks.sort((a, b) => a[0] - b[0])
  const out: React.ReactNode[] = []
  let pos = 0
  marks.forEach(([s, e], k) => {
    if (s < pos) return
    out.push(text.slice(pos, s), <mark key={k} className="rounded-[2px] bg-alerte-soft px-0.5 text-ink">{text.slice(s, e)}</mark>)
    pos = e
  })
  out.push(text.slice(pos))
  return <>{out}</>
}

const KIND_COLOR: Record<string, string> = {
  Page: 'text-ink',
  Section: 'text-muted',
  Glossaire: 'text-commun',
  Chronologie: 'text-promesse',
  Acteur: 'text-commun',
  Source: 'text-muted',
}

export type SearchDialogHandle = { open: (q?: string) => void }

export const SearchDialog = forwardRef<SearchDialogHandle>(function SearchDialog(_, ref) {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const results = useMemo(() => search(q), [q])

  useImperativeHandle(ref, () => ({
    open(initial) {
      if (initial !== undefined) setQ(initial)
      dialog.current?.showModal()
      requestAnimationFrame(() => input.current?.select())
    },
  }))

  useEffect(() => setActive(0), [q])
  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (r: SearchResult) => {
    dialog.current?.close()
    navigate(r.path)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      go(results[active])
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-label="Recherche"
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="m-0 mx-auto mt-[8vh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-[1.75rem] border border-ink/15 bg-paper/95 p-0 text-ink shadow-[0_40px_100px_-20px_rgba(27,26,23,0.55)] backdrop:bg-transparent backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 border-b border-rule px-5">
        <SearchIcon className="h-5 w-5 text-muted" />
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Un acteur, un concept, un lieu, une citation, une date…"
          className="h-16 flex-1 bg-transparent font-serif text-xl outline-none placeholder:text-muted/70"
          aria-label="Rechercher"
          aria-controls="resultats-recherche"
          aria-activedescendant={results[active] ? `resultat-${active}` : undefined}
          role="combobox"
          aria-expanded={results.length > 0}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="rounded border border-rule px-1.5 py-0.5 font-mono text-[11px] text-muted hover:text-ink"
        >
          Échap
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {!q.trim() && (
          <div className="p-5">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Essayer</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQ(s)
                    input.current?.focus()
                  }}
                  className="rounded-full border border-rule px-3 py-1 text-sm text-ink-soft hover:border-ink/40 hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {q.trim() && results.length === 0 && (
          <p className="p-6 text-ink-soft">
            Aucun résultat pour « {q} ». Essayez un nom d’acteur, un lieu ou une année.
          </p>
        )}
        {results.length > 0 && (
          <ul ref={list} id="resultats-recherche" role="listbox" className="py-2">
            {results.map((r, i) => (
              <li
                key={r.path + r.title + r.kind}
                id={`resultat-${i}`}
                data-index={i}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => go(r)}
                className={`mx-2 cursor-pointer rounded-sm px-4 py-3 ${i === active ? 'bg-paper-deep' : ''}`}
              >
                <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.1em]">
                  <span className={KIND_COLOR[r.kind]}>{r.kind}</span>
                  <span className="truncate text-muted">{r.context}</span>
                  {i === active && <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted" />}
                </div>
                <p className="mt-1 font-serif text-[1.1rem] leading-snug">
                  <Highlight text={typo(r.title)} terms={r.terms} />
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-snug text-ink-soft">
                  <Highlight text={r.snippet} terms={r.terms} />
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-4 border-t border-rule px-5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
        <span>↑ ↓ naviguer</span>
        <span>↵ ouvrir</span>
        <span className="ml-auto">{results.length ? `${results.length} résultat${results.length > 1 ? 's' : ''}` : 'Recherche locale'}</span>
      </div>
    </dialog>
  )
})
