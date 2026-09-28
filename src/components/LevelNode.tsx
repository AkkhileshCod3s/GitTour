interface Props {
  title: string
  state: 'locked' | 'unlocked' | 'completed'
  stars?: number
  isBoss: boolean
  accent: string
  onClick: () => void
}

export function LevelNode({ title, state, stars = 0, isBoss, accent, onClick }: Props) {
  const locked = state === 'locked'
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className="focus-neon group relative flex flex-col items-center gap-1 disabled:cursor-not-allowed"
      aria-label={`${title} — ${state}${!locked ? `, ${stars} stars` : ''}`}
    >
      <span
        className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-200
          ${isBoss ? 'w-16 h-16' : 'w-12 h-12'}
          ${locked ? 'border-space-border bg-space-panel/60 opacity-60' : 'group-hover:scale-110'}
          ${state === 'unlocked' && !isBoss ? 'anim-glow' : ''}`}
        style={locked ? undefined : { borderColor: accent, color: accent, background: '#111a2e', boxShadow: `0 0 14px ${accent}44` }}
      >
        {locked ? (
          <span className="text-lg" aria-hidden="true">🔒</span>
        ) : isBoss ? (
          <span className="text-2xl" aria-hidden="true">👑</span>
        ) : (
          <span className="font-display text-[10px]" aria-hidden="true">{stars > 0 ? '★' : '▶'}</span>
        )}
      </span>
      {state === 'completed' && (
        <span className="text-[9px] leading-none tracking-widest text-gold" aria-hidden="true">
          {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
        </span>
      )}
      <span className={`text-[9px] font-display text-center max-w-[110px] leading-tight ${locked ? 'text-ink-low' : 'text-ink-hi'}`}>
        {locked ? '???' : title}
      </span>
    </button>
  )
}
