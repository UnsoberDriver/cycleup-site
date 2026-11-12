import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'

/** French typography: non-breaking spaces before high punctuation and inside guillemets. */
export function typo(text: string) {
  return text
    .replace(/ ([;:!?»])/g, '\u00a0$1')
    .replace(/« /g, '«\u00a0')
}

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g

/** Renders a minimal markup: **bold**, *italic*, [label](href), `code`. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean)
  return (
    <>
      {parts.map((part, i) => {
        let node: ReactNode
        if (part.startsWith('**')) {
          node = <strong className="font-semibold text-ink">{typo(part.slice(2, -2))}</strong>
        } else if (part.startsWith('[')) {
          const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
          const [, label, href] = m ?? []
          node = href?.startsWith('/') ? (
            <Link to={href} className="prose-link">
              <Inline text={label} />
            </Link>
          ) : (
            <a href={href} className="prose-link" target="_blank" rel="noreferrer">
              <Inline text={label} />
            </a>
          )
        } else if (part.startsWith('`')) {
          node = <code className="rounded bg-paper-deep px-1.5 py-0.5 font-mono text-[0.85em]">{part.slice(1, -1)}</code>
        } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          node = <em className="italic">{typo(part.slice(1, -1))}</em>
        } else {
          node = typo(part)
        }
        return <Fragment key={i}>{node}</Fragment>
      })}
    </>
  )
}

/** Strips the markup for search indexing and word counts. */
export function plain(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}
