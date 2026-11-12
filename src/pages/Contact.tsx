import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ArrowLeft, ArrowRight, CheckIcon } from '../components/Icons'
import { contactApi } from '../lib/api'
import { useMeta } from '../lib/useMeta'

const inputClass =
  'h-12 w-full rounded-xl border border-ink/15 bg-paper px-4 text-[0.95rem] text-ink outline-none transition focus:border-commun focus:ring-4 focus:ring-commun/10'

export function ContactPage() {
  useMeta('Contact', 'Envoyer un message à l’équipe éditoriale de Cycle\'Up.')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('Signaler une erreur')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [notice, setNotice] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [sending, setSending] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setNotice({ tone: 'error', text: 'Merci de remplir tous les champs obligatoires.' })
      return
    }
    if (!email.includes('@')) {
      setNotice({ tone: 'error', text: 'L’adresse email renseignée n’est pas valide.' })
      return
    }
    if (!consent) {
      setNotice({ tone: 'error', text: 'Vous devez accepter le traitement de vos informations pour envoyer le message.' })
      return
    }

    setSending(true)
    const res = await contactApi.send({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      category,
      message: message.trim(),
    })
    setSending(false)

    if (res.ok) {
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setConsent(false)
      setNotice({ tone: 'success', text: 'Votre message a bien été envoyé. L’équipe éditoriale vous répondra par email.' })
      return
    }
    setNotice({ tone: 'error', text: res.data.error ?? 'L’envoi a échoué, réessayez dans un instant.' })
  }

  return (
    <div className="relative overflow-hidden">
      <div className="page-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-12 -z-10 h-80 w-80 rounded-full bg-commun-soft blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-[1240px] px-5 pt-12 md:px-8 md:pt-16">
        <Breadcrumbs items={[{ label: 'Contact' }]} />
      </div>

      <div className="mx-auto mt-8 grid max-w-[1240px] gap-8 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <section className="reveal self-start lg:sticky lg:top-28">
          <div className="eyebrow-pill font-mono text-[10.5px] uppercase tracking-[0.14em] text-commun">Écrire à l’équipe</div>
          <h1 className="mt-7 font-serif text-[3.6rem] leading-[0.95] font-medium tracking-[-0.05em] md:text-[5rem]">
            Un message à nous transmettre ?
          </h1>
          <p className="mt-7 max-w-md text-[1.05rem] leading-[1.7] text-ink-soft">
            Signalez une erreur, proposez une source ou posez une question sur les contenus du site.
          </p>

          <div className="mt-10 border-t border-rule pt-6">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">Avant d’envoyer</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-commun" />Indiquez la page concernée si vous signalez une erreur.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-commun" />Ajoutez la référence complète pour proposer une source.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-commun" />N’envoyez aucune donnée personnelle sensible.</li>
            </ul>
          </div>

          <Link to="/a-propos/" className="group mt-10 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            À propos du site
          </Link>
        </section>

        <section className="modern-surface reveal reveal-delay-2 p-6 md:p-9" aria-labelledby="formulaire-contact">
          <div className="flex items-start justify-between gap-6 border-b border-rule pb-6">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">Formulaire de contact</p>
              <h2 id="formulaire-contact" className="mt-2 font-serif text-[2rem] leading-tight font-medium">Envoyer un message</h2>
            </div>
            <span className="rounded-full bg-commun-soft px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-commun">Réponse éditoriale</span>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-6" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Nom complet <span className="text-promesse">*</span></span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Prénom et nom" className={`${inputClass} mt-2`} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Adresse email <span className="text-promesse">*</span></span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="nom@exemple.fr" className={`${inputClass} mt-2`} />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">Objet de la demande <span className="text-promesse">*</span></span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Résumez votre demande en une phrase" className={`${inputClass} mt-2`} />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Type de message</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} mt-2`}>
                <option>Signaler une erreur</option>
                <option>Proposer une source</option>
                <option>Poser une question</option>
                <option>Demander une réutilisation</option>
                <option>Autre demande</option>
              </select>
            </label>

            <label className="block">
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium">Votre message <span className="text-promesse">*</span></span>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{message.length} / 2 000</span>
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                rows={9}
                placeholder="Décrivez votre demande avec le plus de précision possible…"
                className="mt-2 w-full resize-y rounded-xl border border-ink/15 bg-paper px-4 py-3 text-[0.95rem] leading-relaxed text-ink outline-none transition focus:border-commun focus:ring-4 focus:ring-commun/10"
              />
            </label>

            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-commun"
              />
              <span>J’accepte que mes informations soient utilisées uniquement pour répondre à cette demande.</span>
            </label>

            {notice && (
              <p
                role={notice.tone === 'error' ? 'alert' : 'status'}
                className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm leading-snug ${
                  notice.tone === 'success' ? 'bg-commun-soft text-commun' : 'bg-promesse-soft text-promesse'
                }`}
              >
                {notice.tone === 'success' && <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />}
                {notice.text}
              </p>
            )}

            <div className="flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">Les champs marqués d’un * sont obligatoires.</p>
              <button
                type="submit"
                disabled={sending}
                className="group inline-flex h-13 items-center justify-center gap-3 rounded-full bg-ink px-7 font-medium text-paper shadow-[0_15px_35px_-20px_rgba(27,26,23,0.75)] transition-all hover:-translate-y-0.5 hover:bg-commun disabled:cursor-wait disabled:opacity-60"
              >
                {sending ? 'Envoi en cours…' : 'Envoyer le message'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
