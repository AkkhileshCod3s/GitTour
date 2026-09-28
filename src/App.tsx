import { useCallback, useEffect, useMemo, useState } from 'react'
import { TitleScreen } from './screens/TitleScreen'
import { WorldMap } from './screens/WorldMap'
import { LevelScreen } from './screens/LevelScreen'
import { BadgeGrid } from './screens/BadgeGrid'
import { SettingsModal } from './screens/SettingsModal'
import { LEVELS } from './levels/levels'
import { loadProgress, saveProgress, clearProgress } from './storage'
import { defaultProgress, touchStreak, type PlayerProgress } from './game/progress'
import { setMuted } from './game/sound'
import { Toast, type ToastData } from './ui/Toast'
import { BADGES } from './game/achievements'

type Screen = 'title' | 'map' | 'level' | 'profile'

export default function App() {
  const [screen, setScreen] = useState<Screen>('title')
  const [progress, setProgress] = useState<PlayerProgress>(() => loadProgress())
  const [levelId, setLevelId] = useState<string>('')
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)

  // persist on change + sync sound mute
  useEffect(() => {
    saveProgress(progress)
    setMuted(!progress.soundOn)
  }, [progress])

  const showToast = useCallback((title: string, text: string, icon: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, title, text, icon }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  const toggleSound = useCallback(() => {
    setProgress((p) => ({ ...p, soundOn: !p.soundOn }))
  }, [])

  const handleWin = useCallback(
    (id: string, stars: number, xp: number, hintsUsed: number): string[] => {
      let newBadges: string[] = []
      setProgress((p) => {
        const next: PlayerProgress = {
          ...p,
          xp: p.xp + xp,
          stars: { ...p.stars, [id]: Math.max(p.stars[id] ?? 0, stars) },
          completed: p.completed.includes(id) ? p.completed : [...p.completed, id],
          hintsUsedTotal: p.hintsUsedTotal + hintsUsed,
        }
        touchStreak(next)
        const lvl = LEVELS.find((l) => l.id === id)
        if (lvl) {
          // import cycle avoided: badges computed inline
          newBadges = computeBadges(next, id, lvl.isBoss, lvl.world, hintsUsed, lvl)
        }
        next.badges = [...new Set([...p.badges, ...newBadges])]
        return next
      })
      // toasts for new badges
      setTimeout(() => {
        for (const b of newBadges) {
          const def = BADGES.find((x) => x.id === b)
          if (def) showToast('BADGE UNLOCKED!', def.name, '🏅')
        }
      }, 1400)
      return newBadges
    },
    [showToast],
  )

  const nextLevelId = useMemo(() => {
    const idx = LEVELS.findIndex((l) => l.id === levelId)
    return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1].id : null
  }, [levelId])

  return (
    <div className="h-screen w-screen overflow-hidden bg-space-bg text-ink-hi flex flex-col">
      {screen === 'title' && (
        <TitleScreen
          hasProgress={progress.completed.length > 0}
          onStart={() => {
            setLevelId(LEVELS[0].id)
            setScreen('level')
          }}
          onContinue={() => {
            // first uncompleted level, else map
            const next = LEVELS.find((l) => !progress.completed.includes(l.id))
            if (next) {
              setLevelId(next.id)
              setScreen('level')
            } else {
              setScreen('map')
            }
          }}
          onProfile={() => setScreen('profile')}
          soundOn={progress.soundOn}
          onToggleSound={toggleSound}
        />
      )}

      {screen === 'map' && (
        <WorldMap
          levels={LEVELS}
          progress={progress}
          onPlay={(id) => {
            setLevelId(id)
            setScreen('level')
          }}
          onProfile={() => setScreen('profile')}
          onTitle={() => setScreen('title')}
        />
      )}

      {screen === 'level' && levelId && (
        <LevelScreen
          key={levelId}
          levelId={levelId}
          progress={progress}
          onWin={handleWin}
          hasNext={nextLevelId !== null}
          onNext={() => {
            if (nextLevelId) {
              setLevelId(nextLevelId)
            } else {
              setScreen('map')
            }
          }}
          onExit={() => setScreen('map')}
          soundOn={progress.soundOn}
          onToggleSound={toggleSound}
          onSettings={() => setSettingsOpen(true)}
        />
      )}

      {screen === 'profile' && (
        <BadgeGrid
          progress={progress}
          levelsCount={LEVELS.length}
          completedCount={progress.completed.length}
          onBack={() => setScreen('map')}
          onResetAll={() => {
            if (confirm('Pakka? Sab progress delete ho jayega!')) {
              clearProgress()
              setProgress(defaultProgress())
              setScreen('title')
            }
          }}
        />
      )}

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} soundOn={progress.soundOn} onToggleSound={toggleSound} />

      {/* toast host */}
      <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
      </div>
    </div>
  )
}

/** Inline badge logic (avoids import cycle with achievements.ts). */
function computeBadges(
  p: PlayerProgress,
  completedId: string,
  isBoss: boolean,
  world: number,
  hintsUsed: number,
  lvl: (typeof LEVELS)[number],
): string[] {
  const unlocked: string[] = []
  const has = (id: string) => p.badges.includes(id)
  const completed = new Set(p.completed)

  if (!has('first-commit') && completed.size >= 1) unlocked.push('first-commit')
  if (!has('conflict-crusher') && (completedId === 'w2l4' || completedId === 'w2boss')) unlocked.push('conflict-crusher')
  if (!has('time-machine') && world === 3) unlocked.push('time-machine')
  if (!has('boss-slayer') && isBoss) unlocked.push('boss-slayer')
  if (!has('cloud-walker') && world === 4) unlocked.push('cloud-walker')
  if (!has('no-hints-world1') && hintsUsed === 0 && lvl.world === 1) {
    const w1 = LEVELS.filter((l) => l.world === 1)
    if (w1.every((l) => completed.has(l.id))) unlocked.push('no-hints-world1')
  }
  if (!has('streak-3') && p.streak >= 3) unlocked.push('streak-3')
  if (!has('perfect-world')) {
    for (let w = 1; w <= 4; w++) {
      const wl = LEVELS.filter((l) => l.world === w)
      if (wl.length && wl.every((l) => (p.stars[l.id] ?? 0) >= 3)) {
        unlocked.push('perfect-world')
        break
      }
    }
  }
  return unlocked
}
