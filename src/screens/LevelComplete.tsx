import { useMemo } from 'react'
import type { Level } from '../levels/worlds'
import { Button } from '../ui/Button'
import { StarRating } from '../ui/StarRating'
import { Mascot } from '../components/Mascot'
import { IconBook, IconCrown, IconMedal } from '../ui/Icons'
import { BADGES } from '../game/achievements'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'

interface Props {
  level: Level
  explanation: string
  stars: number
  xp: number
  badges: string[]
  hasNext: boolean
  onNext: () => void
  onRetry: () => void
  onExit: () => void
  lang: Lang
}

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        dur: Math.random() * 2 + 1.4,
        delay: Math.random() * 0.6,
        color: ['var(--lime)', 'var(--lime)', 'var(--lime)', 'var(--danger)'][i % 4],
        size: Math.random() * 8 + 6,
      })),
    [],
  )
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute top-0 anim-confetti border-2 border-brut-ink"
          style={{
            left: `${b.x}%`,
            width: b.size,
            height: b.size * 0.7,
            borderRadius: b.id % 2 === 0 ? '999px' : '4px',
            background: `rgb(${b.color})`,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export function LevelComplete({ level, explanation, stars, xp, badges, hasNext, onNext, onRetry, onExit, lang }: Props) {
  const newBadges = BADGES.filter((b) => badges.includes(b.id))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="level complete" style={{ background: 'var(--scrim)' }}>
      <Confetti />
      <div className="relative bg-brut-panel border-4 border-lime rounded-brut-lg shadow-brut max-w-md w-full p-6 text-center anim-pop max-h-[92vh] overflow-y-auto">
        <div className="flex justify-center -mt-16 mb-1">
          <Mascot mood="happy" size={84} />
        </div>
        <h2 className="font-display text-2xl text-lime">
          {level.isBoss ? (
            <span className="inline-flex items-center gap-2">
              <IconCrown size={20} className="text-lime" />
              {t(STRINGS.complete.bossBeaten, lang)}
            </span>
          ) : (
            t(STRINGS.complete.repaired, lang)
          )}
        </h2>
        <p className="text-sm text-ink-mid mt-1 font-bold">{level.title}</p>

        <div className="my-4 flex justify-center">
          <StarRating count={stars} size={34} animate />
        </div>

        <p className="font-display text-lg text-lime mb-3">+{xp} XP</p>

        <div className="my-4 bg-brut-shade border-3 border-theme rounded-brut p-3 text-left">
          <p className="flex items-center gap-1.5 font-display text-sm text-lime mb-1">
            <IconBook size={14} />
            {t(STRINGS.complete.learned, lang)}
          </p>
          <p className="text-sm text-ink-mid leading-relaxed">{explanation}</p>
        </div>

        {newBadges.length > 0 && (
          <div className="my-4 space-y-2">
            {newBadges.map((b) => (
              <div key={b.id} className="anim-toast flex items-center gap-2 bg-brut-bg border-3 border-theme rounded-brut px-3 py-2 text-left shadow-brut-xs">
                <IconMedal size={20} className="text-lime shrink-0" />
                <div className="min-w-0">
                  <p className="font-display text-sm text-lime">{t(STRINGS.complete.newBadge, lang)}{b.name.toUpperCase()}</p>
                  <p className="text-xs text-ink-mid">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {hasNext && <Button variant="primary" onClick={onNext}>{t(STRINGS.complete.next, lang)}</Button>}
          <Button variant="secondary" onClick={onRetry}>{t(STRINGS.complete.retry, lang)}</Button>
          <Button variant="secondary" onClick={onExit}>{t(STRINGS.complete.map, lang)}</Button>
        </div>
      </div>
    </div>
  )
}
