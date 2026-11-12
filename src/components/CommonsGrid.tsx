import { useState } from 'react'
import { CheckIcon } from './Icons'

const DIMENSIONS = [
  {
    id: 'ressource',
    title: 'Ressource',
    items: [
      'Le périmètre de la ressource est décrit (logiciel, données, méthode, documentation).',
      'La ressource est accessible publiquement.',
      'La documentation permet à un tiers de la reprendre sans l’équipe d’origine.',
    ],
  },
  {
    id: 'communaute',
    title: 'Communauté',
    items: [
      'Les contributeurs et les mainteneurs sont identifiés.',
      'Des usagers extérieurs au projet d’origine l’utilisent.',
      'Il existe un canal ouvert pour contribuer ou signaler un problème.',
    ],
  },
  {
    id: 'regles',
    title: 'Règles',
    items: [
      'Une licence explicite est publiée.',
      'Les conditions d’accès aux données sont écrites.',
      'Le financement de la maintenance est connu.',
    ],
  },
  {
    id: 'gouvernance',
    title: 'Gouvernance',
    items: [
      'On sait qui décide des évolutions.',
      'La manière de prendre les décisions est documentée.',
      'Les conditions de sortie ou de transmission sont prévues.',
    ],
  },
] as const

function verdict(scores: number[]) {
  const total = scores.reduce((a, b) => a + b, 0)
  if (total === 0) return 'Cochez les éléments documentés pour situer l’initiative.'
  const [res, com, reg, gov] = scores
  const weakest = DIMENSIONS[scores.indexOf(Math.min(...scores))].title.toLowerCase()
  if (total === 12) return 'Les quatre dimensions sont documentées : l’initiative se présente comme un commun. Reste à vérifier que la pratique suit les textes.'
  if (res >= 2 && gov + com <= 2)
    return 'Profil « code ouvert » : la ressource est accessible, mais la communauté et la gouvernance restent implicites. C’est de l’ouverture, pas encore un commun.'
  if (reg <= 1 && res >= 2) return 'La ressource existe, mais ses règles d’usage sont floues : la réutilisation réelle est incertaine.'
  return `Point le plus faible : ${weakest}. C’est la première question à poser au porteur du projet.`
}

export function CommonsGrid() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const scores = DIMENSIONS.map((d) => d.items.filter((_, i) => checked[`${d.id}-${i}`]).length)

  return (
    <section aria-label="Grille de lecture d’un commun numérique" className="modern-surface my-10 overflow-hidden rounded-[1.5rem] border-ink">
      <div className="grid md:grid-cols-2">
        {DIMENSIONS.map((d, di) => (
          <fieldset key={d.id} className={`border-rule p-5 md:p-6 ${di % 2 === 0 ? 'md:border-r' : ''} ${di < 2 ? 'border-b' : di === 2 ? 'border-b md:border-b-0' : ''}`}>
            <legend className="sr-only">{d.title}</legend>
            <div className="mb-4 flex items-baseline justify-between">
              <p className="font-serif text-[1.25rem]">
                <span className="mr-2 font-mono text-xs text-(--accent)">{String(di + 1).padStart(2, '0')}</span>
                {d.title}
              </p>
              <span className="font-mono text-xs text-muted" aria-live="polite">
                {scores[di]}/3
              </span>
            </div>
            <ul className="space-y-2.5">
              {d.items.map((item, i) => {
                const key = `${d.id}-${i}`
                const on = !!checked[key]
                return (
                  <li key={key}>
                    <label className="group flex cursor-pointer gap-3 text-[0.9375rem] leading-snug text-ink-soft">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={on}
                        onChange={() => setChecked((c) => ({ ...c, [key]: !c[key] }))}
                      />
                      <span
                        className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
                          on ? 'border-(--accent) bg-(--accent) text-paper' : 'border-ink/40 bg-paper group-hover:border-ink'
                        }`}
                        aria-hidden="true"
                      >
                        {on && <CheckIcon />}
                      </span>
                      <span className={on ? 'text-ink' : ''}>{item}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        ))}
      </div>
      <div className="flex flex-col gap-4 border-t border-ink bg-paper-deep/60 p-5 md:flex-row md:items-center md:gap-8 md:p-6">
        <div className="flex shrink-0 items-end gap-2" aria-hidden="true">
          {scores.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="flex h-12 w-6 flex-col-reverse gap-[3px]">
                {[0, 1, 2].map((n) => (
                  <span key={n} className={`h-full rounded-[2px] ${n < s ? 'bg-(--accent)' : 'bg-rule'}`} />
                ))}
              </div>
              <span className="font-mono text-[9.5px] uppercase text-muted">{DIMENSIONS[i].title.slice(0, 3)}</span>
            </div>
          ))}
        </div>
        <p className="flex-1 text-[0.98rem] leading-snug text-ink" aria-live="polite">
          {verdict(scores)}
        </p>
        <button
          type="button"
          onClick={() => setChecked({})}
          className="self-start font-mono text-[11px] uppercase tracking-[0.1em] text-muted underline underline-offset-4 hover:text-ink md:self-center"
        >
          Réinitialiser
        </button>
      </div>
    </section>
  )
}
