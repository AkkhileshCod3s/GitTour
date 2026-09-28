export interface ToastData {
  id: number
  icon: string
  title: string
  text: string
}

/** Corner toast (badge unlock). Managed by ToastHost in App. */
export function Toast({ toast }: { toast: ToastData }) {
  return (
    <div
      className="anim-toast pointer-events-auto flex items-center gap-3 bg-space-panel border border-gold/60 rounded-xl px-4 py-3 shadow-glow-gold"
      role="status"
    >
      <span className="text-2xl" aria-hidden="true">{toast.icon}</span>
      <div>
        <p className="font-display text-[8px] text-gold">{toast.title}</p>
        <p className="text-xs text-ink-hi">{toast.text}</p>
      </div>
    </div>
  )
}
