import { Mascot } from './Mascot'
import { IconBulb, IconBook, IconTarget } from '../ui/Icons'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'

interface Props {
  mood: 'idle' | 'happy' | 'worried' | 'thinking'
  story: string
  explanation: string
  task: string
  onHint: () => void
  hintsLeft: number
  lang: Lang
}

export function StoryCard({ mood, story, explanation, task, onHint, hintsLeft, lang }: Props) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-2 items-start">
        <div className="shrink-0">
          <Mascot mood={mood} size={64} />
        </div>
        <div className="relative bg-brut-shade border-3 border-theme rounded-brut p-3 text-sm leading-relaxed text-brut-ink flex-1 shadow-brut-xs" style={{ color: 'rgb(var(--ink-hi))' }}>
          <span
            className="absolute -left-[13px] top-4 w-4 h-4 bg-brut-shade border-l-3 border-b-3 border-theme rotate-45"
            aria-hidden="true"
          />
          <p>{story}</p>
        </div>
      </div>
      <div className="bg-brut-panel border-3 border-theme rounded-brut p-3 space-y-2 shadow-brut-xs">
        <p className="flex items-center gap-1.5 font-display text-sm text-lime">
          <IconBook size={14} />
          {t(STRINGS.level.learn, lang)}
        </p>
        <p className="text-sm text-ink-mid leading-relaxed">{explanation}</p>
      </div>
      <div className="border-3 border-lime rounded-brut p-3 shadow-brut-xs bg-brut-panel">
        <p className="flex items-center gap-1.5 font-display text-sm mb-1 text-lime">
          <IconTarget size={14} />
          {t(STRINGS.level.task, lang)}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--ink-hi))' }}>{task}</p>
      </div>
      <button
        onClick={onHint}
        disabled={hintsLeft === 0}
        className="focus-neon press-snap mt-auto self-start font-display text-sm text-brut-ink bg-lime border-3 border-theme rounded-brut px-4 py-2 shadow-brut-xs disabled:opacity-40 disabled:shadow-none"
      >
        <IconBulb size={14} className="shrink-0" />
        {t(STRINGS.level.hintBtn, lang)} ({hintsLeft} {t(STRINGS.level.hintLeft, lang)}) — {t(STRINGS.level.hintStars, lang)}
      </button>
    </div>
  )
}
