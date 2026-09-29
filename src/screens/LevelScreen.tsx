import { useMemo, useRef, useState, useEffect } from 'react'
import { LEVELS } from '../levels/levels'
import { WORLDS } from '../levels/worlds'
import { checkGoal } from '../levels/checker'
import { starRating, xpForLevel } from '../levels/scoring'
import { emptyRepo } from '../git/repo'
import type { Repo, GitContext, CommandResult } from '../git/types'
import { registry } from '../git/registry'
import { IconFlame, IconHome, IconMap, IconStarFilled } from '../ui/Icons'
import { StoryCard } from '../components/StoryCard'
import { Terminal, type TerminalLine } from '../components/Terminal'
import { CommitGraph } from '../components/CommitGraph'
import { AreasPanel } from '../components/AreasPanel'
import { Panel } from '../ui/Panel'
import { BossIntro } from './BossIntro'
import { LevelComplete } from './LevelComplete'
import type { PlayerProgress } from '../game/progress'
import { totalStars } from '../game/progress'
import { t, STRINGS } from '../i18n/strings'
import { LEVEL_TEXT_EN } from '../i18n/levels.en'
import type { Lang } from '../storage'

let uid = 1

interface Props {
  levelId: string
  progress: PlayerProgress
  lang: Lang
  onWin: (levelId: string, stars: number, xp: number, hintsUsed: number) => string[]
  onExit: () => void
  onHome: () => void
  onNext: () => void
  hasNext: boolean
}

const WORLD_ACCENT: Record<number, string> = { 1: 'rgb(var(--lime))', 2: 'rgb(var(--lime))', 3: 'rgb(var(--lime))', 4: 'rgb(var(--danger))' }

export function LevelScreen({ levelId, progress, lang, onWin, onExit, onHome, onNext, hasNext }: Props) {
  const level = LEVELS.find((l) => l.id === levelId) ?? LEVELS[0]
  const world = WORLDS.find((w) => w.id === level.world) ?? WORLDS[0]
  const en = LEVEL_TEXT_EN[level.id]
  const accent = WORLD_ACCENT[level.world] ?? 'rgb(var(--lime))'

  const title = lang === 'english' && en?.title ? en.title : level.title
  const story = lang === 'english' && en ? en.story : level.storyHinglish
  const explanation = lang === 'english' && en ? en.explanation : level.explanationHinglish
  const task = lang === 'english' && en ? en.task : level.task
  const hints = lang === 'english' && en?.hints && en.hints.length > 0 ? en.hints : level.hints

  const [runKey, setRunKey] = useState(0)
  const [mood, setMood] = useState<'idle' | 'happy' | 'worried' | 'thinking'>('idle')
  const [hintsUsed, setHintsUsed] = useState(0)
  const [won, setWon] = useState<null | { stars: number; xp: number; badges: string[] }>(null)
  const [showBossIntro, setShowBossIntro] = useState(level.isBoss)
  const [cmdCount, setCmdCount] = useState(0)
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [ready, setReady] = useState(false)

  const repoRef = useRef<Repo>(null as unknown as Repo)
  const ctxRef = useRef<GitContext>(null as unknown as GitContext)
  const wonRef = useRef(false)

  const resetLevel = (): void => {
    const repo: Repo = { ...emptyRepo('level'), ...(JSON.parse(JSON.stringify(level.startState.repo)) as Partial<Repo>) } as Repo
    repoRef.current = repo
    ctxRef.current = { repo, cwd: '' }
    wonRef.current = false
    setHintsUsed(0)
    setCmdCount(0)
    setWon(null)
    setMood('idle')
    setShowBossIntro(level.isBoss)
    setLines([
      { id: uid++, kind: 'info', text: t(STRINGS.level.welcome, lang) },
      { id: uid++, kind: 'info', text: `${t(STRINGS.level.taskPrefix, lang)}${task}` },
    ])
    setReady(true)
  }
  useEffect(resetLevel, [runKey, levelId])

  const cmdNames = useMemo(() => [...new Set(registry.names())], [])

  function runCommand(input: string): CommandResult {
    const result = registry.run(input, ctxRef.current)
    const kind = result.kind === 'error' ? 'error' : result.kind === 'success' ? 'success' : 'info'
    setLines((ls) => [
      ...ls,
      { id: uid++, kind: 'input' as const, text: input },
      ...result.lines.map((txt) => ({ id: uid++, kind: kind as TerminalLine['kind'], text: txt })),
    ])
    setMood(result.kind === 'error' ? 'worried' : result.kind === 'success' ? 'happy' : 'thinking')
    setCmdCount((c) => c + 1)
    setTimeout(() => setMood('idle'), 1800)

    if (!wonRef.current && checkGoal(level, repoRef.current, ctxRef.current)) {
      wonRef.current = true
      const stars = starRating(level, cmdCount + 1, hintsUsed)
      const xp = xpForLevel(level, stars)
      const badges = onWin(level.id, stars, xp, hintsUsed)
      setWon({ stars, xp, badges })
    }
    return result
  }

  function useHint(): void {
    if (hintsUsed >= hints.length) return
    setMood('thinking')
    setHintsUsed((h) => h + 1)
    const hint = hints[hintsUsed]
    setLines((ls) => [...ls, { id: uid++, kind: 'info', text: `HINT ${hintsUsed + 1}: ${hint}` }])
    setTimeout(() => setMood('idle'), 1800)
  }

  const repo = ready ? repoRef.current : null
  const branchNames = useMemo(() => Object.keys(repo?.branches ?? {}), [repo, cmdCount])

  return (
    <div className="h-full flex flex-col">
      {showBossIntro && <BossIntro title={title} accent={accent} lang={lang} onDone={() => setShowBossIntro(false)} />}

      {/* in-level HUD: single Back-to-Home + single Map; global actions live in NavBar */}
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 bg-brut-panel border-b-3 border-theme">
        <button
          onClick={onHome}
          className="focus-neon press-snap flex items-center gap-1.5 bg-brut-panel text-lime border-3 border-lime rounded-brut shadow-brut-sm px-3 py-1.5 font-display text-xs"
          aria-label={t(STRINGS.hud.home, lang)}
          title={t(STRINGS.hud.home, lang)}
        >
          <IconHome size={14} />
          <span className="hidden sm:inline">{t(STRINGS.hud.home, lang).toUpperCase()}</span>
        </button>
        <button
          onClick={onExit}
          className="focus-neon press-snap flex items-center gap-1.5 bg-brut-panel text-ink-hi border-3 border-theme rounded-brut shadow-brut-sm px-3 py-1.5 font-display text-xs"
          aria-label={t(STRINGS.hud.closeMap, lang)}
          title={t(STRINGS.hud.closeMap, lang)}
        >
          <IconMap size={14} />
          <span className="hidden sm:inline">{t(STRINGS.hud.map, lang)}</span>
        </button>
        <div className="min-w-0">
          <p className="font-display text-xs truncate max-w-[180px]" style={{ color: accent }}>{world.name}</p>
          <h1 className="font-display text-sm truncate max-w-[240px] text-brut-ink" style={{ color: 'rgb(var(--ink-hi))' }} title={title}>{title}</h1>
        </div>
        <div className="flex items-center gap-1 ml-auto" title={t(STRINGS.hud.stars, lang)}>
          <IconStarFilled size={14} className="text-lime" />
          <span className="font-bold text-sm text-lime">{totalStars(progress)}</span>
        </div>
        <div className="flex items-center gap-1" title={t(STRINGS.hud.streak, lang)}>
          <IconFlame size={14} className="text-lime" />
          <span className="font-bold text-sm text-lime">{progress.streak}</span>
        </div>
      </header>

      <main className="flex-1 min-h-0 p-3 md:p-4 grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* left: story/task */}
        <div className="min-h-0 lg:overflow-y-auto order-2 lg:order-1">
          <Panel accent={accent} className="h-full">
            <StoryCard
              mood={mood}
              story={story}
              explanation={explanation}
              task={task}
              onHint={useHint}
              hintsLeft={hints.length - hintsUsed}
              lang={lang}
            />
          </Panel>
        </div>
        {/* center: terminal */}
        <div className="min-h-[280px] lg:min-h-0 order-1 lg:order-2">
          {repo ? (
            <Terminal
              lines={lines}
              onCommand={runCommand}
              onReset={() => setRunKey((k) => k + 1)}
              commands={cmdNames}
              branches={branchNames}
              lang={lang}
            />
          ) : (
            <div className="h-full min-h-[280px] bg-brut-panel border-4 border-theme rounded-brut shadow-brut flex items-center justify-center">
              <p className="font-bold text-ink-mid">{t(STRINGS.level.loading, lang)}</p>
            </div>
          )}
        </div>
        {/* right: graph + areas */}
        <div className="min-h-0 lg:overflow-y-auto space-y-4 order-3">
          <Panel title={t(STRINGS.level.commitGraph, lang)} accent={accent}>
            {repo ? <CommitGraph repo={repo} accent={accent} lang={lang} /> : <p className="text-sm font-bold text-ink-low text-center py-4">...</p>}
          </Panel>
          <Panel title={t(STRINGS.level.fileAreas, lang)} accent={accent}>
            {repo ? <AreasPanel repo={repo} lang={lang} /> : <p className="text-sm font-bold text-ink-low text-center py-4">...</p>}
          </Panel>
        </div>
      </main>

      {won && (
        <LevelComplete
          level={{ ...level, title }}
          explanation={explanation}
          stars={won.stars}
          xp={won.xp}
          badges={won.badges}
          hasNext={hasNext}
          onNext={onNext}
          onRetry={() => {
            setWon(null)
            setRunKey((k) => k + 1)
          }}
          onExit={onExit}
          lang={lang}
        />
      )}
    </div>
  )
}
