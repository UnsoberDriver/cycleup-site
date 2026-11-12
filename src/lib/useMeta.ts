import { useEffect } from 'react'
import { SITE } from '../content/site'

export function useMeta(title: string | undefined, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE.name}` : SITE.seoTitle
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description ?? SITE.description
  }, [title, description])
}
