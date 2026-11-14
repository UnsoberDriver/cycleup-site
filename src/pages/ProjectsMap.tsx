import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, CommonsIcon, ExperimentIcon, MethodIcon, SourcesIcon } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { IMAGES } from '../content/images'
import { useMeta } from '../lib/useMeta'

const PROJECTS = [
  {
    number: '02',
    title: 'Self Data Territorial',
    place: 'La Rochelle',
    text: 'Une expérimentation pour rendre aux habitants la maîtrise de leurs données de déplacement.',
    path: '/partie-1/la-rochelle/',
    Icon: ExperimentIcon,
  },
  {
    number: '03',
    title: 'TraceMob',
    place: 'Commun numérique',
    text: 'Un traceur de mobilité open source, réutilisable pour les expérimentations territoriales.',
    path: '/partie-2/tracemob/',
    Icon: CommonsIcon,
  },
  {
    number: '04',
    title: 'Cycle\'Up',
    place: 'Sobrarbe',
    text: 'Un cas d’application sur les mobilités partagées dans un territoire très peu dense.',
    path: '/partie-2/territoires-peu-denses/#cycle-up',
    Icon: MethodIcon,
  },
  {
    number: '05',
    title: 'M covoit’ Lignes+',
    place: 'Massif du Vercors',
    text: 'Un service public de covoiturage dont la montée en charge se construit dans la durée.',
    path: '/partie-2/territoires-peu-denses/#m-covoit',
    Icon: SourcesIcon,
  },
]

export function ProjectsPage() {
  useMeta('Projets', 'Les projets et cas d’application documentés sur le site.')

  return (
    <div>
      <PageHeader
        crumbs={[{ label: 'Projets' }]}
        kicker="Projets"
        title="Les projets documentés"
        question="Comment les idées deviennent-elles des expérimentations, des outils et des services ?"
      />

      <section className="mx-auto mt-10 max-w-[1240px] px-5 md:px-8" aria-label="Liste des projets">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/mise-en-situation/"
            className="lift-card group relative flex min-h-[310px] flex-col overflow-hidden rounded-xl bg-ink p-7 text-paper md:p-9"
          >
            <div className="flex items-start justify-between gap-5">
              <span className="font-mono text-xs font-medium tracking-[0.12em] text-commun-soft">01</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-commun-soft text-ink">
                <ExperimentIcon className="h-7 w-7" />
              </span>
            </div>
            <div className="mt-auto pt-12">
              <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-commun-soft">Tarbes · Cycle'Up</p>
              <h2 className="mt-3 font-serif text-[2rem] font-semibold leading-tight tracking-[-0.035em]">
                Mise en situation de la Rosalie
              </h2>
              <p className="mt-3 max-w-lg text-[0.95rem] leading-[1.65] text-paper/80">
                Une rosalie customisée Flash McQueen pour attirer le regard, simplifier la vie de toutes les générations et faire rire la foule.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-paper">
                Découvrir le projet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
            <span className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full border-[32px] border-commun-soft/15" aria-hidden="true" />
          </Link>
          {PROJECTS.map((project, index) => (
            <Link
              key={project.title}
              to={project.path}
              className="modern-surface lift-card group relative flex min-h-[310px] flex-col overflow-hidden p-7 md:p-9"
            >
              <div className="flex items-start justify-between gap-5">
                <span className="font-mono text-xs font-medium tracking-[0.12em] text-muted">{project.number}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-commun-soft text-ink">
                  <project.Icon className="h-7 w-7" />
                </span>
              </div>
              <div className="mt-auto pt-12">
                <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted">{project.place}</p>
                <h2 className="mt-3 font-serif text-[2rem] font-semibold leading-tight tracking-[-0.035em]">{project.title}</h2>
                <p className="mt-3 max-w-lg text-[0.95rem] leading-[1.65] text-ink-soft">{project.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
                  Découvrir le projet
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              {index === 0 && (
                <span className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full border-[32px] border-commun-soft/40" aria-hidden="true" />
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

type Location = {
  id: number
  name: string
  region: string
  date: string
  year: string
  description: string
  coordinates: [number, number]
  path: string
}

const LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'Tarbes',
    region: 'Hautes-Pyrénées · France',
    date: 'Mars 2027',
    year: '03/27',
    description: 'Site de rosalie situé à Tarbes.',
    coordinates: [43.2329, 0.0781],
    path: '/partie-1/',
  },
  {
    id: 2,
    name: 'Pau',
    region: 'Pyrénées-Atlantiques · France',
    date: 'Juin 2027',
    year: '06/27',
    description: 'Site de rosalie situé à Pau.',
    coordinates: [43.2951, -0.3708],
    path: '/partie-1/',
  },
  {
    id: 3,
    name: 'Toulouse',
    region: 'Haute-Garonne · France',
    date: 'Octobre 2027',
    year: '10/27',
    description: 'Site de rosalie situé à Toulouse.',
    coordinates: [43.6047, 1.4442],
    path: '/partie-1/',
  },
  {
    id: 4,
    name: 'Lourdes',
    region: 'Hautes-Pyrénées · France',
    date: 'Avril 2028',
    year: '04/28',
    description: 'Site de rosalie situé à Lourdes.',
    coordinates: [43.0915, -0.0457],
    path: '/partie-1/',
  },
]

function RosalieMap({ active, onSelect }: { active: number; onSelect: (id: number) => void }) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let map: import('leaflet').Map | undefined
    let cancelled = false

    void import('leaflet').then(({ default: L }) => {
      if (cancelled || !elementRef.current) return
      map = L.map(elementRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(map)

      const bounds = L.latLngBounds([])
      LOCATIONS.forEach((location) => {
        bounds.extend(location.coordinates)
        const marker = L.marker(location.coordinates, {
          icon: L.divIcon({
            className: 'rosalie-map-marker-wrap',
            html: `<span data-location-id="${location.id}" class="rosalie-map-marker${location.id === active ? ' is-active' : ''}">${location.year}</span>`,
            iconSize: [50, 44],
            iconAnchor: [25, 42],
          }),
          title: location.name,
        }).addTo(map!)
        marker.on('click', () => onSelect(location.id))
      })
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 7 })
    })

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [onSelect])

  useEffect(() => {
    const marker = elementRef.current?.parentElement?.querySelectorAll<HTMLElement>('.rosalie-map-marker')
    marker?.forEach((item) => item.classList.toggle('is-active', item.dataset.locationId === String(active)))
  }, [active])

  return <div ref={elementRef} className="h-full min-h-[520px] w-full" aria-label="Carte des territoires documentés" />
}

export function MapPage() {
  useMeta('Carte des rosalies', 'Carte des territoires et localisations documentés sur le site.')
  const [active, setActive] = useState(LOCATIONS[0].id)
  const selected = LOCATIONS.find((location) => location.id === active) ?? LOCATIONS[0]

  return (
    <div>
      <PageHeader
        crumbs={[{ label: 'Carte' }]}
        kicker="Carte"
        title="Localiser les rosalies"
        question="Où se situent les territoires et cas de mobilité documentés ?"
      />

      <section className="mx-auto mt-9 max-w-[1400px] px-5 md:px-8">
        <div className="grid overflow-hidden rounded-xl border border-ink/10 bg-paper-deep shadow-[0_24px_65px_-45px_rgba(16,59,49,0.45)] lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="order-2 border-t border-rule bg-paper p-5 lg:order-1 lg:border-r lg:border-t-0 lg:p-6">
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted">
              {LOCATIONS.length} localisations
            </p>
            <ol className="mt-5 space-y-2">
              {LOCATIONS.map((location) => (
                <li key={location.id}>
                  <button
                    type="button"
                    onClick={() => setActive(location.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      active === location.id
                        ? 'border-ink bg-ink text-paper'
                        : 'border-ink/10 bg-paper-deep text-ink hover:border-ink/30'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-7 min-w-12 shrink-0 items-center justify-center rounded-md px-2 text-[11px] font-semibold ${
                        active === location.id ? 'bg-commun-soft text-ink' : 'bg-commun-soft'
                      }`}>
                        {location.year}
                      </span>
                      <span>
                        <span className="block font-medium">{location.name}</span>
                        <span className={`mt-0.5 block text-xs ${active === location.id ? 'text-paper/60' : 'text-muted'}`}>{location.region}</span>
                        <span className={`mt-0.5 block text-[11px] ${active === location.id ? 'text-commun-soft' : 'text-muted'}`}>Mise en place prévue · {location.date}</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-lg bg-commun-soft p-5 text-ink">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em]">Localisation sélectionnée</p>
              <h2 className="mt-2 text-xl font-semibold">{selected.name}</h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-ink/55">Mise en place prévue · {selected.date}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{selected.description}</p>
              <Link to={selected.path} className="group mt-4 inline-flex items-center gap-2 text-sm font-medium">
                Voir le cas documenté
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="order-1 flex min-h-[520px] flex-col lg:order-2">
            <div className="min-h-[520px] flex-1">
              <RosalieMap active={active} onSelect={setActive} />
            </div>
            <p className="border-t border-rule bg-paper px-5 py-4 text-xs leading-relaxed text-muted lg:px-6">
              Pour une demande d'ajout d'emplacement de rosalies, veuillez vous adresser à notre équipe via le{' '}
              <Link to="/contact/" className="prose-link text-ink-soft">
                formulaire
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
