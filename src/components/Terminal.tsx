import { useEffect, useRef, useState } from 'react'
import type { CommandResult } from '../git/types'
import { sfx } from '../game/sound'

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
}

/** Retro CRT terminal: history (↑/↓), Tab completion, scanlines, glow. */
export function Terminal({ lines, onCommand, onReset, commands, branches }: Props) {
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
      const t = setTimeout(() => setFlash(''), 600)
      return () => clearTimeout(t)
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
    const result = onCommand(cmd)
    if (result.kind === 'error') {
      setFlash('err')
      sfx.error()
    } else if (result.kind === 'success') {
      setFlash('ok')
      sfx.success()
    }
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
    } else {
      sfx.key()
    }
  }

  return (
    <div
      className={`scanlines relative h-full flex flex-col bg-space-bg/95 border rounded-xl overflow-hidden transition-shadow duration-300
        ${flash === 'ok' ? 'border-neon-green shadow-[0_0_22px_rgba(52,211,153,.5)]' : ''}
        ${flash === 'err' ? 'border-danger shadow-[0_0_22px_rgba(248,113,113,.5)] anim-shake' : ''}
        ${!flash ? 'border-space-border' : ''}`}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-space-panel border-b border-space-border">
        <span className="w-3 h-3 rounded-full bg-danger/80" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-gold/80" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-neon-green/80" aria-hidden="true" />
        <span className="ml-2 font-display text-[8px] text-ink-mid tracking-widest">TIME TERMINAL v1.0</span>
        <button
          onClick={onReset}
          className="focus-neon ml-auto font-display text-[7px] text-danger border border-danger/50 rounded px-2 py-1 hover:bg-danger/10"
          title="Restart this level"
        >
          ⟲ RESET
        </button>
      </div>
      {/* output */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-[13px] leading-relaxed" aria-live="polite">
        {lines.map((l) => (
          <div
            key={l.id}
            className={`anim-line whitespace-pre-wrap break-words ${
              l.kind === 'input'
                ? 'text-neon-cyan'
                : l.kind === 'error'
                  ? 'text-danger'
                  : l.kind === 'success'
                    ? 'text-neon-green'
                    : 'text-ink-hi'
            }`}
          >
            {l.kind === 'input' ? <span className="text-gold">$ </span> : null}
            {l.text}
          </div>
        ))}
      </div>
      {/* input */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-space-border font-mono text-[13px]">
        <span className="text-gold">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          className="flex-1 bg-transparent outline-none text-ink-hi caret-[#22d3ee]"
          placeholder="git status"
          aria-label="terminal input"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="anim-caret text-neon-cyan" aria-hidden="true">▊</span>
      </div>
    </div>
  )
}
