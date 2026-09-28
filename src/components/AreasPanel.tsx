import type { Repo } from '../git/types'
import { allFileStates } from '../git/repo'

const STATE_META: Record<string, { label: string; color: string; icon: string }> = {
  untracked: { label: 'Nayi', color: '#94a3b8', icon: '?' },
  modified: { label: 'Badli', color: '#fbbf24', icon: 'M' },
  deleted: { label: 'Delete', color: '#f87171', icon: 'D' },
  'staged-new': { label: 'Staged', color: '#22d3ee', icon: 'S' },
  'staged-modified': { label: 'Staged', color: '#22d3ee', icon: 'S' },
  'staged-deleted': { label: 'Staged-Del', color: '#22d3ee', icon: 'S' },
  committed: { label: 'Committed', color: '#34d399', icon: '✓' },
}

/** Working Directory / Staging Area / Repository columns — files move live. */
export function AreasPanel({ repo }: { repo: Repo }) {
  const states = allFileStates(repo)
  const wd = states.filter((s) => s.state === 'untracked' || s.state === 'modified' || s.state === 'deleted')
  const staged = states.filter((s) => s.state.startsWith('staged-'))
  const lastSnap = committedFileList(repo)

  const Col = ({ title, files, empty, color }: { title: string; files: typeof states; empty: string; color: string }) => (
    <div className="flex-1 min-w-0">
      <p className="text-[8px] font-display tracking-wider mb-2" style={{ color }}>
        {title}
      </p>
      <div className="space-y-1 min-h-[64px]">
        {files.length === 0 && <p className="text-[10px] text-ink-low font-mono">{empty}</p>}
        {files.map((f) => {
          const m = STATE_META[f.state] ?? STATE_META.untracked
          return (
            <div
              key={f.name}
              className="anim-line flex items-center gap-1.5 bg-space-bg/70 border border-space-border rounded px-1.5 py-1"
              title={f.state}
            >
              <span
                className="text-[8px] font-mono font-bold w-4 h-4 flex items-center justify-center rounded-sm shrink-0"
                style={{ color: m.color, border: `1px solid ${m.color}66` }}
                aria-hidden="true"
              >
                {m.icon}
              </span>
              <span className="text-[10px] font-mono text-ink-hi truncate">{f.name}</span>
              <span className="sr-only">{m.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex gap-2">
      <Col title="1. WORKING DIR" files={wd} empty="(khali)" color="#fbbf24" />
      <div className="self-stretch w-px bg-space-border" aria-hidden="true" />
      <Col title="2. STAGING" files={staged} empty="(khali)" color="#22d3ee" />
      <div className="self-stretch w-px bg-space-border" aria-hidden="true" />
      <Col title="3. REPOSITORY" files={lastSnap} empty="(koi commit nahi)" color="#34d399" />
    </div>
  )
}

/** Files in the last commit (repository column). */
function committedFileList(repo: Repo) {
  const id = repo.head.kind === 'branch' ? repo.branches[repo.head.name]?.head : repo.head.id
  const last = id ? repo.commits[id] : null
  if (!last) return []
  return Object.keys(last.snapshot)
    .sort()
    .map((name) => ({ name, state: 'committed', content: last.snapshot[name] }))
}
