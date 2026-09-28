import { useMemo } from 'react'
import { Button } from '../ui/Button'
import { Mascot } from '../components/Mascot'

interface Props {
  hasProgress: boolean
  onStart: () => void
  onContinue: () => void
  onProfile: () => void
  soundOn: boolean
  onToggleSound: () => void
}

/** Slow drifting stars background. */
function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 2 + 1,
        dur: Math.random() * 20 + 12,
        delay: -Math.random() * 20,
        op: Math.random() * 0.6 + 0.2,
      })),
    [],
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            width: s.size,
            height: s.size,
            opacity: s.op,
            animation: `drift-star ${s.dur}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function TitleScreen({ hasProgress, onStart, onContinue, onProfile, soundOn, onToggleSound }: Props) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center gap-6 overflow-hidden">
      {/* moving grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 anim-grid pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.25) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
        aria-hidden="true"
      />
      <StarField />
      <div className="relative">
        <Mascot mood="idle" size={110} />
      </div>
      <div className="text-center relative">
        <h1 className="font-display text-2xl sm:text-3xl text-neon-cyan shadow-glow" style={{ textShadow: '0 0 18px rgba(34,211,238,.7)' }}>
          GIT TIME TRAVELER
        </h1>
        <p className="mt-3 text-sm text-ink-mid max-w-md mx-auto leading-relaxed">
          Tooti hui timelines repair karo. Git commands type karo, commits ka graph dekho — aur Git master bano!
        </p>
      </div>
      <div className="flex flex-col gap-3 w-56 relative">
        {hasProgress && (
          <Button size="lg" variant="gold" onClick={onContinue} autoFocus>
            ▶ CONTINUE
          </Button>
        )}
        <Button size="lg" onClick={hasProgress ? onStart : onContinue} autoFocus={!hasProgress}>
          PRESS START
        </Button>
        <Button size="sm" variant="secondary" onClick={onProfile}>
          🏅 PROFILE
        </Button>
      </div>
      <button onClick={onToggleSound} className="focus-neon relative text-xs text-ink-mid hover:text-ink-hi" aria-label="toggle sound">
        Sound: {soundOn ? '🔊 ON' : '🔇 OFF (press to enable)'}
      </button>
    </div>
  )
}
