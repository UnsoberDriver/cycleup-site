import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CheckIcon, CloseIcon } from './Icons'
import { deleteOwnGalleryPhoto, isAdminSession, moderateDelete, photoApi } from '../lib/api'

type Photo = {
  id: string
  src: string
  place: string
  caption: string
  author: string
  createdAt: string
}

const STORAGE_KEY = 'mobilites-forum-photos'
/** IDs des photos publiées depuis ce navigateur : l'auteur peut les supprimer. */
const OWN_KEY = 'mobilites-gallery-own'

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
    // Stockage indisponible.
  }
}
const PLACES = ['Tarbes', 'Pau', 'Toulouse', 'Lourdes', 'Autre lieu']
const MAX_SIDE = 1200
const MAX_FILE_MB = 10

const inputClass =
  'h-11 w-full rounded-lg border border-ink/15 bg-paper px-3.5 text-[0.95rem] text-ink outline-none transition focus:border-commun focus:ring-4 focus:ring-commun/10'

/** Downscales the picture so many photos fit in browser storage. */
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image'))
    }
    img.src = url
  })
}

export function RosalieGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [place, setPlace] = useState(PLACES[0])
  const [caption, setCaption] = useState('')
  const [author, setAuthor] = useState('')
  const [filter, setFilter] = useState('Tous')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<{ tone: 'error' | 'success'; text: string } | null>(null)
  const [opened, setOpened] = useState<Photo | null>(null)
  /** Photos publiées depuis ce navigateur (suppression sans mot de passe). */
  const [ownIds, setOwnIds] = useState<string[]>([])
  /** Session d'administration active : permet de modérer toutes les photos. */
  const [isAdmin, setIsAdmin] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Chargement des photos du serveur ; repli sur le navigateur si l'API est injoignable.
  useEffect(() => {
    let alive = true
    setOwnIds(readOwnIds())
    setIsAdmin(isAdminSession())
    photoApi.list().then((remote) => {
      if (!alive) return
      if (remote) {
        if (remote.length) setPhotos(remote)
      } else {
        try {
          const saved = window.localStorage.getItem(STORAGE_KEY)
          if (saved) setPhotos(JSON.parse(saved) as Photo[])
        } catch {
          // Ignore unreadable storage.
        }
      }
    })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!opened) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpened(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [opened])

  async function onFile(file?: File) {
    setNotice(null)
    if (!file) return setPreview(null)
    if (!file.type.startsWith('image/')) {
      setNotice({ tone: 'error', text: 'Le fichier doit être une image (JPG, PNG, WebP…).' })
      return
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setNotice({ tone: 'error', text: `L’image ne doit pas dépasser ${MAX_FILE_MB} Mo.` })
      return
    }
    setBusy(true)
    try {
      setPreview(await resizeImage(file))
    } catch {
      setNotice({ tone: 'error', text: 'Impossible de lire cette image.' })
    } finally {
      setBusy(false)
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!preview) {
      setNotice({ tone: 'error', text: 'Choisissez une photo de rosalie à partager.' })
      return
    }
    setBusy(true)
    const res = await photoApi.create({
      src: preview,
      place,
      caption: caption.trim(),
      author: author.trim() || 'Anonyme',
    })
    setBusy(false)
    if (res.ok && res.data.photo) {
      setPhotos((prev) => [res.data.photo!, ...prev])
      rememberOwnId(res.data.photo.id)
      setOwnIds((prev) => (prev.includes(res.data.photo!.id) ? prev : [...prev, res.data.photo!.id]))
      setPreview(null)
      setCaption('')
      if (fileRef.current) fileRef.current.value = ''
      setNotice({ tone: 'success', text: 'Votre photo a été ajoutée à la galerie.' })
      return
    }
    if (res.status === 0) {
      // Serveur injoignable : enregistrement local pour ne pas perdre la photo.
      const photo: Photo = {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
        src: preview,
        place,
        caption: caption.trim(),
        author: author.trim() || 'Anonyme',
        createdAt: new Date().toISOString(),
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([photo, ...photos]))
        setPhotos([photo, ...photos])
      } catch {
        setNotice({ tone: 'error', text: 'L’espace de stockage du navigateur est plein. Supprimez une photo puis réessayez.' })
        return
      }
      setPreview(null)
      setCaption('')
      if (fileRef.current) fileRef.current.value = ''
      setNotice({ tone: 'success', text: 'Serveur momentanément injoignable : votre photo n’est visible que sur cet appareil.' })
      return
    }
    setNotice({ tone: 'error', text: res.data.error ?? 'Envoi impossible, réessaie dans un instant.' })
  }

  async function remove(photo: Photo) {
    if (!window.confirm('Supprimer cette photo ? Cette action est définitive.')) return
    const isOwner = ownIds.includes(photo.id)
    // L'auteur supprime sans mot de passe ; l'administration demande le mot de passe.
    const password = isOwner ? '' : window.prompt('Modération : saisissez le mot de passe d’administration.')
    if (!isOwner && !password) return
    const res = isOwner
      ? await deleteOwnGalleryPhoto(photo.id)
      : await moderateDelete('photo', photo.id, password)
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
      setOwnIds((prev) => prev.filter((id) => id !== photo.id))
      setOpened(null)
      setNotice({ tone: 'success', text: 'La photo a été supprimée du serveur.' })
    } else {
      setNotice({ tone: 'error', text: res.error ?? 'Suppression impossible.' })
    }
  }

  const visible = filter === 'Tous' ? photos : photos.filter((p) => p.place === filter)

  return (
    <section className="mx-auto mt-16 max-w-[1400px] px-5 md:px-8" aria-labelledby="galerie-rosalies">
      <div className="flex flex-col gap-4 border-b-2 border-ink pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-commun">Galerie</p>
          <h2 id="galerie-rosalies" className="mt-2 text-[2.2rem] font-semibold leading-none tracking-[-0.04em]">
            Photos de rosalies
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par lieu">
          {['Tous', ...PLACES].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setFilter(p)}
              aria-pressed={filter === p}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === p ? 'border-ink bg-ink text-paper' : 'border-ink/15 text-ink-soft hover:border-ink/35'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div>
          {visible.length ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {visible.map((photo) => (
                <li key={photo.id}>
                  <button
                    type="button"
                    onClick={() => setOpened(photo)}
                    className="group block w-full overflow-hidden rounded-xl border border-ink/10 bg-paper-deep text-left"
                  >
                    <img src={photo.src} alt={photo.caption || `Rosalie à ${photo.place}`} className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <span className="block p-3">
                      <span className="block text-sm font-medium">{photo.place}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{photo.caption || `Par ${photo.author}`}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-ink/20 p-10 text-center">
              <p className="font-medium">Aucune photo pour le moment.</p>
              <p className="mt-2 text-sm text-muted">Partagez la première photo de rosalie{filter !== 'Tous' ? ` à ${filter}` : ''}.</p>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="modern-surface self-start p-6" noValidate>
          <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-commun">Nouvelle photo</p>
          <h3 className="mt-2 text-xl font-semibold">Partager une rosalie</h3>

          <label
            className={`mt-5 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed text-center transition-colors ${
              preview ? 'border-transparent' : 'border-ink/25 bg-paper hover:border-ink/50'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              void onFile(e.dataTransfer.files[0])
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
            {preview ? (
              <img src={preview} alt="Aperçu de la photo" className="h-full w-full object-cover" />
            ) : (
              <span className="px-6">
                <span className="block text-sm font-medium">{busy ? 'Préparation de l’image…' : 'Cliquez ou déposez une image'}</span>
                <span className="mt-1 block text-xs text-muted">JPG, PNG ou WebP · {MAX_FILE_MB} Mo maximum</span>
              </span>
            )}
          </label>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Lieu</span>
              <select value={place} onChange={(e) => setPlace(e.target.value)} className={`${inputClass} mt-2`}>
                {PLACES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Légende <span className="font-normal text-muted">(facultatif)</span></span>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={120} placeholder="Ex. Balade au bord du gave" className={`${inputClass} mt-2`} />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Votre nom <span className="font-normal text-muted">(facultatif)</span></span>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={50} placeholder="Anonyme" className={`${inputClass} mt-2`} />
            </label>
          </div>

          {notice && (
            <p
              role={notice.tone === 'error' ? 'alert' : 'status'}
              className={`mt-5 flex items-start gap-2 rounded-lg px-4 py-3 text-sm leading-snug ${notice.tone === 'success' ? 'bg-commun-soft text-ink' : 'bg-promesse-soft text-ink'}`}
            >
              {notice.tone === 'success' && <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />}
              {notice.text}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 h-12 w-full rounded-lg bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-commun disabled:opacity-60"
          >
            Ajouter la photo
          </button>
          <p className="mt-4 text-xs leading-relaxed text-muted">Les photos sont publiées sur le serveur du site et visibles par toutes et tous. Aucun compte n’est nécessaire.</p>
        </form>
      </div>

      {opened && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo de rosalie à ${opened.place}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpened(null)}
        >
          <figure className="relative max-h-full w-full max-w-4xl overflow-hidden rounded-xl bg-paper">
            <button
              type="button"
              onClick={() => setOpened(null)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-paper/90 text-ink"
              aria-label="Fermer"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <img src={opened.src} alt={opened.caption || `Rosalie à ${opened.place}`} className="max-h-[70vh] w-full bg-ink object-contain" />
            <figcaption className="flex flex-wrap items-center justify-between gap-3 p-4">
              <span>
                <span className="block font-medium">{opened.place}{opened.caption ? ` — ${opened.caption}` : ''}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  Par {opened.author} · {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(opened.createdAt))}
                </span>
              </span>
              {(isAdmin || ownIds.includes(opened.id)) && (
                <button
                  type="button"
                  onClick={() => remove(opened)}
                  className="rounded-md border border-ink/10 px-3 py-1.5 text-xs font-medium text-muted hover:bg-promesse-soft hover:text-ink"
                >
                  Supprimer
                </button>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}
