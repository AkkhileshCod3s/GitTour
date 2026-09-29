import type { ReactNode } from 'react'

interface Props {
  title?: string
  accent?: string
  className?: string
  children: ReactNode
}

/** Charcoal panel, crisp border, hard shadow. */
export function Panel({ title, accent, className = '', children }: Props) {
  return (
    <section
      className={`bg-brut-panel border-3 border-theme rounded-brut-lg shadow-brut ${className}`}
      style={accent ? { borderTop: `5px solid ${accent}` } : undefined}
    >
      {title && (
        <header className="px-4 py-2 border-b-3 border-theme">
          <span className="font-display text-sm text-lime">{title}</span>
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  )
}
