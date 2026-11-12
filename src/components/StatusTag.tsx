import { STATUS_LABEL } from '../content/site'
import type { Status } from '../content/types'

const STYLES: Record<Status, string> = {
  documente: 'border-commun/30 bg-commun-soft text-commun',
  'a-verifier': 'border-alerte/30 bg-alerte-soft text-alerte',
  'a-documenter': 'border-dashed border-alerte/60 bg-transparent text-alerte',
}

export function StatusTag({ status, className = '' }: { status: Status; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] ${STYLES[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  )
}

/** Small inline tag for missing references (URL, consultation date). */
export function PendingTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-dashed border-muted/50 px-1.5 py-px font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted">
      {children}
    </span>
  )
}
