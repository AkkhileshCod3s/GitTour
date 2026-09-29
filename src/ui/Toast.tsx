import type { ReactNode } from 'react'
import { IconMedal } from './Icons'

export interface ToastData {
  id: number
  /** Icon key for the toast badge slot ('medal' today; extend as needed). */
  icon: string
  title: string
  text: string
}

const TOAST_ICONS: Record<string, ReactNode> = {
  medal: <IconMedal size={20} className="text-lime" />,
}

/** Corner toast (badge unlock): charcoal pill, lime border. */
export function Toast({ toast }: { toast: ToastData }) {
  return (
    <div
      className="anim-toast pointer-events-auto flex items-center gap-3 bg-brut-panel border-3 border-lime rounded-brut px-4 py-3 shadow-brut"
      role="status"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-brut border-3 border-lime bg-brut-shade" aria-hidden="true">
        {TOAST_ICONS[toast.icon] ?? TOAST_ICONS.medal}
      </span>
      <div>
        <p className="font-display text-sm text-lime leading-tight">{toast.title}</p>
        <p className="text-sm text-ink-mid">{toast.text}</p>
      </div>
    </div>
  )
}
