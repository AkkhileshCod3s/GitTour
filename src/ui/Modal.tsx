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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'dialog'}
      onClick={onClose}
    >
      <div
        className={`bg-space-panel border border-neon-cyan/40 rounded-2xl shadow-glow-lg w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-auto anim-pop`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <header className="px-4 py-3 border-b border-space-border flex items-center justify-between">
            <h2 className="font-display text-[11px] text-neon-cyan">{title}</h2>
            {onClose && (
              <button onClick={onClose} className="focus-neon text-ink-mid hover:text-ink-hi text-lg leading-none" aria-label="close">
                ×
              </button>
            )}
          </header>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
