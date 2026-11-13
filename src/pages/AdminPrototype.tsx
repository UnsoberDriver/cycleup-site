import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, CheckIcon, CloseIcon } from '../components/Icons'
import { Logo } from '../components/Logo'
import { CONTENT_PAGES } from '../content/pages'
import { adminApi, type AdminBan, type ContactEntry, type ForumMessage, type GalleryPhoto } from '../lib/api'
import { useMeta } from '../lib/useMeta'

function EyeIcon({ crossed = false }: { crossed?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      {crossed && <path d="m4 4 16 16" />}
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint && <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{hint}</span>}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

const inputClass =
  'h-12 w-full rounded-xl border border-ink/15 bg-paper px-4 text-[0.95rem] text-ink outline-none transition focus:border-commun focus:ring-4 focus:ring-commun/10'

const TOKEN_KEY = 'mobilites-admin-token'

export function LoginPage() {
  useMeta('Connexion administration', 'Connexion à l’espace d’administration du site.')
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [fullName, setFullName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmation, setRegisterConfirmation] = useState('')
  const [registrationNotice, setRegistrationNotice] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!password.trim()) {
      setError('Renseignez votre mot de passe.')
      return
    }
    setSubmitting(true)
    // L'identifiant est facultatif : sans identifiant on utilise le mot de passe
    // administrateur global ; avec un e-mail on ouvre le compte éditorial correspondant.
    const res = identifier.trim()
      ? await adminApi.loginAccount(identifier.trim(), password)
      : await adminApi.login(password)
    setSubmitting(false)
    if (!res.ok || !res.data.token) {
      setError(res.data.error ?? 'Connexion impossible, réessayez dans un instant.')
      return
    }
    const storage = remember ? window.localStorage : window.sessionStorage
    const otherStorage = remember ? window.sessionStorage : window.localStorage
    otherStorage.removeItem(TOKEN_KEY)
    storage.setItem(TOKEN_KEY, res.data.token)
    navigate('/administration/')
  }

  async function register(e: FormEvent) {
    e.preventDefault()
    setRegistrationNotice('')
    if (!fullName.trim() || !registerEmail.trim() || !registerPassword || !registerConfirmation) {
      setRegistrationNotice('Tous les champs sont obligatoires.')
      return
    }
    if (registerPassword.length < 8) {
      setRegistrationNotice('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (registerPassword !== registerConfirmation) {
      setRegistrationNotice('Les deux mots de passe ne correspondent pas.')
      return
    }
    setSubmitting(true)
    const res = await adminApi.register({ name: fullName.trim(), email: registerEmail.trim(), password: registerPassword })
    setSubmitting(false)
    if (!res.ok) {
      setRegistrationNotice(res.data.error ?? 'Création du compte impossible, réessaie dans un instant.')
      return
    }
    // Connexion immédiate avec le compte créé.
    const login = await adminApi.loginAccount(registerEmail.trim(), registerPassword)
    if (login.ok && login.data.token) {
      window.localStorage.setItem(TOKEN_KEY, login.data.token)
      navigate('/administration/')
      return
    }
    setRegistrationNotice(res.data.message ?? 'Compte créé. Tu peux te connecter.')
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] px-3 py-4 md:px-5 md:py-6">
      <div className="mx-auto grid min-h-[720px] max-w-[1240px] overflow-hidden rounded-[2rem] border border-ink/10 bg-paper shadow-[0_35px_100px_-45px_rgba(27,26,23,0.55)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-commun p-12 text-paper lg:flex lg:flex-col lg:justify-between">
          <div className="page-grid absolute inset-0 opacity-25" aria-hidden="true" />
          <div className="absolute -right-28 -top-20 h-96 w-96 rounded-full border-[80px] border-paper/10" aria-hidden="true" />
          <div className="relative text-paper">
            <Logo inverted />
          </div>
          <div className="relative max-w-md">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60">Espace éditorial</p>
            <h1 className="mt-5 font-serif text-[4.3rem] leading-[0.92] font-medium tracking-[-0.05em]">
              Garder le récit vivant.
            </h1>
            <p className="mt-7 text-[1.05rem] leading-[1.65] text-paper/75">
              Modifiez les pages, ajoutez des sources et maintenez chaque information à jour depuis une interface unique.
            </p>
          </div>
          <p className="relative font-mono text-[10.5px] uppercase tracking-[0.12em] text-paper/50">
            Espace éditorial · Backend connecté
          </p>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-14 inline-flex items-center gap-2 text-sm text-muted hover:text-ink lg:hidden">
              <ArrowLeft className="h-4 w-4" /> Retour au site
            </Link>
            <div className="eyebrow-pill font-mono text-[10.5px] uppercase tracking-[0.12em] text-commun">
              Espace personnel
            </div>
            <h2 className="mt-6 font-serif text-[3rem] leading-none font-medium tracking-[-0.04em]">
              {mode === 'login' ? 'Bienvenue.' : 'Créer un compte.'}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              {mode === 'login'
                ? 'Connectez-vous pour accéder à l’interface de gestion des contenus.'
                : 'Créez votre compte éditorial : le premier compte devient administrateur, les suivants éditeur.'}
            </p>

            <div className="mt-8 grid grid-cols-2 rounded-full bg-paper-deep p-1" role="tablist" aria-label="Accès au compte">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                onClick={() => {
                  setMode('login')
                  setRegistrationNotice('')
                }}
                className={`h-10 rounded-full text-sm font-medium transition ${mode === 'login' ? 'bg-paper text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                Connexion
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                onClick={() => {
                  setMode('register')
                  setError('')
                }}
                className={`h-10 rounded-full text-sm font-medium transition ${mode === 'register' ? 'bg-paper text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                Inscription
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={submit} className="mt-7 space-y-5" noValidate>
                <Field label="Adresse e-mail" hint="facultatif pour l’admin">
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value)
                      setError('')
                    }}
                    placeholder="vous@exemple.fr"
                    autoComplete="username"
                    className={inputClass}
                  />
                </Field>
                <Field label="Mot de passe">
                  <span className="relative block">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError('')
                      }}
                      placeholder="Votre mot de passe"
                      autoComplete="current-password"
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((v) => !v)}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted hover:text-ink"
                      aria-label={passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      <EyeIcon crossed={passwordVisible} />
                    </button>
                  </span>
                </Field>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-ink-soft">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 accent-commun"
                    />
                    Se souvenir de moi
                  </label>
                  <button
                    type="button"
                    onClick={() => setError('Pour réinitialiser le mot de passe, contactez l’hébergeur du site.')}
                    className="text-commun underline decoration-commun/30 underline-offset-4"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                {error && <p className="text-sm text-promesse" role="alert">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ink px-7 font-medium text-paper shadow-[0_15px_35px_-20px_rgba(27,26,23,0.75)] transition-all hover:-translate-y-0.5 hover:bg-commun disabled:cursor-wait disabled:opacity-60"
                >
                  {submitting ? 'Vérification…' : 'Connexion'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            ) : (
              <form onSubmit={register} className="mt-7 space-y-5" noValidate>
                <Field label="Nom complet">
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Prénom et nom" autoComplete="name" className={inputClass} />
                </Field>
                <Field label="Adresse email">
                  <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="nom@exemple.fr" autoComplete="email" className={inputClass} />
                </Field>
                <Field label="Mot de passe" hint="8 caractères minimum">
                  <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Choisissez un mot de passe" autoComplete="new-password" className={inputClass} />
                </Field>
                <Field label="Confirmer le mot de passe">
                  <input type="password" value={registerConfirmation} onChange={(e) => setRegisterConfirmation(e.target.value)} placeholder="Répétez le mot de passe" autoComplete="new-password" className={inputClass} />
                </Field>
                {registrationNotice && (
                  <p
                    className={`rounded-xl px-4 py-3 text-sm leading-snug ${registrationNotice.startsWith('Formulaire validé') ? 'bg-commun-soft text-commun' : 'bg-promesse-soft text-promesse'}`}
                    role="status"
                  >
                    {registrationNotice}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-commun px-7 font-medium text-paper shadow-[0_15px_35px_-20px_rgba(29,90,82,0.75)] transition-all hover:-translate-y-0.5 hover:bg-ink disabled:cursor-wait disabled:opacity-60"
                >
                  {submitting ? 'Création…' : 'Créer mon compte'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
            <p className="mt-8 text-center text-xs leading-relaxed text-muted">
              L’authentification est vérifiée par le serveur du site.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

const BLOCK_TYPES = ['Paragraphe', 'Titre de section', 'Citation', 'Encadré critique', 'Liste', 'Tableau', 'Chiffre clé', 'Source']

export function AdminPage() {
  useMeta('Administration', 'Interface de gestion éditoriale : données du site, modération du forum et messages de contact.')
  const navigate = useNavigate()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [token, setToken] = useState('')
  const [contacts, setContacts] = useState<ContactEntry[]>([])
  const [forum, setForum] = useState<ForumMessage[]>([])
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [bans, setBans] = useState<AdminBan[]>([])
  const [banForm, setBanForm] = useState({ ip: '', username: '', expires: 24, reason: '' })
  const [pagePath, setPagePath] = useState(CONTENT_PAGES[0]?.path ?? '')
  const currentPage = useMemo(() => CONTENT_PAGES.find((p) => p.path === pagePath), [pagePath])
  const [blockType, setBlockType] = useState('Paragraphe')
  const [title, setTitle] = useState('Un nouvel élément')
  const [content, setContent] = useState('Saisissez ici le contenu qui apparaîtra sur la page.')
  const [status, setStatus] = useState('Brouillon')
  const [notice, setNotice] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  function flash(text: string) {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 4000)
  }

  useEffect(() => {
    const tok = window.sessionStorage.getItem(TOKEN_KEY) ?? window.localStorage.getItem(TOKEN_KEY)
    if (!tok) {
      navigate('/connexion/', { replace: true })
      return
    }
    adminApi.data(tok).then((res) => {
      if (res.status === 401) {
        navigate('/connexion/', { replace: true })
        return
      }
      if (res.ok) {
        setToken(tok)
        setContacts(res.data.contacts ?? [])
        setForum(res.data.forum ?? [])
        setPhotos(res.data.photos ?? [])
        setBans(res.data.bans ?? [])
      } else {
        setNotice(res.data.error ?? 'Chargement des données impossible.')
      }
      setSessionChecked(true)
    })
  }, [navigate])

  async function removeItem(type: 'forum' | 'contact' | 'photo', id: string, label: string) {
    if (!window.confirm(`Supprimer « ${label} » du serveur ? Cette action est définitive.`)) return
    const res = await adminApi.remove(token, type, id)
    if (res.ok) {
      if (type === 'forum') setForum((prev) => prev.filter((m) => m.id !== id))
      else if (type === 'photo') setPhotos((prev) => prev.filter((p) => p.id !== id))
      else setContacts((prev) => prev.filter((c) => c.id !== id))
      setNotice('Élément supprimé du serveur.')
    } else {
      setNotice(res.data.error ?? 'Suppression impossible.')
    }
    window.setTimeout(() => setNotice(''), 3500)
  }

  function save(label: string) {
    flash(`${label} : les contenus des pages sont compilés dans le site ; le forum, le contact et la modération sont, eux, enregistrés en direct sur le serveur.`)
  }

  async function banIp(ip: string, username: string, expires: number, reason: string) {
    const res = await adminApi.ban(token, { ip, username, expires, reason })
    if (res.ok) {
      setBans(res.data.bans ?? [])
      setBanForm({ ip: '', username: '', expires: 24, reason: '' })
      flash(`Adresse ${ip} bannie.`)
    } else {
      flash(res.data.error ?? 'Bannissement impossible.')
    }
  }

  async function unbanIp(ip: string) {
    const res = await adminApi.unban(token, ip)
    if (res.ok) {
      setBans(res.data.bans ?? [])
      flash(`Bannissement de ${ip} levé.`)
    } else {
      flash(res.data.error ?? 'Levée du bannissement impossible.')
    }
  }

  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Vérification de la session…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper-deep/55">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-8">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-commun/20 bg-commun-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-commun sm:inline-flex">
              Backend connecté
            </span>
            <Link to="/" className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm text-ink-soft hover:border-ink/30 hover:text-ink">
              Voir le site <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] md:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-76px)] border-r border-ink/10 bg-paper/60 p-5 md:block">
          <p className="px-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Administration</p>
          <nav className="mt-5 space-y-1" aria-label="Administration">
            {[
              { label: 'Contenus', active: true },
              { label: 'Chronologie', active: false },
              { label: 'Glossaire', active: false },
              { label: 'Bibliographie', active: false },
              { label: 'Acteurs', active: false },
              { label: 'Paramètres', active: false },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.active) return
                  flash(`« ${item.label} » n'est pas encore géré ici : cette page gère les contenus, le forum, le contact et la galerie.`)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm ${item.active ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-paper-deep'}`}
              >
                {item.label}
                {item.active && <span className="h-1.5 w-1.5 rounded-full bg-commun-soft" />}
              </button>
            ))}
          </nav>
          <div className="mt-8 border-t border-rule pt-6">
            <Link
              to="/connexion/"
              onClick={() => {
                window.sessionStorage.removeItem(TOKEN_KEY)
                window.localStorage.removeItem(TOKEN_KEY)
              }}
              className="flex items-center gap-2 px-3 text-sm text-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" /> Se déconnecter
            </Link>
          </div>
        </aside>

        <main className="min-w-0 p-5 md:p-8 lg:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-commun">Gestion éditoriale</p>
              <h1 className="mt-2 font-serif text-[2.8rem] leading-none font-medium tracking-[-0.04em]">Ajouter un élément</h1>
              <p className="mt-3 text-sm text-muted">Créez un bloc et choisissez la page sur laquelle il doit apparaître.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                titleRef.current?.focus({ preventScroll: true })
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-commun px-5 text-sm font-medium text-paper shadow-sm"
            >
              <PlusIcon /> Nouvel élément
            </button>
          </div>

          {notice && (
            <div className="mt-6 flex items-center justify-between rounded-xl border border-commun/20 bg-commun-soft px-4 py-3 text-sm text-commun" role="status">
              <span className="flex items-center gap-2"><CheckIcon /> {notice}</span>
              <button type="button" onClick={() => setNotice('')} aria-label="Fermer"><CloseIcon className="h-4 w-4" /></button>
            </div>
          )}

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <form onSubmit={(e) => e.preventDefault()} className="modern-surface space-y-7 p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Page de destination" hint="Obligatoire">
                  <select value={pagePath} onChange={(e) => setPagePath(e.target.value)} className={inputClass}>
                    {CONTENT_PAGES.map((p) => <option key={p.path} value={p.path}>{p.navTitle}</option>)}
                  </select>
                </Field>
                <Field label="Type d’élément" hint="Obligatoire">
                  <select value={blockType} onChange={(e) => setBlockType(e.target.value)} className={inputClass}>
                    {BLOCK_TYPES.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Titre ou libellé">
                <input ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
              </Field>

              <Field label="Contenu" hint={`${content.length} caractères`}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={9}
                  className="w-full resize-y rounded-xl border border-ink/15 bg-paper px-4 py-3 text-[0.95rem] leading-relaxed text-ink outline-none transition focus:border-commun focus:ring-4 focus:ring-commun/10"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Statut éditorial">
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                    <option>Brouillon</option>
                    <option>À vérifier</option>
                    <option>Sourcé</option>
                    <option>À documenter</option>
                  </select>
                </Field>
                <Field label="Ancre stable" hint="URL">
                  <input placeholder="nouvel-element" className={inputClass} />
                </Field>
              </div>

              <Field label="Source">
                <input placeholder="Titre, auteur, date ou URL…" className={inputClass} />
              </Field>

              <div className="flex flex-col-reverse gap-3 border-t border-rule pt-6 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => save('Enregistrement du brouillon')} className="h-11 rounded-full border border-ink/15 px-5 text-sm font-medium text-ink hover:border-ink/30">
                  Enregistrer le brouillon
                </button>
                <button type="button" onClick={() => save('Publication')} className="h-11 rounded-full bg-ink px-6 text-sm font-medium text-paper shadow-sm hover:bg-commun">
                  Publier l’élément
                </button>
              </div>
            </form>

            <aside className="self-start xl:sticky xl:top-28">
              <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Aperçu en direct</p>
              <div className="overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper shadow-[0_24px_60px_-38px_rgba(27,26,23,0.55)]">
                <div className="border-b border-rule px-5 py-3">
                  <p className="truncate text-xs text-muted">{currentPage?.title ?? 'Page'}</p>
                </div>
                <div className="p-6">
                  <span className="inline-flex rounded-full bg-commun-soft px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-commun">{status}</span>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{blockType}</p>
                  <h2 className="mt-2 font-serif text-[2rem] leading-tight font-medium tracking-[-0.02em]">{title || 'Sans titre'}</h2>
                  <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-[1.65] text-ink-soft">{content || 'Votre contenu apparaîtra ici.'}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Cet aperçu est local. Les contenus des pages sont compilés dans le site ; les données vivantes (forum, contact) sont gérées ci-dessous.
              </p>
            </aside>
          </div>

          <section className="mt-10" aria-labelledby="donnees-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-commun">Serveur</p>
                <h2 id="donnees-site" className="mt-2 font-serif text-[2rem] leading-tight font-medium tracking-[-0.03em]">Données reçues du site</h2>
                <p className="mt-2 text-sm text-muted">Messages de contact, contributions du forum et photos de rosalies, enregistrés sur le serveur. La suppression est définitive.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="modern-surface p-6">
                <h3 className="flex items-center justify-between text-lg font-semibold">
                  Messages de contact
                  <span className="rounded-full bg-commun-soft px-2.5 py-0.5 font-mono text-[10.5px] text-commun">{contacts.length}</span>
                </h3>
                {contacts.length ? (
                  <ul className="mt-5 space-y-4">
                    {contacts.map((c) => (
                      <li key={c.id} className="rounded-xl border border-rule bg-paper p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-ink">{c.name} <span className="font-normal text-muted">· {c.email}</span></p>
                          <button type="button" onClick={() => removeItem('contact', c.id, `le message de ${c.name}`)} className="rounded-md border border-ink/10 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-promesse/40 hover:bg-promesse-soft hover:text-ink">Supprimer</button>
                        </div>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                          {c.category ? `${c.category} · ` : ''}{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(c.createdAt))}
                        </p>
                        {c.subject && <p className="mt-2 text-sm font-medium">{c.subject}</p>}
                        <p className="mt-1 whitespace-pre-line text-[0.95rem] leading-[1.6] text-ink-soft">{c.message}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted">Aucun message de contact pour le moment.</p>
                )}
              </div>

              <div className="modern-surface p-6">
                <h3 className="flex items-center justify-between text-lg font-semibold">
                  Forum
                  <span className="rounded-full bg-commun-soft px-2.5 py-0.5 font-mono text-[10.5px] text-commun">{forum.length}</span>
                </h3>
                {forum.length ? (
                  <ul className="mt-5 space-y-4">
                    {[...forum].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).map((m) => (
                      <li key={m.id} className="rounded-xl border border-rule bg-paper p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-ink">{m.author} <span className="font-normal text-muted">· {m.title}</span></p>
                          <button type="button" onClick={() => removeItem('forum', m.id, m.title)} className="rounded-md border border-ink/10 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-promesse/40 hover:bg-promesse-soft hover:text-ink">Supprimer</button>
                        </div>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                          {m.topic} · {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(m.createdAt))}
                        </p>
                        <p className="mt-1 whitespace-pre-line text-[0.95rem] leading-[1.6] text-ink-soft">{m.content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted">Aucun message sur le forum pour le moment.</p>
                )}
              </div>
            </div>

            <div className="modern-surface mt-6 p-6">
              <h3 className="flex items-center justify-between text-lg font-semibold">
                Photos de rosalies
                <span className="rounded-full bg-commun-soft px-2.5 py-0.5 font-mono text-[10.5px] text-commun">{photos.length}</span>
              </h3>
              {photos.length ? (
                <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {photos.map((p) => (
                    <li key={p.id} className="overflow-hidden rounded-xl border border-rule bg-paper">
                      <img src={p.src} alt={p.caption || `Rosalie à ${p.place}`} className="aspect-[4/3] w-full object-cover" />
                      <div className="p-3">
                        <p className="text-sm font-medium">{p.place}</p>
                        <p className="mt-0.5 truncate text-xs text-muted">{p.caption || `Par ${p.author}`}</p>
                        <button
                          type="button"
                          onClick={() => removeItem('photo', p.id, `la photo ${p.caption || p.place}`)}
                          className="mt-2 w-full rounded-md border border-ink/10 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-promesse/40 hover:bg-promesse-soft hover:text-ink"
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">Aucune photo dans la galerie pour le moment.</p>
              )}
            </div>

            <div className="modern-surface mt-6 p-6">
              <h3 className="flex items-center justify-between text-lg font-semibold">
                Modération — bannissement
                <span className="rounded-full bg-promesse-soft px-2.5 py-0.5 font-mono text-[10.5px] text-promesse">{bans.length}</span>
              </h3>
              <p className="mt-2 text-sm text-muted">
                Une adresse bannie ne peut plus publier sur le forum, le formulaire de contact ni la galerie. Le bannissement est permanent par défaut, ou limité à la durée choisie.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_10rem_auto]">
                <Field label="Adresse IP" hint="obligatoire">
                  <input
                    value={banForm.ip}
                    onChange={(e) => setBanForm((f) => ({ ...f, ip: e.target.value }))}
                    placeholder="203.0.113.10"
                    className={inputClass}
                  />
                </Field>
                <Field label="Pseudonyme" hint="facultatif">
                  <input
                    value={banForm.username}
                    onChange={(e) => setBanForm((f) => ({ ...f, username: e.target.value }))}
                    placeholder="Nom affiché"
                    className={inputClass}
                  />
                </Field>
                <Field label="Durée">
                  <select
                    value={banForm.expires}
                    onChange={(e) => setBanForm((f) => ({ ...f, expires: Number(e.target.value) }))}
                    className={inputClass}
                  >
                    <option value={0}>Permanent</option>
                    <option value={1}>1 heure</option>
                    <option value={24}>24 heures</option>
                    <option value={168}>7 jours</option>
                    <option value={720}>30 jours</option>
                  </select>
                </Field>
                <div className="flex items-end">
                  <button
                    type="button"
                    disabled={!banForm.ip.trim()}
                    onClick={() => banIp(banForm.ip.trim(), banForm.username.trim(), banForm.expires, banForm.reason.trim())}
                    className="h-12 w-full rounded-xl bg-promesse px-5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Bannir
                  </button>
                </div>
              </div>

              <Field label="Motif du bannissement" hint="affiché au visiteur">
                <input
                  value={banForm.reason}
                  onChange={(e) => setBanForm((f) => ({ ...f, reason: e.target.value }))}
                  placeholder="Messages malveillants, harcelement, spam…"
                  className={inputClass}
                />
              </Field>

              {bans.length ? (
                <ul className="mt-5 space-y-2">
                  {bans.map((b) => (
                    <li key={b.ip} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rule bg-paper px-4 py-3">
                      <div>
                        <p className="font-mono text-sm text-ink">{b.ip}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {b.username ? `${b.username} · ` : ''}
                          {b.expires ? `expire dans ${b.expires} h` : 'permanent'}
                          {b.reason ? ` · ${b.reason}` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => unbanIp(b.ip)}
                        className="rounded-md border border-ink/10 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-commun/40 hover:bg-commun-soft hover:text-ink"
                      >
                        Débannir
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">Aucune adresse bannie pour le moment.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
