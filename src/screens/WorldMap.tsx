import { WORLDS, type Level } from '../levels/worlds'
import { Mascot } from '../components/Mascot'
import { IconInfo, IconLock, IconStarFilled } from '../ui/Icons'
import type { PlayerProgress } from '../game/progress'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'

interface Props {
  levels: Level[]
  progress: PlayerProgress
  lang: Lang
  onPlay: (levelId: string) => void
}

const WORLD_VAR: Record<number, string> = { 1: 'rgb(var(--lime))', 2: 'rgb(var(--lime))', 3: 'rgb(var(--lime))', 4: 'rgb(var(--danger))' }

export function WorldMap({ levels, progress, lang, onPlay }: Props) {
  function stateOf(l: Level): 'locked' | 'unlocked' | 'completed' {
    if (progress.stars[l.id] > 0) return 'completed'
    const idx = levels.findIndex((x) => x.id === l.id)
    if (idx === 0) return 'unlocked'
    const prev = levels[idx - 1]
    if (progress.stars[prev.id] > 0) return 'unlocked'
    return 'locked'
  }
  const isCurrent = (l: Level): boolean => {
    const idx = levels.findIndex((x) => x.id === l.id)
    if (progress.stars[l.id] > 0) return false
    if (idx === 0) return true
    return progress.stars[levels[idx - 1].id] > 0
  }

  return (
    <div className="min-h-full map-dots">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* heading with mascot accent */}
        <div className="flex items-center gap-3 mb-8">
          <Mascot mood="idle" size={44} />
          <h1 className="font-display text-2xl sm:text-3xl text-lime">{t(STRINGS.map.title, lang)}</h1>
        </div>

        <div className="relative pl-2">
          {/* thick yellow vertical path */}
          <span className="absolute left-[31px] top-2 bottom-2 w-[6px] rounded bg-lime opacity-90" aria-hidden="true" />

          <div className="space-y-8">
            {WORLDS.map((w) => {
              const wLevels = levels.filter((l) => l.world === w.id)
              const prevBoss = levels.filter((l) => l.world === w.id - 1 && l.isBoss)[0]
              const worldOpen = w.id === 1 || (prevBoss ? progress.stars[prevBoss.id] > 0 : true)
              const accent = WORLD_VAR[w.id] ?? 'rgb(var(--lime))'
              const doneCount = wLevels.filter((l) => (progress.stars[l.id] ?? 0) > 0).length
              return (
                <section key={w.id} aria-label={w.name}>
                  <div className="flex items-start gap-3">
                    {/* world node */}
                    <span
                      className={`relative z-10 w-[52px] h-[52px] shrink-0 rounded-full border-4 flex items-center justify-center font-display text-sm ${worldOpen ? 'anim-ring-pulse' : 'opacity-50 grayscale'}`}
                      style={{ backgroundColor: 'rgb(var(--brut-bg))', borderColor: accent, color: accent }}
                      aria-hidden="true"
                    >
                      W{w.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h2 className="font-display text-lg" style={{ color: accent }}>{w.name}</h2>
                        <span className="font-mono text-xs text-ink-mid border-2 border-theme rounded-brut px-1.5 py-0.5">
                          {doneCount}/{wLevels.length}
                        </span>
                      </div>
                      <p className="text-sm text-ink-mid">{worldOpen ? w.storyHinglish[0] : t(STRINGS.map.lockedWorld, lang)}</p>
                      {/* thin yellow progress line */}
                      <div className="mt-1 h-[6px] w-full bg-brut-shade border-2 border-theme rounded-full overflow-hidden">
                        <div className="h-full bg-lime transition-all duration-500" style={{ width: `${wLevels.length ? (doneCount / wLevels.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* level rows on the path */}
                  <div className="mt-4 ml-[70px] space-y-4">
                    {wLevels.map((l, li) => {
                      const st = stateOf(l)
                      const locked = st === 'locked'
                      const current = isCurrent(l)
                      return (
                        <button
                          key={l.id}
                          onClick={() => !locked && onPlay(l.id)}
                          disabled={locked}
                          className={`focus-neon press-snap w-full text-left flex items-center gap-3 rounded-brut border-3 p-3 shadow-brut-sm ${locked ? 'opacity-50 grayscale border-theme bg-brut-shade' : 'bg-brut-panel border-lime'}`}
                          title={l.title}
                          aria-label={`${l.title} — ${st}`}
                        >
                          {/* sub-level tile */}
                          <span
                            className={`shrink-0 h-10 w-10 rounded-brut border-3 flex items-center justify-center font-display text-sm ${locked ? 'border-theme text-ink-low' : 'border-lime bg-lime text-brut-ink'}`}
                            aria-hidden="true"
                          >
                            {locked ? <IconLock size={16} /> : li + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-sm text-brut-ink" style={{ color: 'rgb(var(--ink-hi))' }}>
                                {w.id}.{li + 1} {l.title}
                              </span>
                              {current && (
                                <span className="font-display text-[10px] tracking-wider bg-lime text-brut-ink border-2 border-brut-ink rounded-brut px-1.5 py-0.5">
                                  HEAD
                                </span>
                              )}
                              {st === 'completed' && (
                                <span className="flex items-center gap-0.5" style={{ color: 'rgb(var(--lime))' }} aria-label={`${progress.stars[l.id]} stars`}>
                                  {Array.from({ length: progress.stars[l.id] ?? 0 }).map((_, si) => (
                                    <IconStarFilled key={si} size={12} />
                                  ))}
                                </span>
                              )}
                            </span>
                            <span className="block text-xs text-ink-mid truncate" title={l.task}>{l.task}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-xs text-ink-low text-center pt-8 font-bold">
          <IconInfo size={13} className="shrink-0" />
          {t(STRINGS.map.storageNotice, lang)}
        </p>
      </div>
    </div>
  )
}
