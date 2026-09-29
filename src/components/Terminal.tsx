import { useEffect, useRef, useState } from 'react'
import type { CommandResult } from '../git/types'
import { IconRetry } from '../ui/Icons'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'

export interface TerminalLine {
  text: string
  kind: 'input' | 'info' | 'error' | 'success'
  id: number
}

interface Props {
  lines: TerminalLine[]
  onCommand: (input: string) => CommandResult
  onReset: () => void
  commands: string[]
  branches: string[]
  lang: Lang
}

/** Terminal: charcoal body, yellow title bar, mono text. */
export function Terminal({ lines, onCommand, onReset, commands, branches, lang }: Props) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [flash, setFlash] = useState<'' | 'ok' | 'err'>('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    if (flash) {
      const t2 = setTimeout(() => setFlash(''), 600)
      return () => clearTimeout(t2)
    }
  }, [flash])

  function complete(): void {
    const parts = input.split(' ')
    const last = parts[parts.length - 1].toLowerCase()
    if (!last) return
    const pool = parts.length <= 2 && parts[0] === 'git' ? commands : [...branches, ...commands]
    const hit = pool.find((c) => c.startsWith(last) && c !== last)
    if (hit) {
      parts[parts.length - 1] = hit
      setInput(parts.join(' '))
    }
  }

  function submit(): void {
    const cmd = input.trim()
    if (!cmd) return
    setHistory((h) => [cmd, ...h].slice(0, 50))
    setHistIdx(-1)
    setInput('')
    onCommand(cmd)
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      complete()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      if (history[next]) {
        setHistIdx(next)
        setInput(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) {
        setHistIdx(-1)
        setInput('')
      } else {
        setHistIdx(next)
        setInput(history[next])
      }
    }
  }

  return (
    <div
      className={`h-full flex flex-col bg-brut-panel border-4 border-lime rounded-brut overflow-hidden shadow-brut
        ${flash === 'ok' ? 'outline outline-4' : ''}
        ${flash === 'err' ? 'outline outline-4 anim-shake' : ''}
      `}
      style={flash === 'ok' ? { outlineColor: 'rgb(var(--lime))' } : flash === 'err' ? { outlineColor: 'rgb(var(--danger))' } : undefined}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-lime border-b-3 border-theme shrink-0">
        <span className="w-3.5 h-3.5 rounded-full border-2 border-brut-ink" style={{ background: 'rgb(var(--danger))' }} aria-hidden="true" />
        <span className="w-3.5 h-3.5 rounded-full border-2 border-brut-ink bg-brut-panel" aria-hidden="true" />
        <span className="w-3.5 h-3.5 rounded-full border-2 border-brut-ink" style={{ background: 'rgb(var(--lime))' }} aria-hidden="true" />
        <span className="ml-2 font-display text-sm text-brut-ink truncate">{t(STRINGS.level.terminalTitle, lang)}</span>
        <button
          onClick={onReset}
          className="focus-neon press-snap ml-auto font-display text-xs text-brut-ink bg-brut-ink text-lime border-2 border-theme rounded-brut px-3 py-1 shrink-0"
          style={{ backgroundColor: 'rgb(var(--brut-bg))' }}
          title={t(STRINGS.level.restart, lang)}
        >
          <IconRetry size={12} className="inline-block" />
          {' '}
          {t(STRINGS.level.reset, lang)}
        </button>
      </div>
      {/* output */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed" aria-live="polite">
        {lines.map((l) => (
          <div
            key={l.id}
            className={`anim-line whitespace-pre-wrap break-words ${
              l.kind === 'input' ? 'font-bold' : l.kind === 'error' || l.kind === 'success' ? 'font-bold' : ''
            }`}
            style={{
              color:
                l.kind === 'input'
                  ? 'rgb(var(--lime))'
                  : l.kind === 'error'
                    ? 'rgb(var(--danger))'
                    : l.kind === 'success'
                      ? 'rgb(var(--lime))'
                      : 'rgb(var(--ink-hi))',
            }}
          >
            {l.kind === 'input' ? <span style={{ color: 'rgb(var(--ink-low))' }}>{t(STRINGS.terminal.prompt, lang)} </span> : null}
            {l.text}
          </div>
        ))}
      </div>
      {/* input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t-3 border-lime bg-brut-ink font-mono text-[13px] shrink-0" style={{ backgroundColor: 'rgb(var(--brut-bg))' }}>
        <span className="font-bold text-lime">$</span>
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            className="w-full bg-transparent outline-none font-bold min-w-0 text-brut-ink"
            style={{ color: 'rgb(var(--ink-hi))' }}
            placeholder="git status"
            aria-label="terminal input"
            autoComplete="off"
            spellCheck={false}
          />
          {/* inline terminal caret: sits right after the typed text (mono font, so `ch` tracks it), not pinned to the row edge */}
          <span
            className="anim-caret pointer-events-none absolute top-1/2 -translate-y-1/2 h-[1.2em] w-[2px] bg-lime"
            style={{ left: `calc(${input.length}ch)` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
