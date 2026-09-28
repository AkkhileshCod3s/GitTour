interface Props {
  value: number // 0..100
  color?: string
  label?: string
  height?: number
}

export function ProgressBar({ value, color = '#fbbf24', label, height = 10 }: Props) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      className="w-full bg-space-bg border border-space-border rounded-full overflow-hidden relative"
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'progress'}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${v}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}` }}
      />
      {label && (
        <span className="absolute inset-0 flex items-center justify-center text-[7px] font-display text-ink-hi">
          {label}
        </span>
      )}
    </div>
  )
}
