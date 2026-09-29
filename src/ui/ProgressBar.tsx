interface Props {
  value: number // 0..100
  color?: string
  label?: string
  height?: number
}

export function ProgressBar({ value, color = 'rgb(var(--lime))', label, height = 18 }: Props) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      className="w-full bg-brut-shade border-3 border-theme rounded-brut overflow-hidden relative"
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'progress'}
    >
      <div className="h-full transition-all duration-500 ease-out" style={{ width: `${v}%`, backgroundColor: color }} />
      {label && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-display text-brut-ink" style={{ color: 'rgb(var(--ink-hi))' }}>
          {label}
        </span>
      )}
    </div>
  )
}
