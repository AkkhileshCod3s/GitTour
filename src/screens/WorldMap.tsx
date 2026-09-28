import { WORLDS, type Level } from '../levels/worlds'
import { LevelNode } from '../components/LevelNode'
import { Button } from '../ui/Button'
import type { PlayerProgress } from '../game/progress'
import { STORAGE_NOTICE } from '../storage'

interface Props {
  levels: Level[]
  progress: PlayerProgress
  onPlay: (levelId: string) => void
  onProfile: () => void
  onTitle: () => void
}

export function WorldMap({ levels, progress, onPlay, onProfile, onTitle }: Props) {
  // unlock rule: levels unlock in order within a world; boss needs all previous; world N needs world N-1 boss
  function stateOf(l: Level): 'locked' | 'unlocked' | 'completed' {
    if (progress.stars[l.id] > 0) return 'completed'
    const idx = levels.findIndex((x) => x.id === l.id)
    if (idx === 0) return 'unlocked'
    const prev = levels[idx - 1]
    if (prev.isBoss) {
      // need prev boss done (which implies world unlocked)
      return progress.stars[prev.id] > 0 ? 'unlocked' : 'locked'
    }
    if (progress.stars[prev.id] > 0) return 'unlocked'
    // non-boss may also unlock if any later level in world done? keep simple: previous required
    return 'locked'
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-sm text-neon-cyan" style={{ textShadow: '0 0 12px rgba(34,211,238,.6)' }}>
            🗺 TIMELINE MAP
          </h1>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={onTitle}>← TITLE</Button>
            <Button size="sm" variant="gold" onClick={onProfile}>🏅 PROFILE</Button>
          </div>
        </div>

        {WORLDS.map((w) => {
          const wLevels = levels.filter((l) => l.world === w.id)
          const worldOpen = w.id === 1 || progress.stars[levels.filter((l) => l.world === w.id - 1 && l.isBoss)[0]?.id] > 0
          return (
            <section key={w.id} aria-label={w.name}>
              <div
                className="flex items-baseline gap-3 mb-3 border-b pb-2"
                style={{ borderColor: w.accent + '33' }}
              >
                <span
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-display text-[10px] ${worldOpen ? 'anim-glow' : 'opacity-40'}`}
                  style={{ borderColor: w.accent, color: w.accent, boxShadow: worldOpen ? `0 0 16px ${w.accent}55` : undefined }}
                  aria-hidden="true"
                >
                  W{w.id}
                </span>
                <div>
                  <h2 className="font-display text-[11px]" style={{ color: w.accent }}>
                    {w.name}
                  </h2>
                  <p className="text-[11px] text-ink-mid">{worldOpen ? w.storyHinglish[0] : '🔒 Pichle world ka BOSS harao pehle.'}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-start gap-x-6 gap-y-4 pl-2 relative">
                {/* connecting path */}
                <span
                  className="absolute left-6 top-6 h-px w-[calc(100%-3rem)] opacity-40"
                  style={{ background: `linear-gradient(90deg, ${w.accent}, transparent)` }}
                  aria-hidden="true"
                />
                {wLevels.map((l) => (
                  <LevelNode
                    key={l.id}
                    title={l.title}
                    state={stateOf(l)}
                    stars={progress.stars[l.id] ?? 0}
                    isBoss={l.isBoss}
                    accent={w.accent}
                    onClick={() => onPlay(l.id)}
                  />
                ))}
              </div>
            </section>
          )
        })}

        <p className="text-[10px] text-ink-low text-center pt-4">ℹ {STORAGE_NOTICE}</p>
      </div>
    </div>
  )
}
