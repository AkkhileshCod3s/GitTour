import type { PlayerProgress } from '../game/progress'
import { totalStars } from '../game/progress'
import { ProgressBar } from '../ui/ProgressBar'
import { rankForXp, RANKS } from '../levels/scoring'

interface Props {
  worldName: string
  levelTitle: string
  accent: string
  progress: PlayerProgress
  soundOn: boolean
  onToggleSound: () => void
  onSettings: () => void
}

export function HUD({ worldName, levelTitle, accent, progress, soundOn, onToggleSound, onSettings }: Props) {
  const rank = rankForXp(progress.xp)
  const rankIdx = RANKS.indexOf(rank)
  const nextAt = [0, 250, 700, 1500][rankIdx + 1] ?? 1500
  const curAt = [0, 250, 700, 1500][rankIdx]
  const pct = rankIdx === RANKS.length - 1 ? 100 : ((progress.xp - curAt) / (nextAt - curAt)) * 100

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 bg-space-panel/90 border-b border-space-border">
      <div className="min-w-0">
        <p className="font-display text-[8px]" style={{ color: accent }}>{worldName}</p>
        <h1 className="font-display text-[10px] text-ink-hi truncate">{levelTitle}</h1>
      </div>
      <div className="w-36" title={`XP: ${progress.xp}`}>
        <ProgressBar value={pct} color={accent} height={8} />
        <p className="text-[8px] text-ink-mid mt-0.5 font-mono">
          {rank} · {progress.xp} XP
        </p>
      </div>
      <div className="flex items-center gap-1" title="Total stars">
        <span aria-hidden="true">⭐</span>
        <span className="font-mono text-xs text-gold">{totalStars(progress)}</span>
      </div>
      <div className="flex items-center gap-1" title="Daily streak">
        <span aria-hidden="true">🔥</span>
        <span className="font-mono text-xs text-gold">{progress.streak}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onToggleSound}
          className="focus-neon text-sm px-1.5 rounded hover:bg-space-panel2"
          aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
          title="Sound ON/OFF"
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
        <button onClick={onSettings} className="focus-neon text-sm px-1.5 rounded hover:bg-space-panel2" aria-label="Settings" title="Settings">
          ⚙
        </button>
      </div>
    </header>
  )
}
