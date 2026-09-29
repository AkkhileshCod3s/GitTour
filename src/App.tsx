import { useCallback, useEffect, useMemo, useState } from 'react'
import { TitleScreen } from './screens/TitleScreen'
import { WorldMap } from './screens/WorldMap'
import { LevelScreen } from './screens/LevelScreen'
import { BadgeGrid } from './screens/BadgeGrid'
import { SettingsModal } from './screens/SettingsModal'
import { NavBar } from './components/NavBar'
import { LEVELS } from './levels/levels'
import { loadProgress, saveProgress, clearProgress, loadSettings, saveSettings, type AppSettings } from './storage'
import { defaultProgress, touchStreak, type PlayerProgress } from './game/progress'
import { setMuted } from './game/sound'
import { Toast, type ToastData } from './ui/Toast'
import { BADGES } from './game/achievements'
import { t } from './i18n/strings'
import { STRINGS } from './i18n/strings'

type Screen = 'title' | 'map' | 'level' | 'profile'

export default function App() {
  const [screen, setScreen] = useState<Screen>('title')
  const [progress, setProgress] = useState<PlayerProgress>(() => loadProgress())
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())
  const [levelId, setLevelId] = useState<string>('')
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    saveProgress(progress)
    setMuted(true)
  }, [progress])
  useEffect(() => {
    saveSettings(settings)
    document.title = 'Git Tour — Timeline Repair Game'
  }, [settings])

  const showToast = useCallback((title: string, text: string, icon: string) => {
    const id = Date.now() + Math.random()
    setToasts((t2) => [...t2, { id, title, text, icon }])
    setTimeout(() => setToasts((t2) => t2.filter((x) => x.id !== id)), 4200)
  }, [])

  const setLang = useCallback((lang: AppSettings['lang']) => setSettings((s) => ({ ...s, lang })), [])

  const goHome = useCallback(() => setScreen('title'), [])
  const goMap = useCallback(() => setScreen('map'), [])
  const goProfile = useCallback(() => setScreen('profile'), [])
  const openSettings = useCallback(() => setSettingsOpen(true), [])

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
          newBadges = computeBadges(next, id, lvl.isBoss, lvl.world, hintsUsed, lvl)
        }
        next.badges = [...new Set([...p.badges, ...newBadges])]
        return next
      })
      setTimeout(() => {
        for (const b of newBadges) {
          const def = BADGES.find((x) => x.id === b)
          if (def) showToast(t(STRINGS.toast.badgeUnlocked, settings.lang), def.name, 'medal')
        }
      }, 1400)
      return newBadges
    },
    [showToast, settings.lang],
  )

  const nextLevelId = useMemo(() => {
    const idx = LEVELS.findIndex((l) => l.id === levelId)
    return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1].id : null
  }, [levelId])

  return (
    <div className="h-screen w-screen overflow-hidden bg-brut-bg text-ink-hi flex flex-col">
      <NavBar
        screen={screen}
        lang={settings.lang}
        progress={progress}
        onHome={goHome}
        onMap={goMap}
        onProfile={goProfile}
        onSettings={openSettings}
        onLang={setLang}
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* screen-level fade+rise reveal; re-keyed per screen (and per level within
            the level screen) so it replays on every navigation.
            prefers-reduced-motion: animation disabled via CSS (instant appearance). */}
        <div key={screen === 'level' ? `level-${levelId}` : screen} className="anim-screen h-full">
        {screen === 'title' && (
          <TitleScreen
            hasProgress={progress.completed.length > 0}
            progress={progress}
            onStart={() => {
              setLevelId(LEVELS[0].id)
              setScreen('level')
            }}
            onContinue={() => {
              const next = LEVELS.find((l) => !progress.completed.includes(l.id))
              if (next) {
                setLevelId(next.id)
                setScreen('level')
              } else {
                setScreen('map')
              }
            }}
            onOpenMap={goMap}
            lang={settings.lang}
          />
        )}

        {screen === 'map' && (
          <WorldMap
            levels={LEVELS}
            progress={progress}
            lang={settings.lang}
            onPlay={(id) => {
              setLevelId(id)
              setScreen('level')
            }}
          />
        )}

        {screen === 'level' && levelId && (
          <LevelScreen
            key={levelId}
            levelId={levelId}
            progress={progress}
            lang={settings.lang}
            onWin={handleWin}
            hasNext={nextLevelId !== null}
            onNext={() => {
              if (nextLevelId) {
                setLevelId(nextLevelId)
              } else {
                setScreen('map')
              }
            }}
            onExit={goMap}
            onHome={() => {
              if (confirm(t(STRINGS.hud.leaveConfirm, settings.lang))) {
                setScreen('title')
              }
            }}
          />
        )}

        {screen === 'profile' && (
          <BadgeGrid
            progress={progress}
            levelsCount={LEVELS.length}
            completedCount={progress.completed.length}
            lang={settings.lang}
            onResetAll={() => {
              if (confirm(t(STRINGS.profile_confirm.reset, settings.lang))) {
                clearProgress()
                setProgress(defaultProgress())
                setScreen('title')
              }
            }}
          />
        )}
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        lang={settings.lang}
        onLang={setLang}
      />

      {/* toast host */}
      <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((t2) => (
          <Toast key={t2.id} toast={t2} />
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
