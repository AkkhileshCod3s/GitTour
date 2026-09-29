type Mood = 'idle' | 'happy' | 'worried' | 'thinking'

/**
 * "TRAV" — original pixel-art time traveler (16x16 grid, rendered crisp via SVG).
 * Palette: black, lime green, white, grey, one skin tone. One design app-wide.
 */
export function Mascot({ mood = 'idle', size = 96 }: { mood?: Mood; size?: number }) {
  const B = '#0A0A0A' // black
  const Y = '#B6F13A' // lime
  const W = '#F5F5F2' // white
  const G = '#8A8A96' // grey
  const S = '#E8B98A' // skin

  // Each mood: mouth row + arm/goggle variation drawn over the same base body.
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" role="img" aria-label={`Time traveler, ${mood}`} style={{ imageRendering: 'pixelated' }} shapeRendering="crispEdges">
      {/* cape (left side, behind body) */}
      <rect x="2" y="6" width="1" height="6" fill={B} />
      <rect x="3" y="6" width="1" height="5" fill={Y} />
      {/* head */}
      <rect x="5" y="1" width="6" height="5" fill={S} />
      {/* hair */}
      <rect x="5" y="1" width="6" height="1" fill={B} />
      {/* goggles strap + lens */}
      <rect x="4" y="3" width="8" height="1" fill={B} />
      <rect x="6" y="2" width="4" height="2" fill={Y} />
      <rect x="7" y="2" width="1" height="1" fill={B} />
      {/* eyes */}
      {mood === 'happy' ? (
        <>
          <rect x="6" y="4" width="1" height="1" fill={B} />
          <rect x="9" y="4" width="1" height="1" fill={B} />
        </>
      ) : (
        <>
          <rect x="6" y="4" width="1" height="1" fill={B} />
          <rect x="9" y="4" width="1" height="1" fill={B} />
        </>
      )}
      {/* mouth by mood */}
      {mood === 'happy' && <rect x="7" y="5" width="2" height="1" fill={B} />}
      {mood === 'worried' && (
        <>
          <rect x="7" y="5" width="2" height="1" fill={B} />
          <rect x="8" y="6" width="1" height="1" fill={B} />
        </>
      )}
      {(mood === 'idle' || mood === 'thinking') && <rect x="7" y="5" width="2" height="1" fill={B} />}
      {/* body: long coat */}
      <rect x="5" y="6" width="6" height="6" fill={B} />
      <rect x="6" y="6" width="1" height="5" fill={Y} />
      <rect x="9" y="6" width="1" height="5" fill={Y} />
      {/* arms by mood */}
      {mood === 'thinking' ? (
        // arm raised to chin
        <>
          <rect x="4" y="7" width="1" height="2" fill={B} />
          <rect x="10" y="6" width="1" height="2" fill={B} />
        </>
      ) : mood === 'happy' ? (
        // both arms up
        <>
          <rect x="4" y="5" width="1" height="2" fill={B} />
          <rect x="11" y="5" width="1" height="2" fill={B} />
        </>
      ) : (
        <>
          <rect x="4" y="7" width="1" height="3" fill={B} />
          <rect x="11" y="7" width="1" height="3" fill={B} />
        </>
      )}
      {/* legs */}
      <rect x="6" y="12" width="1" height="2" fill={B} />
      <rect x="9" y="12" width="1" height="2" fill={B} />
      {/* boots */}
      <rect x="5" y="14" width="2" height="1" fill={G} />
      <rect x="9" y="14" width="2" height="1" fill={G} />
      {/* glowing clock held in idle/worried hand */}
      {mood !== 'happy' && (
        <>
          <rect x="12" y="9" width="2" height="2" fill={Y} />
          <rect x="12" y="9" width="1" height="1" fill={W} />
        </>
      )}
      {/* sparkles for happy */}
      {mood === 'happy' && (
        <>
          <rect x="2" y="2" width="1" height="1" fill={Y} />
          <rect x="13" y="3" width="1" height="1" fill={Y} />
          <rect x="13" y="8" width="1" height="1" fill={W} />
        </>
      )}
    </svg>
  )
}
