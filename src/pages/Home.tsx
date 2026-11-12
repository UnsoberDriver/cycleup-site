import { Link } from 'react-router'
import { ArrowRight } from '../components/Icons'
import { IMAGES } from '../content/images'
import { typo } from '../lib/inline'
import { useMeta } from '../lib/useMeta'

export function Home() {
  useMeta(undefined)

  return (
    <div>
      {/* Héros */}
      <section className="relative mx-auto mt-4 min-h-[calc(100svh-108px)] max-w-[1440px] overflow-hidden bg-ink md:mt-6 md:min-h-[calc(100svh-116px)] md:rounded-xl">
        <img
          src={IMAGES.rosalie.src}
          alt={IMAGES.rosalie.alt}
          className="photo-original absolute inset-0 h-full w-full object-cover"
        />

        <div className="reveal absolute bottom-5 left-5 right-5 max-w-[650px] rounded-xl bg-ink/95 p-6 text-paper shadow-[0_24px_70px_-30px_rgba(16,59,49,0.8)] backdrop-blur-sm md:bottom-10 md:left-10 md:right-auto md:p-9">
          <h1 className="font-serif text-[3.2rem] leading-[0.94] font-semibold tracking-[-0.055em] text-balance text-paper md:text-[4.125rem]">
            Cycle'Up.
          </h1>
          <p className="mt-5 max-w-[520px] text-[1rem] leading-[1.6] text-paper/75">
            Une histoire critique des acteurs, des données et des méthodes qui transforment la mobilité.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/partie-1/"
              className="group inline-flex h-14 items-center gap-3 rounded-lg bg-commun-soft px-7 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-paper"
            >
              Voir les projets
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/partie-2/"
              className="group inline-flex h-14 items-center gap-3 rounded-lg border border-paper/35 px-7 text-[0.9375rem] font-medium text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              Explorer la carte
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        <p className="absolute right-4 top-4 rounded-md bg-ink/75 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/70 backdrop-blur-sm md:right-6 md:top-6">
          Photo : {IMAGES.rosalie.credit}
        </p>
      </section>

      <section className="mx-auto mt-20 grid max-w-[1240px] gap-4 px-5 md:grid-cols-2 md:px-8" aria-label="Les entrées principales">
        {[
          { to: '/partie-1/', n: '01', t: 'Les projets', q: 'Découvrir les cas, outils et expérimentations documentés.', bg: 'bg-promesse' },
          { to: '/partie-2/', n: '02', t: 'La carte', q: 'Localiser les territoires et les rosalies.', bg: 'bg-commun' },
        ].map((p) => (
          <Link key={p.to} to={p.to} className={`group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-xl p-8 text-paper shadow-[0_24px_50px_-38px_rgba(16,59,49,0.55)] transition-transform hover:-translate-y-1 md:p-10 ${p.bg}`}>
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-2 font-serif text-[16rem] leading-none text-paper/10">
              {p.n}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/70">{p.n}</span>
            <span className="relative">
              <span className="block font-serif text-[2.2rem] leading-tight font-medium">{p.t}</span>
              <span className="mt-3 block max-w-md font-serif text-[1.05rem] text-paper/75">{typo(p.q)}</span>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                Entrer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}
