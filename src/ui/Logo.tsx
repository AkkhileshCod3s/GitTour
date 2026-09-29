/**
 * "Git Tour" logo: commit-node/branch mark with forward arrow in a badge.
 * Locked palette: lime #B6F13A on black. Shape unchanged from original design.
 */
export function Logo({ size = 28, mode = 'mark' }: { size?: number; mode?: 'mark' | 'lockup' }) {
  const lime = '#B6F13A'
  const black = '#0A0A0A'
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Git Tour logo">
        <rect x="1.5" y="1.5" width="29" height="29" rx="7" fill={black} stroke={lime} strokeWidth="3" />
        <path d="M8 21 C 12 21, 12 11, 16 11" fill="none" stroke={lime} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 11 C 20 11, 20 21, 24 21" fill="none" stroke={lime} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="8" cy="21" r="3.4" fill={lime} stroke={black} strokeWidth="1.5" />
        <circle cx="16" cy="11" r="3.4" fill={lime} stroke={black} strokeWidth="1.5" />
        <path d="M19 21 h3 m-2.5 -2.5 L22.5 21 L19 23.5" fill="none" stroke={lime} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      </svg>
      {mode === 'lockup' && (
        <span className="font-display tracking-tight leading-none" style={{ fontSize: size * 0.62 }}>
          <span style={{ color: '#F5F5F2' }}>GIT</span> <span style={{ color: lime }}>TOUR</span>
        </span>
      )}
    </span>
  )
}
