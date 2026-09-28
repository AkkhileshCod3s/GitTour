import { useMemo, useRef, useState, useEffect } from 'react'
import { LEVELS } from '../levels/levels'
import { WORLDS } from '../levels/worlds'
import { checkGoal } from '../levels/checker'
import { starRating, xpForLevel } from '../levels/scoring'
import { emptyRepo } from '../git/repo'
import type { Repo, GitContext, CommandResult } from '../git/types'
import { registry } from '../git/registry'
import { HUD } from '../components/HUD'
import { StoryCard } from '../components/StoryCard'
import { Terminal, type TerminalLine } from '../components/Terminal'
import { CommitGraph } from '../components/CommitGraph'
import { AreasPanel } from '../components/AreasPanel'
import { Panel } from '../ui/Panel'
import { BossIntro } from './BossIntro'
import { LevelComplete } from './LevelComplete'
import type { PlayerProgress } from '../game/progress'
import { sfx } from '../game/sound'

let uid = 1

interface Props {
  levelId: string
  progress: PlayerProgress
  onWin: (levelId: string, stars: number, xp: number, hintsUsed: number) => string[] // returns new badge ids
  onExit: () => void
  onNext: () => void
  hasNext: boolean
  soundOn: boolean
  onToggleSound: () => void
  onSettings: () => void
}

export function LevelScreen({ levelId, progress, onWin, onExit, onNext, hasNext, soundOn, onToggleSound, onSettings }: Props) {
  const level = LEVELS.find((l) => l.id === levelId) ?? LEVELS[0]
  const world = WORLDS.find((w) => w.id === level.world) ?? WORLDS[0]

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

  // (re)build level state
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
      { id: uid++, kind: 'info', text: '⏳ Timeline load ho gayi. Terminal tumhara intezaar kar raha hai...' },
      { id: uid++, kind: 'info', text: `Task: ${level.task}` },
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
      ...result.lines.map((t) => ({ id: uid++, kind: kind as TerminalLine['kind'], text: t })),
    ])
    setMood(result.kind === 'error' ? 'worried' : result.kind === 'success' ? 'happy' : 'thinking')
    setCmdCount((c) => c + 1)
    setTimeout(() => setMood('idle'), 1800)

    // win check (state-based)
    if (!wonRef.current && checkGoal(level, repoRef.current, ctxRef.current)) {
      wonRef.current = true
      const stars = starRating(level, cmdCount + 1, hintsUsed)
      const xp = xpForLevel(level, stars)
      const badges = onWin(level.id, stars, xp, hintsUsed)
      setWon({ stars, xp, badges })
      sfx.levelComplete()
    }
    return result
  }

  function useHint(): void {
    if (hintsUsed >= level.hints.length) return
    setMood('thinking')
    setHintsUsed((h) => h + 1)
    const hint = level.hints[hintsUsed]
    setLines((ls) => [...ls, { id: uid++, kind: 'info', text: `💡 HINT ${hintsUsed + 1}: ${hint}` }])
    setTimeout(() => setMood('idle'), 1800)
  }

  const bossSeen = useRef(false)
  if (level.isBoss && !bossSeen.current) {
    // BossIntro is shown via state; mark seen after it closes
  }

  // Repo is built in useEffect (after first paint) — never read repoRef.current
  // during render unless `ready` is true. Safe fallbacks everywhere.
  const repo = ready ? repoRef.current : null
  const branchNames = useMemo(() => Object.keys(repo?.branches ?? {}), [repo, cmdCount])

  return (
    <div className="h-full flex flex-col">
      {showBossIntro && (
        <BossIntro
          title={level.title}
          accent={world.accent}
          onDone={() => setShowBossIntro(false)}
        />
      )}
      <HUD
        worldName={`${world.name}`}
        levelTitle={level.title}
        accent={world.accent}
        progress={progress}
        soundOn={soundOn}
        onToggleSound={onToggleSound}
        onSettings={onSettings}
      />
      <main className="flex-1 min-h-0 p-3 grid gap-3 grid-cols-1 lg:grid-cols-[300px_1fr_340px]">
        {/* left: story/task (mobile: tab) */}
        <div className="min-h-0 lg:overflow-y-auto order-2 lg:order-1">
          <Panel accent={world.accent} className="h-full">
            <StoryCard
              mood={mood}
              accent={world.accent}
              story={level.storyHinglish}
              explanation={level.explanationHinglish}
              task={level.task}
              onHint={useHint}
              hintsLeft={level.hints.length - hintsUsed}
            />
          </Panel>
        </div>
        {/* center: terminal (render only once repo state exists) */}
        <div className="min-h-[320px] lg:min-h-0 order-1 lg:order-2">
          {repo ? (
            <Terminal
              lines={lines}
              onCommand={runCommand}
              onReset={() => setRunKey((k) => k + 1)}
              commands={cmdNames}
              branches={branchNames}
            />
          ) : (
            <div className="scanlines relative h-full min-h-[320px] bg-space-bg/95 border border-space-border rounded-xl flex items-center justify-center">
              <p className="font-mono text-xs text-ink-mid anim-glow text-neon-cyan">⏳ Timeline load ho rahi hai...</p>
            </div>
          )}
        </div>
        {/* right: graph + areas */}
        <div className="min-h-0 lg:overflow-y-auto space-y-3 order-3">
          <Panel title="⏳ COMMIT GRAPH" accent={world.accent}>
            {repo ? <CommitGraph repo={repo} accent={world.accent} /> : <p className="text-xs text-ink-low font-mono text-center py-4">Loading...</p>}
          </Panel>
          <Panel title="📦 FILE AREAS" accent={world.accent}>
            {repo ? <AreasPanel repo={repo} /> : <p className="text-xs text-ink-low font-mono text-center py-4">Loading...</p>}
          </Panel>
        </div>
      </main>
      {won && (
        <LevelComplete
          level={level}
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
        />
      )}
    </div>
  )
}
