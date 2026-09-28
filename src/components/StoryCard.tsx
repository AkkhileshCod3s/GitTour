import { Mascot } from './Mascot'

interface Props {
  mood: 'idle' | 'happy' | 'worried' | 'thinking'
  accent: string
  story: string
  explanation: string
  task: string
  onHint: () => void
  hintsLeft: number
}

export function StoryCard({ mood, accent, story, explanation, task, onHint, hintsLeft }: Props) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-2 items-start">
        <div className="shrink-0">
          <Mascot mood={mood} size={64} />
        </div>
        <div
          className="relative bg-space-panel border rounded-xl p-3 text-xs leading-relaxed text-ink-hi flex-1"
          style={{ borderColor: accent + '55' }}
        >
          {/* speech bubble tail */}
          <span
            className="absolute -left-[7px] top-4 w-3 h-3 bg-space-panel border-l border-b rotate-45"
            style={{ borderColor: accent + '55' }}
            aria-hidden="true"
          />
          <p>{story}</p>
        </div>
      </div>
      <div className="bg-space-panel/60 border border-space-border rounded-xl p-3 space-y-2">
        <p className="text-[8px] font-display tracking-wider text-gold">⚙ LEARN (SEEKHO)</p>
        <p className="text-xs text-ink-mid leading-relaxed">{explanation}</p>
      </div>
      <div
        className="bg-space-panel/60 border rounded-xl p-3"
        style={{ borderColor: accent + '44' }}
      >
        <p className="text-[8px] font-display tracking-wider mb-1" style={{ color: accent }}>
          🎯 TASK
        </p>
        <p className="text-xs text-ink-hi leading-relaxed">{task}</p>
      </div>
      <button
        onClick={onHint}
        disabled={hintsLeft === 0}
        className="focus-neon mt-auto self-start font-display text-[8px] text-gold border border-gold/50 rounded-md px-3 py-2 hover:bg-gold/10 disabled:opacity-40"
      >
        💡 HINT ({hintsLeft} left) — stars kam honge!
      </button>
    </div>
  )
}
