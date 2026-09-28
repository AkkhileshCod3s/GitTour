import { BADGES } from '../game/achievements'
import type { PlayerProgress } from '../game/progress'
import { totalStars } from '../game/progress'
import { rankForXp } from '../levels/scoring'
import { ProgressBar } from '../ui/ProgressBar'
import { Button } from '../ui/Button'

interface Props {
  progress: PlayerProgress
  levelsCount: number
  completedCount: number
  onBack: () => void
  onResetAll: () => void
}

const ICONS: Record<string, string> = {
  star: '⭐', shield: '🛡', bolt: '⚡', clock: '⏳',
  crown: '👑', flame: '🔥', globe: '🌐', wrench: '🔧',
}

export function BadgeGrid({ progress, levelsCount, completedCount, onBack, onResetAll }: Props) {
  const rank = rankForXp(progress.xp)
  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-sm text-gold">🏅 PROFILE</h1>
          <Button size="sm" variant="secondary" onClick={onBack}>← BACK</Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="RANK" value={rank} color="#22d3ee" />
          <Stat label="TOTAL XP" value={String(progress.xp)} color="#fbbf24" />
          <Stat label="STARS" value={`${totalStars(progress)}/${levelsCount * 3}`} color="#fbbf24" />
          <Stat label="STREAK" value={`${progress.streak} 🔥`} color="#f87171" />
        </div>

        <div>
          <p className="font-display text-[9px] text-ink-mid mb-2">
            PROGRESS: {completedCount}/{levelsCount} levels
          </p>
          <ProgressBar value={levelsCount ? (completedCount / levelsCount) * 100 : 0} color="#34d399" />
        </div>

        <div>
          <h2 className="font-display text-[10px] text-neon-cyan mb-3">BADGES</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BADGES.map((b) => {
              const unlocked = progress.badges.includes(b.id)
              return (
                <div
                  key={b.id}
                  className={`border rounded-xl p-3 text-center ${unlocked ? 'border-gold/60 shadow-glow-gold bg-space-panel' : 'border-space-border bg-space-panel/40 opacity-70'}`}
                  aria-label={`${b.name}: ${unlocked ? 'unlocked' : 'locked'}`}
                >
                  <p className="text-2xl" aria-hidden="true">{unlocked ? ICONS[b.icon] : '❓'}</p>
                  <p className={`font-display text-[7px] mt-1 ${unlocked ? 'text-gold' : 'text-ink-low'}`}>{b.name.toUpperCase()}</p>
                  <p className="text-[10px] text-ink-mid mt-1 leading-snug">{unlocked ? b.desc : '??? — khelo aur kholo!'}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-space-border flex items-center justify-between">
          <p className="text-[10px] text-ink-low max-w-sm">
            ⚠ Danger zone: sab progress delete ho jayega (browser data).
          </p>
          <Button size="sm" variant="danger" onClick={onResetAll}>RESET ALL</Button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-space-panel border border-space-border rounded-xl p-3 text-center">
      <p className="text-[8px] font-display text-ink-mid">{label}</p>
      <p className="font-display text-[10px] mt-1" style={{ color }}>{value}</p>
    </div>
  )
}
