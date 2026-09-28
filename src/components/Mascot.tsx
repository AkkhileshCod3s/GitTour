type Mood = 'idle' | 'happy' | 'worried' | 'thinking'

/** Original "Tick-Tock" the time robot — inline SVG, no copyrighted art. */
export function Mascot({ mood = 'idle', size = 72 }: { mood?: Mood; size?: number }) {
  const eyeColor = mood === 'worried' ? '#f87171' : '#22d3ee'
  const mouth =
    mood === 'happy'
      ? 'M20 34 Q28 42 36 34' // smile
      : mood === 'worried'
        ? 'M22 38 Q28 33 34 38' // frown
        : 'M22 36 H34' // flat
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      role="img"
      aria-label={`Mascot robot, ${mood}`}
      className={mood === 'happy' ? 'anim-float' : undefined}
    >
      {/* antenna */}
      <line x1="28" y1="4" x2="28" y2="10" stroke="#e879f9" strokeWidth="2" className="anim-glow" style={{ color: '#e879f9' }} />
      <circle cx="28" cy="4" r="3" fill="#e879f9" />
      {/* head */}
      <rect x="10" y="10" width="36" height="30" rx="8" fill="#182543" stroke="#22d3ee" strokeWidth="2" />
      {/* clock screen */}
      <circle cx="28" cy="21" r="8" fill="#0b0f1a" stroke={eyeColor} strokeWidth="1.5" />
      <line x1="28" y1="21" x2="28" y2="16" stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="21" x2="32" y2="23" stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
      {/* mouth */}
      <path d={mouth} fill="none" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" />
      {/* ears */}
      <rect x="6" y="20" width="4" height="10" rx="2" fill="#22d3ee" />
      <rect x="46" y="20" width="4" height="10" rx="2" fill="#22d3ee" />
      {/* body */}
      <rect x="16" y="42" width="24" height="12" rx="5" fill="#182543" stroke="#22d3ee" strokeWidth="2" />
      <circle cx="24" cy="48" r="2" fill="#fbbf24" />
      <circle cx="32" cy="48" r="2" fill="#34d399" />
    </svg>
  )
}
