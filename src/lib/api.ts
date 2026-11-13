/** Client de l'API du site (PHP sur le NAS). Appels same-origin vers /api/. */

export type ForumMessage = {
  id: string
  topic: string
  author: string
  title: string
  content: string
  createdAt: string
}

export type ContactEntry = {
  id: string
  name: string
  email: string
  subject?: string
  category?: string
  message: string
  createdAt: string
}

export type GalleryPhoto = {
  id: string
  src: string
  place: string
  caption: string
  author: string
  createdAt: string
}

export type ApiResult<T = unknown> = {
  ok: boolean
  status: number
  data: T & { ok?: boolean; error?: string }
}

export type AdminBan = {
  ip: string
  username?: string
  expires?: number
  reason?: string
  created?: string
}

async function call<T = Record<string, unknown>>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    })
    const data = (await res.json().catch(() => ({}))) as ApiResult<T>['data']
    return { ok: res.ok, status: res.status, data }
  } catch {
    // Réseau indisponible : l'appelant applique son repli local.
    return { ok: false, status: 0, data: { error: 'Réseau indisponible.' } as ApiResult<T>['data'] }
  }
}

export const forumApi = {
  list: async (): Promise<ForumMessage[] | null> => {
    const r = await call<{ messages: ForumMessage[] }>('/api/forum.php')
    return r.ok && Array.isArray(r.data.messages) ? r.data.messages : null
  },
  create: (message: Omit<ForumMessage, 'id' | 'createdAt'>) =>
    call<{ message: ForumMessage }>('/api/forum.php', { method: 'POST', body: JSON.stringify(message) }),
}

export const contactApi = {
  send: (payload: { name: string; email: string; subject: string; category: string; message: string; website?: string }) =>
    call('/api/contact.php', { method: 'POST', body: JSON.stringify(payload) }),
}

export const photoApi = {
  list: async (): Promise<GalleryPhoto[] | null> => {
    const r = await call<{ photos: GalleryPhoto[] }>('/api/photos.php')
    return r.ok && Array.isArray(r.data.photos) ? r.data.photos : null
  },
  create: (payload: { src: string; place: string; caption: string; author: string }) =>
    call<{ photo: GalleryPhoto }>('/api/photos.php', { method: 'POST', body: JSON.stringify(payload) }),
}

export const adminApi = {
  login: (password: string) => call<{ token: string; expiresAt: string }>('/api/login.php', { method: 'POST', body: JSON.stringify({ password }) }),
  data: (token: string) =>
    call<{ contacts: ContactEntry[]; forum: ForumMessage[]; photos: GalleryPhoto[]; bans: AdminBan[] }>('/api/admin.php', { headers: { Authorization: `Bearer ${token}` } }),
  remove: (token: string, type: 'forum' | 'contact' | 'photo', id: string) =>
    call('/api/admin.php', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'delete', type, id }),
    }),
  /** Bannissement d'une IP (modération renforcée). */
  ban: (token: string, payload: { ip: string; username?: string; expires?: number; reason?: string }) =>
    call('/api/admin.php', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'ban', ...payload }),
    }),
  /** Levée d'un bannissement. */
  unban: (token: string, ip: string) =>
    call('/api/admin.php', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'unban', ip }),
    }),
  /** Liste des bannissements en cours. */
  bans: (token: string) =>
    call<{ bans: AdminBan[] }>('/api/admin.php', { headers: { Authorization: `Bearer ${token}` } }),
}

/** Connexion + suppression d'un contenu (modération par mot de passe admin). */
export async function moderateDelete(type: 'forum' | 'photo', id: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const login = await adminApi.login(password)
  if (!login.ok || !login.data.token) return { ok: false, error: login.data.error ?? 'Mot de passe incorrect.' }
  const del = await adminApi.remove(login.data.token, type, id)
  return { ok: del.ok, error: del.data.error }
}
