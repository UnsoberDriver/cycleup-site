import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { CheckIcon } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { RosalieGallery } from '../components/RosalieGallery'
import { deleteOwnForumMessage, forumApi, isAdminSession, moderateDelete } from '../lib/api'
import { useMeta } from '../lib/useMeta'

type Topic = {
  id: string
  label: string
  description: string
}

type ForumMessage = {
  id: string
  topic: string
  author: string
  title: string
  content: string
  createdAt: string
}

const TOPICS: Topic[] = [
  { id: 'general', label: 'Général', description: 'Échanger autour des mobilités et du site.' },
  { id: 'projets', label: 'Projets', description: 'Discuter des projets documentés et proposer des retours.' },
  { id: 'rosalies', label: 'Rosalies', description: 'Partager des usages, lieux et expériences de rosalies.' },
  { id: 'idees', label: 'Idées', description: 'Proposer une amélioration, un service ou une expérimentation.' },
  { id: 'questions', label: 'Questions', description: 'Demander de l’aide ou une précision à la communauté.' },
]

const INITIAL_MESSAGES: ForumMessage[] = [
  {
    id: 'welcome-1',
    topic: 'general',
    author: 'Équipe éditoriale',
    title: 'Bienvenue sur le forum',
    content: 'Cet espace est ouvert à toutes et tous. Vous pouvez participer sans créer de compte.',
    createdAt: '2026-11-10T09:00:00.000Z',
  },
  {
    id: 'welcome-2',
    topic: 'rosalies',
    author: 'Camille',
    title: 'Quels usages pour une rosalie au quotidien ?',
    content: 'Je serais intéressée par des retours sur les usages en centre-ville et dans les parcs.',
    createdAt: '2026-11-10T10:30:00.000Z',
  },
]

const STORAGE_KEY = 'mobilites-forum-messages'
/** IDs des messages publiés depuis ce navigateur : l'auteur peut les supprimer. */
const OWN_KEY = 'mobilites-forum-own'

function readOwnIds(): string[] {
  try {
    const raw = window.localStorage.getItem(OWN_KEY)
    const list = raw ? (JSON.parse(raw) as string[]) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function rememberOwnId(id: string) {
  try {
    const list = readOwnIds()
    if (!list.includes(id)) {
      window.localStorage.setItem(OWN_KEY, JSON.stringify([...list, id].slice(-200)))
    }
  } catch {
    // Stockage indisponible : la suppression par l'auteur ne sera pas proposée.
  }
}

const FAQ = [
  {
    question: 'Faut-il créer un compte pour participer ?',
    answer: 'Non. Le forum est ouvert et vous pouvez publier un message sans vous connecter. Le champ du nom est facultatif : s’il reste vide, le message est signé « Anonyme ».',
  },
  {
    question: 'Comment choisir le bon topic ?',
    answer: 'Utilisez Général pour les échanges transversaux, Projets pour commenter les cas documentés, Rosalies pour partager une implantation ou un usage, Idées pour proposer une initiative et Questions pour demander une précision.',
  },
  {
    question: 'Où sont conservés les messages ?',
    answer: 'Les messages sont publiés sur le serveur du site et partagés entre toutes les personnes qui le visitent. Ils sont conservés durablement.',
  },
  {
    question: 'Comment proposer une nouvelle localisation de rosalie ?',
    answer: 'Publiez les informations dans le topic « Rosalies » en indiquant le nom du lieu, la ville et, si possible, les coordonnées. Vous pouvez aussi utiliser le formulaire de contact.',
  },
  {
    question: 'Comment partager une photo de rosalie ?',
    answer: 'Utilisez la galerie « Photos de rosalies » : choisissez une image, indiquez le lieu et ajoutez une légende si vous le souhaitez. L’image est redimensionnée automatiquement.',
  },
  {
    question: 'Puis-je corriger ou supprimer un message ?',
    answer: 'La correction se demande à l’équipe éditoriale via la page Contact. En cas de besoin, la modération peut retirer un message du serveur.',
  },
  {
    question: 'Comment signaler un contenu inapproprié ?',
    answer: 'Utilisez la page Contact en précisant le topic, le titre du message et la raison du signalement.',
  },
]

const inputClass =
  'h-12 w-full rounded-lg border border-ink/15 bg-paper px-4 text-[0.95rem] text-ink outline-none transition focus:border-commun focus:ring-4 focus:ring-commun/10'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ForumPage() {
  useMeta('Forum', 'Forum ouvert consacré aux projets, aux rosalies et aux mobilités.')
  const [activeTopic, setActiveTopic] = useState('general')
  const [messages, setMessages] = useState<ForumMessage[]>(INITIAL_MESSAGES)
  /** Messages publiés depuis ce navigateur (suppression sans mot de passe). */
  const [ownIds, setOwnIds] = useState<string[]>([])
  /** Session d'administration active : permet de modérer tous les messages. */
  const [isAdmin, setIsAdmin] = useState(false)
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [notice, setNotice] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)

  // Chargement des messages du serveur ; repli sur le navigateur si l'API est injoignable.
  useEffect(() => {
    let alive = true
    setOwnIds(readOwnIds())
    setIsAdmin(isAdminSession())
    forumApi.list().then((remote) => {
      if (!alive) return
      if (remote) {
        if (remote.length) setMessages(remote)
      } else {
        try {
          const saved = window.localStorage.getItem(STORAGE_KEY)
          if (saved) setMessages(JSON.parse(saved) as ForumMessage[])
        } catch {
          // Keep the initial messages when local storage is unavailable or invalid.
        }
      }
    })
    return () => {
      alive = false
    }
  }, [])

  const visibleMessages = useMemo(
    () =>
      messages
        .filter((message) => message.topic === activeTopic)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [activeTopic, messages],
  )

  const active = TOPICS.find((topic) => topic.id === activeTopic) ?? TOPICS[0]

  async function publish(e: FormEvent) {
    e.preventDefault()
    const cleaned = content.trim()
    if (!cleaned) {
      setNotice({ tone: 'error', text: 'Écrivez un message avant de le publier.' })
      return
    }
    if (cleaned.length < 10) {
      setNotice({ tone: 'error', text: 'Votre message doit contenir au moins 10 caractères.' })
      return
    }

    const payload = {
      topic: activeTopic,
      author: author.trim() || 'Anonyme',
      title: title.trim() || 'Sans titre',
      content: cleaned,
    }
    const res = await forumApi.create(payload)
    const created = res.ok ? res.data.message : undefined
    if (created) {
      setMessages((prev) => [...prev, created])
      rememberOwnId(created.id)
      setOwnIds((prev) => (prev.includes(created.id) ? prev : [...prev, created.id]))
      setTitle('')
      setContent('')
      setNotice({ tone: 'success', text: 'Votre message a été publié.' })
      return
    }
    if (res.status === 0) {
      // Serveur injoignable : publication locale pour ne pas perdre le message.
      const next: ForumMessage = {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      }
      const updated = [...messages, next]
      setMessages(updated)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // Ignore storage failures in fallback mode.
      }
      setNotice({ tone: 'success', text: 'Serveur momentanément injoignable : votre message n’est visible que sur cet appareil.' })
      return
    }
    setNotice({ tone: 'error', text: res.data.error ?? 'Publication impossible, réessaie dans un instant.' })
  }

  async function deleteMessage(message: ForumMessage) {
    const confirmed = window.confirm(`Supprimer le message « ${message.title} » ? Cette action est définitive.`)
    if (!confirmed) return
    const isOwner = ownIds.includes(message.id)
    // L'auteur supprime sans mot de passe ; l'administration demande le mot de passe.
    const password = isOwner ? '' : window.prompt('Modération : saisissez le mot de passe d’administration.')
    if (!isOwner && !password) return
    const res = isOwner
      ? await deleteOwnForumMessage(message.id)
      : await moderateDelete('forum', message.id, password)
    if (res.ok) {
      setMessages((prev) => prev.filter((item) => item.id !== message.id))
      setOwnIds((prev) => prev.filter((id) => id !== message.id))
      setNotice({ tone: 'success', text: 'Le message a été supprimé du serveur.' })
    } else {
      setNotice({ tone: 'error', text: res.error ?? 'Suppression impossible.' })
    }
  }

  return (
    <div>
      <PageHeader
        crumbs={[{ label: 'Forum' }]}
        kicker="Forum ouvert"
        title="Discuter sans compte"
        question="Une question, une idée ou une expérience à partager ?"
      >
        <p className="mt-7 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
          Choisissez un topic et publiez directement. Aucun compte ni identifiant n’est demandé.
        </p>
      </PageHeader>

      <div className="mx-auto mt-9 grid max-w-[1400px] gap-6 px-5 md:px-8 lg:grid-cols-[280px_minmax(0,1fr)_390px]">
        <aside className="self-start lg:sticky lg:top-28">
          <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted">Topics</p>
          <nav className="mt-4 space-y-2" aria-label="Topics du forum">
            {TOPICS.map((topic) => {
              const count = messages.filter((message) => message.topic === topic.id).length
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setActiveTopic(topic.id)
                    setNotice(null)
                  }}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    activeTopic === topic.id
                      ? 'border-ink bg-ink text-paper'
                      : 'border-ink/10 bg-paper-deep text-ink hover:border-ink/30'
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium">{topic.label}</span>
                    <span className={`flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] ${
                      activeTopic === topic.id ? 'bg-commun-soft text-ink' : 'bg-paper text-muted'
                    }`}>
                      {count}
                    </span>
                  </span>
                  <span className={`mt-1.5 block text-xs leading-snug ${
                    activeTopic === topic.id ? 'text-paper/60' : 'text-muted'
                  }`}>
                    {topic.description}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0" aria-labelledby="messages-topic">
          <div className="flex items-end justify-between gap-5 border-b-2 border-ink pb-4">
            <div>
              <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted">Topic</p>
              <h2 id="messages-topic" className="mt-1 text-2xl font-semibold">{active.label}</h2>
            </div>
            <span className="text-sm text-muted">{visibleMessages.length} message{visibleMessages.length > 1 ? 's' : ''}</span>
          </div>

          {visibleMessages.length ? (
            <ol className="mt-4 space-y-3">
              {visibleMessages.map((message) => (
                <li
                  key={message.id}
                  className={
                    message.banned
                      ? 'rounded-xl border border-promesse/50 bg-promesse-soft/40 p-5 md:p-6'
                      : 'modern-surface p-5 md:p-6'
                  }
                >
                  {message.banned && (
                    <p className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-promesse px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-paper">
                      Message banni par la modération
                      {message.bannedReason ? <span className="normal-case tracking-normal opacity-90">· {message.bannedReason}</span> : null}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                          message.banned ? 'bg-promesse text-paper' : 'bg-commun-soft text-ink'
                        }`}
                      >
                        {message.author.slice(0, 1).toUpperCase()}
                      </span>
                      <span>
                        <span className={`block text-sm font-medium ${message.banned ? 'text-promesse' : ''}`}>{message.author}</span>
                        <time dateTime={message.createdAt} className="mt-0.5 block text-[11px] text-muted">
                          {formatDate(message.createdAt)}
                        </time>
                      </span>
                    </span>
                    {(isAdmin || ownIds.includes(message.id)) && (
                      <button
                        type="button"
                        onClick={() => deleteMessage(message)}
                        className="rounded-md border border-ink/10 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-promesse/40 hover:bg-promesse-soft hover:text-ink"
                        aria-label={`Supprimer le message ${message.title}`}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <h3 className={`mt-5 text-lg font-semibold ${message.banned ? 'text-promesse line-through decoration-promesse/40' : ''}`}>
                    {message.title}
                  </h3>
                  <p className={`mt-2 whitespace-pre-line text-[0.95rem] leading-[1.7] ${message.banned ? 'text-promesse' : 'text-ink-soft'}`}>
                    {message.content}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-ink/20 p-10 text-center">
              <p className="font-medium">Aucun message dans ce topic.</p>
              <p className="mt-2 text-sm text-muted">Soyez la première personne à lancer la discussion.</p>
            </div>
          )}
        </section>

        <aside className="self-start lg:sticky lg:top-28">
          <form onSubmit={publish} className="modern-surface p-6" noValidate>
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-commun">Nouveau message</p>
            <h2 className="mt-2 text-xl font-semibold">Publier dans « {active.label} »</h2>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium">Votre nom <span className="font-normal text-muted">(facultatif)</span></span>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Anonyme"
                  maxLength={50}
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Titre <span className="font-normal text-muted">(facultatif)</span></span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sujet du message"
                  maxLength={100}
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className="block">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium">Message</span>
                  <span className="text-[10px] text-muted">{content.length}/1 000</span>
                </span>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value.slice(0, 1000))
                    setNotice(null)
                  }}
                  rows={7}
                  placeholder="Écrivez votre message…"
                  className="mt-2 w-full resize-y rounded-lg border border-ink/15 bg-paper px-4 py-3 text-[0.95rem] leading-relaxed text-ink outline-none transition focus:border-commun focus:ring-4 focus:ring-commun/10"
                />
              </label>
            </div>

            {notice && (
              <p
                role={notice.tone === 'error' ? 'alert' : 'status'}
                className={`mt-5 flex items-start gap-2 rounded-lg px-4 py-3 text-sm leading-snug ${
                  notice.tone === 'success' ? 'bg-commun-soft text-ink' : 'bg-promesse-soft text-ink'
                }`}
              >
                {notice.tone === 'success' && <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />}
                {notice.text}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 h-12 w-full rounded-lg bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-commun"
            >
              Publier le message
            </button>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Les messages sont publiés sur le serveur du site et visibles par toutes et tous. Aucun compte n’est nécessaire.
            </p>
          </form>
        </aside>
      </div>

      <RosalieGallery />

      <section className="mx-auto mt-16 max-w-[1000px] px-5 md:px-8" aria-labelledby="faq-forum">
        <div className="grid gap-8 md:grid-cols-[260px_minmax(0,1fr)] md:gap-14">
          <div>
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-commun">Aide</p>
            <h2 id="faq-forum" className="mt-3 text-[2.4rem] font-semibold leading-none tracking-[-0.04em]">Questions fréquentes</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Vous ne trouvez pas votre réponse ?
            </p>
            <Link to="/contact/" className="mt-3 inline-flex text-sm font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
              Écrire à l’équipe
            </Link>
          </div>
          <div className="divide-y divide-rule border-y border-rule">
            {FAQ.map((item, index) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-left">
                  <span className="flex items-start gap-4">
                    <span className="mt-0.5 font-mono text-[10.5px] text-muted">{String(index + 1).padStart(2, '0')}</span>
                    <span className="font-medium text-ink">{item.question}</span>
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-paper-deep text-lg text-ink transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-6 pl-10 pr-10 text-[0.95rem] leading-[1.7] text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
