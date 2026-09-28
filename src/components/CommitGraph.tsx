import { useMemo } from 'react'
import type { Repo } from '../git/types'
import { logWalk } from '../git/repo'

interface Props {
  repo: Repo
  accent: string
}

interface Node {
  id: string
  message: string
  x: number
  y: number
  col: number
  parents: string[]
  isNew?: boolean
}

/**
 * Lanes commits into columns (simple: first parent stays on its lane,
 * merges get a new lane). Renders SVG circles + connecting lines.
 */
export function CommitGraph({ repo, accent }: Props) {
  const { nodes, edges, headId } = useMemo(() => {
    const headId = repo.head.kind === 'branch' ? repo.branches[repo.head.name]?.head ?? '' : repo.head.id
    const ordered = headId ? logWalk(repo, headId).slice().reverse() : [] // oldest first
    const laneOf = new Map<string, number>()
    const nodes: Node[] = []
    ordered.forEach((c, i) => {
      // inherit lane from first parent if possible
      let col = laneOf.get(c.parents[0] ?? '')
      if (col === undefined) {
        col = new Set(nodes.map((n) => n.col)).size
        // try to reuse a free lane
        const used = new Set(nodes.map((n) => n.col))
        for (let k = 0; k <= used.size; k++) {
          if (!used.has(k)) {
            col = k
            break
          }
        }
      }
      laneOf.set(c.id, col)
      nodes.push({ id: c.id, message: c.message, x: 26 + col * 34, y: 20 + i * 44, col, parents: c.parents })
    })
    const edges: Array<{ x1: number; y1: number; x2: number; y2: number; merge: boolean }> = []
    for (const n of nodes) {
      for (const p of n.parents) {
        const pn = nodes.find((x) => x.id === p)
        if (pn) edges.push({ x1: pn.x, y1: pn.y, x2: n.x, y2: n.y, merge: n.parents.length > 1 && p !== n.parents[0] })
      }
    }
    return { nodes, edges, headId }
  }, [repo])

  if (nodes.length === 0) {
    return (
      <p className="text-xs text-ink-mid font-mono py-4 text-center">
        Abhi koi commit nahi. Pehla commit banao — timeline yahan dikhegi!
      </p>
    )
  }

  const W = 26 + Math.max(...nodes.map((n) => n.col)) * 34 + 26
  const H = 20 + nodes.length * 44

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="commit graph">
      {/* edges */}
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={e.merge ? accent : '#334155'}
          strokeWidth={e.merge ? 2.4 : 1.6}
          className={e.merge ? 'anim-line' : undefined}
        />
      ))}
      {/* branch labels */}
      {Object.values(repo.branches).map((b) => {
        const n = nodes.find((x) => x.id === b.head)
        if (!n) return null
        const isHead = repo.head.kind === 'branch' && repo.head.name === b.name
        return (
          <g key={b.name}>
            <rect x={n.x + 10} y={n.y - 9} width={b.name.length * 7 + 12} height={18} rx={9} fill="#182543" stroke={isHead ? accent : '#475569'} />
            <text x={n.x + 16} y={n.y + 4} fontSize="10" fill={isHead ? accent : '#94a3b8'} fontFamily="monospace">
              {b.name}
            </text>
          </g>
        )
      })}
      {/* commits */}
      {nodes.map((n, i) => {
        const isHead = n.id === headId
        return (
          <g key={n.id} className={i === nodes.length - 1 ? 'anim-pop' : undefined}>
            {isHead && <circle cx={n.x} cy={n.y} r={14} fill="none" stroke={accent} strokeWidth="1.5" className="anim-glow" style={{ color: accent }} />}
            <circle cx={n.x} cy={n.y} r={9} fill={n.parents.length > 1 ? accent : '#182543'} stroke={accent} strokeWidth="2.5" />
            {n.parents.length > 1 && <circle cx={n.x} cy={n.y} r={3.5} fill="#0b0f1a" />}
            <title>{n.message}</title>
          </g>
        )
      })}
      {repo.head.kind === 'branch' && (
        <text x={4} y={H - 4} fontSize="9" fill={accent} fontFamily="monospace" className="anim-glow" style={{ color: accent }}>
          HEAD → {repo.head.name}
        </text>
      )}
    </svg>
  )
}
