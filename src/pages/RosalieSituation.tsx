import { Link } from 'react-router'
import { ArrowLeft, ArrowRight } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { useMeta } from '../lib/useMeta'

/** Fiches du texte « Mise en situation de la Rosalie », présenté en pleine page. */
const SECTIONS = [
  {
    id: 'le-projet',
    title: 'Le projet Cycle’Up',
    text: 'Le projet Cycle’up met en place une révolution : la rosalie. Cycle’up est présent dans le milieu éco-responsable car son but est de trouver un moyen de simplifier la vie des personnes jeunes tout comme âgées. Ils se concentrent sur un modèle durable, fiable, disponible le plus possible et à portée de main. Il cherche aussi un moyen d’attirer la foule, peu importe s’ils sont concernés ou pas, ils seront attirés par le projet, voire même le supporter.',
  },
  {
    id: 'la-rosalie-tarbes',
    title: 'La rosalie, un objet qui répond aux transports',
    text: 'La rosalie est un projet sur Tarbes qui révolutionne les transports : une sorte d’objet de cirque confectionné pour répondre aux problèmes de mobilité et de transports. Elle suit un modèle écologique, durable, éco-responsable.',
  },
  {
    id: 'flash-mcqueen',
    title: 'Flash McQueen : attirer le regard',
    text: 'Pour le projet de Cycle’up sur la Rosalie, nous proposons une manière de rapatrier une génération entière en choisissant de la customiser avec une carrosserie Flash McQueen ! On compte sur elle pour attirer l’œil de toutes les personnes comprises entre environ 3 et 25 ans. C’est une bonne manière de faire passer ce sérieux du projet en un objet ludique qui fait rire la foule et qui intrigue.',
    highlight: true,
  },
  {
    id: 'et-apres',
    title: 'Et après : un support de promotion',
    text: 'Le but sera aussi par la suite d’utiliser son aspect qui attire le regard pour y implémenter des affiches et panneaux publicitaires pour promouvoir le projet Cycle’up.',
  },
]

export function RosalieSituationPage() {
  useMeta(
    'Mise en situation de la Rosalie',
    'Le projet Cycle’Up à Tarbes : la rosalie, un objet écologique et ludique pensé pour attirer le regard.',
  )

  return (
    <div>
      <PageHeader
        crumbs={[{ label: 'Projets', path: '/partie-1/' }, { label: 'Mise en situation de la Rosalie' }]}
        kicker="Projets · Tarbes · Cycle'Up"
        title="Mise en situation de la Rosalie"
        question="Comment la rosalie devient-elle l'objet vitrine du projet Cycle'Up à Tarbes ?"
      />

      <main className="mx-auto mt-8 grid max-w-[1240px] gap-10 px-5 md:px-8 lg:mt-12 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Sur cette page</p>
          <ul className="modern-surface mt-4 space-y-0.5 rounded-[1.25rem] p-3">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-lg px-3 py-2 text-[0.875rem] leading-snug text-ink-soft transition-colors hover:bg-commun-soft hover:text-ink"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="max-w-[720px] min-w-0">
          <p className="font-serif text-[1.35rem] leading-[1.5] text-ink md:text-[1.45rem]">
            À Tarbes, le projet Cycle’Up choisit un objet improbable pour porter la mobilité partagée : une rosalie.
            Voici la mise en situation complète, en quatre temps.
          </p>

          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="anchor-target mt-14 scroll-mt-28">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-muted">0{i + 1}</span>
                <h2 className="font-serif text-[1.85rem] leading-[1.15] font-medium tracking-[-0.02em] md:text-[2.1rem]">
                  {s.title}
                </h2>
              </div>
              <p className={`mt-5 text-[1.0625rem] leading-[1.75] ${s.highlight ? 'modern-surface border-l-4 border-l-commun px-5 py-4 text-ink md:px-6 md:py-5' : 'text-ink-soft'}`}>
                {s.text}
              </p>
            </section>
          ))}

          <div className="mt-16 grid gap-3 sm:grid-cols-2">
            <Link
              to="/a-propos/#rosalie"
              className="modern-surface lift-card group p-5"
            >
              <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-commun">
                Modèle 3D <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 block font-serif text-lg leading-snug">Voir la rosalie en 3D</span>
              <span className="mt-1 block text-sm text-muted">Le modèle du Vhéliotech, à faire tourner dans tous les sens.</span>
            </Link>
            <Link to="/partie-1/" className="modern-surface lift-card group p-5">
              <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Retour
              </span>
              <span className="mt-2 block font-serif text-lg leading-snug">Tous les projets</span>
              <span className="mt-1 block text-sm text-muted">Les cas documentés sur le site.</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
