import { Link } from 'react-router'

export type Crumb = { label: string; path?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Accueil', path: '/' }, ...items]
  return (
    <nav aria-label="Fil d’Ariane" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-rule">/</span>}
            {c.path && i < all.length - 1 ? (
              <Link to={c.path} className="hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
