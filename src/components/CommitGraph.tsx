import { useMemo } from 'react'
import type { Repo } from '../git/types'
import { logWalk } from '../git/repo'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'

interface Props {
  repo: Repo
  accent: string
  lang: Lang
}

interface Node {
  id: string
  message: string
  x: number
  y: number
  col: number
  parents: string[]
}

/** Commit graph: yellow-highlighted nodes, crisp connectors, flag HEAD marker. */
export function CommitGraph({ repo, accent, lang }: Props) {
  const { nodes, edges, headId } = useMemo(() => {
    const headId = repo.head.kind === 'branch' ? repo.branches[repo.head.name]?.head ?? '' : repo.head.id
    const ordered = headId ? logWalk(repo, headId).slice().reverse() : [] // oldest first
    const laneOf = new Map<string, number>()
    const nodes: Node[] = []
    ordered.forEach((c, i) => {
      let col = laneOf.get(c.parents[0] ?? '')
      if (col === undefined) {
        const used = new Set(nodes.map((n) => n.col))
        col = used.size
        for (let k = 0; k <= used.size; k++) {
          if (!used.has(k)) {
            col = k
            break
          }
        }
      }
      laneOf.set(c.id, col)
      nodes.push({ id: c.id, message: c.message, x: 30 + col * 40, y: 24 + i * 46, col, parents: c.parents })
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
      <p className="text-sm text-ink-mid py-4 text-center font-bold">
        {t(STRINGS.level.emptyGraph, lang)}
      </p>
    )
  }

  const W = 30 + Math.max(...nodes.map((n) => n.col)) * 40 + 30
  const H = 24 + nodes.length * 46
  const ink = 'rgb(var(--lime))'
  const panel = 'rgb(var(--brut-panel))'
  const grey = 'rgb(var(--ink-low))'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="commit graph">
      {/* connectors: outer yellow, inner dark for crispness */}
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={e.merge ? ink : grey}
          strokeWidth={e.merge ? 6 : 4.5}
          strokeLinecap="round"
        />
      ))}
      {edges.map((e, i) => (
        <line
          key={`c${i}`}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={panel}
          strokeWidth={e.merge ? 2.5 : 1.5}
          strokeLinecap="round"
        />
      ))}
      {/* branch labels */}
      {Object.values(repo.branches).map((b) => {
        const n = nodes.find((x) => x.id === b.head)
        if (!n) return null
        const isHead = repo.head.kind === 'branch' && repo.head.name === b.name
        return (
          <g key={b.name}>
            <rect x={n.x + 13} y={n.y - 11} width={b.name.length * 7.5 + 14} height={22} rx={6} fill={isHead ? ink : panel} stroke={ink} strokeWidth="2.5" />
            <text x={n.x + 20} y={n.y + 5} fontSize="11" fontWeight="700" fill={isHead ? '#0A0A0A' : ink} fontFamily="inherit">
              {b.name}
            </text>
          </g>
        )
      })}
      {/* commit nodes */}
      {nodes.map((n, i) => {
        const isHead = n.id === headId
        const r = isHead ? 12 : 10
        return (
          <g key={n.id} className={i === nodes.length - 1 ? 'anim-pop' : undefined}>
            <circle cx={n.x + 2} cy={n.y + 2} r={r} fill="#000000" opacity="0.8" />
            <circle cx={n.x} cy={n.y} r={r} fill={n.parents.length > 1 ? accent : panel} stroke={ink} strokeWidth="3" />
            {n.parents.length > 1 && <circle cx={n.x} cy={n.y} r={4} fill={ink} />}
            {isHead && (
              <g transform={`translate(${n.x - 3}, ${n.y - 34})`}>
                <line x1="0" y1="0" x2="0" y2="22" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
                <path d="M0 0 L14 5 L0 10 Z" fill={ink} stroke="#0A0A0A" strokeWidth="1.5" strokeLinejoin="round" />
              </g>
            )}
            <title>{n.message}</title>
          </g>
        )
      })}
      {repo.head.kind === 'branch' && (
        <text x={4} y={H - 4} fontSize="12" fontWeight="800" fill={ink} fontFamily="inherit">
          HEAD → {repo.head.name}
        </text>
      )}
    </svg>
  )
}
