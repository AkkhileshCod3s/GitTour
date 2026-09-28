import { useMemo } from 'react'
import type { Level } from '../levels/worlds'
import { Button } from '../ui/Button'
import { StarRating } from '../ui/StarRating'
import { Mascot } from '../components/Mascot'
import { BADGES } from '../game/achievements'
import { ProgressBar } from '../ui/ProgressBar'
import { rankForXp } from '../levels/scoring'

interface Props {
  level: Level
  stars: number
  xp: number
  badges: string[]
  hasNext: boolean
  onNext: () => void
  onRetry: () => void
  onExit: () => void
}

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        dur: Math.random() * 2.2 + 1.6,
        delay: Math.random() * 0.7,
        color: ['#22d3ee', '#e879f9', '#fbbf24', '#34d399'][i % 4],
        size: Math.random() * 6 + 4,
      })),
    [],
  )
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute top-0 anim-confetti"
          style={{
            left: `${b.x}%`,
            width: b.size,
            height: b.size * 0.6,
            background: b.color,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export function LevelComplete({ level, stars, xp, badges, hasNext, onNext, onRetry, onExit }: Props) {
  const newBadges = BADGES.filter((b) => badges.includes(b.id))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-label="level complete">
      <Confetti />
      <div className="relative bg-space-panel border border-gold/50 rounded-2xl shadow-glow-gold max-w-md w-full p-6 text-center anim-pop max-h-[92vh] overflow-y-auto">
        <div className="flex justify-center -mt-14 mb-1">
          <Mascot mood="happy" size={84} />
        </div>
        <h2 className="font-display text-sm text-gold" style={{ textShadow: '0 0 14px rgba(251,191,36,.6)' }}>
          {level.isBoss ? '👑 BOSS DEFEATED!' : 'TIMELINE REPAIRED!'}
        </h2>
        <p className="text-xs text-ink-mid mt-1">{level.title}</p>

        <div className="my-4 flex justify-center">
          <StarRating count={stars} size={34} animate />
        </div>

        <div className="my-3">
          <p className="font-display text-[9px] text-neon-cyan mb-1">+{xp} XP</p>
          <ProgressBar value={Math.min(100, (rankForXp === undefined ? 0 : 0) + 100)} color="#fbbf24" height={6} />
        </div>

        {/* Aaj kya seekha card */}
        <div className="my-4 bg-space-bg/70 border border-space-border rounded-xl p-3 text-left">
          <p className="text-[8px] font-display text-neon-cyan mb-1">📖 AAJ KYA SEEKHA</p>
          <p className="text-xs text-ink-mid leading-relaxed">{level.explanationHinglish}</p>
        </div>

        {newBadges.length > 0 && (
          <div className="my-4 space-y-2">
            {newBadges.map((b) => (
              <div key={b.id} className="anim-toast flex items-center gap-2 bg-space-bg/70 border border-gold/40 rounded-lg px-3 py-2 text-left">
                <span className="text-xl" aria-hidden="true">🏅</span>
                <div>
                  <p className="font-display text-[8px] text-gold">NEW BADGE: {b.name.toUpperCase()}</p>
                  <p className="text-[11px] text-ink-mid">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {hasNext && <Button variant="gold" onClick={onNext}>NEXT LEVEL ▶</Button>}
          <Button variant="secondary" onClick={onRetry}>↻ RETRY (for stars)</Button>
          <Button variant="secondary" onClick={onExit}>🗺 MAP</Button>
        </div>
      </div>
    </div>
  )
}
