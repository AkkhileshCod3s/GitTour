interface Props {
  onHint: () => void
  hintsLeft: number
  disabled?: boolean
}

/** Hint reveal button: small hint → bigger hint → full solution. */
export function HintButton({ onHint, hintsLeft, disabled }: Props) {
  return (
    <button
      onClick={onHint}
      disabled={disabled || hintsLeft === 0}
      className="focus-neon font-display text-[8px] text-gold border border-gold/50 rounded-md px-3 py-2 hover:bg-gold/10 hover:shadow-glow-gold disabled:opacity-40 transition-all"
      title="Hints se stars kam honge"
    >
      💡 HINT ({hintsLeft})
    </button>
  )
}
