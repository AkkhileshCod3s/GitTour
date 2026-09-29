import { useEffect, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose?: () => void
  title?: string
  children: ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, children, wide = false }: Props) {
  useEffect(() => {
    if (!open || !onClose) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--scrim)' }}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'dialog'}
      onClick={onClose}
    >
      <div
        className={`bg-brut-panel border-4 border-theme rounded-brut-lg shadow-brut w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-auto anim-pop`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <header className="px-5 py-3 border-b-3 border-theme bg-lime flex items-center justify-between rounded-t-[10px]">
            <h2 className="font-display text-lg text-brut-ink">{title}</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="focus-neon press-snap w-9 h-9 flex items-center justify-center font-display font-bold text-brut-ink bg-brut-ink text-lime border-2 border-brut-ink rounded-brut"
                style={{ backgroundColor: 'rgb(var(--brut-bg))' }}
                aria-label="close"
              >
                ×
              </button>
            )}
          </header>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
