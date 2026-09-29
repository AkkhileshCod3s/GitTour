import { IconCrown, IconLock } from '../ui/Icons'

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
      className="focus-neon press-snap group relative flex flex-col items-center gap-1.5 w-[120px] disabled:cursor-not-allowed"
      title={title}
      aria-label={`${title} — ${state}${!locked ? `, ${stars} stars` : ''}`}
    >
      <span
        className={`relative flex items-center justify-center rounded-brut border-3 border-brut-ink
          ${isBoss ? 'w-16 h-16' : 'w-12 h-12'}
          ${locked ? 'bg-brut-shade opacity-50 grayscale' : 'shadow-brut-xs'}`}
        style={!locked ? { backgroundColor: accent } : undefined}
      >
        {locked ? (
          <IconLock size={18} className="text-ink-low" />
        ) : isBoss ? (
          <IconCrown size={24} className="text-brut-ink" />
        ) : (
          <span className="font-display font-bold text-white" aria-hidden="true">{stars > 0 ? '★' : '▶'}</span>
        )}
      </span>
      {state === 'completed' && (
        <span className="text-[11px] leading-none tracking-widest" style={{ color: 'rgb(var(--lime))' }} aria-hidden="true">
          {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
        </span>
      )}
      <span className={`text-[11px] font-bold text-center w-full leading-tight break-words ${locked ? 'text-ink-low' : 'text-brut-ink'}`}>
        {locked ? '???' : title}
      </span>
    </button>
  )
}
