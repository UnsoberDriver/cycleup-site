import { Link } from 'react-router'
import { SITE } from '../content/site'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo inverted />
            <p className="mt-6 max-w-xs font-serif text-lg leading-snug text-paper/80">
              Une histoire critique des acteurs, des données et des méthodes qui transforment la mobilité.
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">Explorer</p>
            <ul className="mt-4 space-y-2 text-[0.9375rem]">
              <li><Link to="/partie-1/" className="text-paper/80 hover:text-paper">Projets</Link></li>
              <li><Link to="/partie-2/" className="text-paper/80 hover:text-paper">Carte des rosalies</Link></li>
              <li><Link to="/ressources/" className="text-paper/80 hover:text-paper">Forum</Link></li>
              <li><Link to="/a-propos/" className="text-paper/80 hover:text-paper">À propos</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">Le site</p>
            <ul className="mt-4 space-y-2 text-[0.9375rem]">
              <li><Link to="/contact/" className="text-paper/80 hover:text-paper">Contact</Link></li>
              <li><Link to="/a-propos/#citer" className="text-paper/80 hover:text-paper">Comment citer</Link></li>
              <li><Link to="/connexion/" className="text-paper/80 hover:text-paper">Login</Link></li>
              <li><Link to="/ressources/bibliographie/" className="text-paper/80 hover:text-paper">Sources</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-paper/15 pt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-paper/55 md:flex-row md:items-center md:justify-between">
          <span>Mis à jour le {SITE.updated}</span>
          <span>
            <Link to="/a-propos/" className="hover:text-paper">Mentions légales</Link>
            {' · '}
            <Link to="/a-propos/#donnees-personnelles" className="hover:text-paper">Privacy policy</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
