import type { ReactNode } from 'react'
import { BADGES } from '../game/achievements'
import type { PlayerProgress } from '../game/progress'
import { totalStars } from '../game/progress'
import { rankForXp } from '../levels/scoring'
import { ProgressBar } from '../ui/ProgressBar'
import { Button } from '../ui/Button'
import { t, STRINGS } from '../i18n/strings'
import {
  IconBolt,
  IconClock,
  IconCrown,
  IconFlame,
  IconGlobe,
  IconQuestion,
  IconShield,
  IconStarFilled,
  IconWrench,
} from '../ui/Icons'
import type { Lang } from '../storage'

interface Props {
  progress: PlayerProgress
  levelsCount: number
  completedCount: number
  lang: Lang
  onResetAll: () => void
}

const ICONS: Record<string, ReactNode> = {
  star: <IconStarFilled size={26} className="text-lime" />,
  shield: <IconShield size={26} className="text-lime" />,
  bolt: <IconBolt size={26} className="text-lime" />,
  clock: <IconClock size={26} className="text-lime" />,
  crown: <IconCrown size={26} className="text-lime" />,
  flame: <IconFlame size={26} className="text-danger" />,
  globe: <IconGlobe size={26} className="text-lime" />,
  wrench: <IconWrench size={26} className="text-lime" />,
}

export function BadgeGrid({ progress, levelsCount, completedCount, lang, onResetAll }: Props) {
  const rank = rankForXp(progress.xp)
  return (
    <div className="min-h-full">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-display text-2xl text-lime">{t(STRINGS.profile.title, lang)}</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label={t(STRINGS.profile.rank, lang)} value={rank} color="rgb(var(--lime))" />
          <Stat label={t(STRINGS.profile.xp, lang)} value={String(progress.xp)} color="rgb(var(--lime))" />
          <Stat label={t(STRINGS.profile.stars, lang)} value={`${totalStars(progress)}/${levelsCount * 3}`} color="rgb(var(--lime))" />
          <Stat label={t(STRINGS.profile.streakLabel, lang)} value={String(progress.streak)} color="rgb(var(--danger))" />
        </div>
        <div>
          <p className="font-display text-sm text-ink-mid mb-2">
            {t(STRINGS.profile.progress, lang)}{completedCount}/{levelsCount} {t(STRINGS.profile.levels, lang)}
          </p>
          <ProgressBar value={levelsCount ? (completedCount / levelsCount) * 100 : 0} color="rgb(var(--lime))" />
        </div>

        <div>
          <h2 className="font-display text-lg text-lime mb-3">{t(STRINGS.profile.badges, lang)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BADGES.map((b) => {
              const unlocked = progress.badges.includes(b.id)
              return (
                <div
                  key={b.id}
                  className={`border-3 rounded-brut p-3 text-center shadow-brut-xs ${unlocked ? 'border-danger bg-brut-panel' : 'border-theme bg-brut-panel opacity-60'}`}
                  aria-label={`${b.name}: ${unlocked ? 'unlocked' : 'locked'}`}
                >
                  <p className="flex justify-center" aria-hidden="true">{unlocked ? ICONS[b.icon] : <IconQuestion size={26} className="text-ink-low" />}</p>
                  <p className="font-display text-xs mt-1 text-brut-ink break-words" style={{ color: 'rgb(var(--ink-hi))' }}>{b.name.toUpperCase()}</p>
                  <p className="text-[11px] sm:text-xs text-ink-mid mt-1 leading-snug">{unlocked ? b.desc : t(STRINGS.profile.lockedBadge, lang)}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t-3 border-theme flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-ink-low font-bold">{t(STRINGS.profile.danger, lang)}</p>
          <Button size="sm" variant="danger" className="sm:self-auto self-stretch" onClick={onResetAll}>{t(STRINGS.profile.resetAll, lang)}</Button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-brut-panel border-3 border-theme rounded-brut p-3 text-center shadow-brut-xs min-w-0">
      <p className="text-xs font-bold text-ink-mid truncate" title={label}>{label}</p>
      <p className="font-display mt-1 break-words leading-tight" style={{ color }} title={value}>{value}</p>
    </div>
  )
}
