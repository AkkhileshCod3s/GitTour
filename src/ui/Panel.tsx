import type { ReactNode } from 'react'

interface Props {
  title?: string
  accent?: string
  className?: string
  children: ReactNode
}

/** Rounded glowing panel used everywhere. */
export function Panel({ title, accent = '#22d3ee', className = '', children }: Props) {
  return (
    <section
      className={`bg-space-panel/80 border rounded-xl backdrop-blur-sm ${className}`}
      style={{ borderColor: accent + '55', boxShadow: `0 0 14px ${accent}22` }}
    >
      {title && (
        <header
          className="px-3 py-2 border-b text-[9px] font-display tracking-wider"
          style={{ borderColor: accent + '33', color: accent }}
        >
          {title}
        </header>
      )}
      <div className="p-3">{children}</div>
    </section>
  )
}
