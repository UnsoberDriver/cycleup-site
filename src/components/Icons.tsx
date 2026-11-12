type P = { className?: string }
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const SearchIcon = ({ className = 'h-4 w-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
)
export const ArrowRight = ({ className = 'h-4 w-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)
export const ArrowLeft = ({ className = 'h-4 w-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </svg>
)
export const ExternalIcon = ({ className = 'h-3.5 w-3.5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)
export const MenuIcon = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)
export const CloseIcon = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const HashIcon = ({ className = 'h-4 w-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16" />
  </svg>
)
export const CheckIcon = ({ className = 'h-3.5 w-3.5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base} strokeWidth={2.4}>
    <path d="m5 12 5 5 9-10" />
  </svg>
)

export const PromiseIcon = ({ className = 'h-8 w-8' }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...base}>
    <path d="M5 23c5-10 10-15 22-15" />
    <path d="m21 5 6 3-3 6" />
    <circle cx="6" cy="24" r="2.5" />
    <path d="M14 18h5M16.5 15.5v5" />
  </svg>
)

export const ExperimentIcon = ({ className = 'h-8 w-8' }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...base}>
    <path d="M7 12h18l2 5H5l2-5ZM7 17v5m18-5v5M10 11V8h12v3" />
    <circle cx="8" cy="23" r="3" />
    <circle cx="24" cy="23" r="3" />
    <path d="M11 22h10" />
  </svg>
)

export const CommonsIcon = ({ className = 'h-8 w-8' }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...base}>
    <circle cx="16" cy="7" r="3" />
    <circle cx="7" cy="23" r="3" />
    <circle cx="25" cy="23" r="3" />
    <path d="m14.5 9.5-6 11m9-11 6 11M10 23h12" />
  </svg>
)

export const TimelineIcon = ({ className = 'h-8 w-8' }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...base}>
    <path d="M5 16h22" />
    <circle cx="8" cy="16" r="3" />
    <circle cx="16" cy="16" r="3" />
    <circle cx="24" cy="16" r="3" />
  </svg>
)

export const GlossaryIcon = ({ className = 'h-8 w-8' }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...base}>
    <path d="M7 5h16a2 2 0 0 1 2 2v20H9a2 2 0 0 1-2-2V5Z" />
    <path d="M11 10h10M11 15h10M11 20h6" />
  </svg>
)

export const SourcesIcon = ({ className = 'h-8 w-8' }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...base}>
    <path d="M9 5h11l5 5v17H9Z" />
    <path d="M20 5v6h5M13 16h8M13 21h8" />
    <path d="M5 9v18h14" />
  </svg>
)

export const ActorsIcon = ({ className = 'h-8 w-8' }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...base}>
    <circle cx="12" cy="11" r="4" />
    <circle cx="23" cy="13" r="3" />
    <path d="M4 27c.5-6 3-9 8-9s7.5 3 8 9M20 20c4 0 6 2.5 6.5 7" />
  </svg>
)

export const MethodIcon = ({ className = 'h-8 w-8' }: P) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...base}>
    <circle cx="16" cy="16" r="11" />
    <path d="m20 11-2.5 6.5L11 20l2.5-6.5L20 11Z" />
  </svg>
)
