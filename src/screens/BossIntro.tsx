import { useEffect, useState } from 'react'

/** Full-screen dramatic BOSS LEVEL intro with shake + glow. */
export function BossIntro({ title, accent, onDone }: { title: string; accent: string; onDone: () => void }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900)
    const t2 = setTimeout(onDone, 2200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 anim-shake"
      role="alertdialog"
      aria-label="boss level intro"
      style={{ boxShadow: `inset 0 0 120px ${accent}33` }}
    >
      <div className="text-center">
        <p className="font-display text-3xl sm:text-4xl text-danger" style={{ textShadow: '0 0 24px rgba(248,113,113,.8)' }}>
          {phase === 0 ? '⚠' : 'BOSS LEVEL'}
        </p>
        <h2 className="mt-4 font-display text-xs sm:text-sm" style={{ color: accent, textShadow: `0 0 16px ${accent}` }}>
          {title}
        </h2>
        <p className="mt-3 text-xs text-ink-mid font-mono">Koi hint nahi milega. All the best, Time Traveler!</p>
      </div>
    </div>
  )
}
