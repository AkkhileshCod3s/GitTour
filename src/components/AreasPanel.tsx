import type { Repo } from '../git/types'
import { allFileStates } from '../git/repo'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'
import { IconCheck } from '../ui/Icons'

/**
 * Status badge glyphs: plain mono letters (never emoji), shown as a small
 * fixed-corner badge on each file tile.
 */
const STATE_META: Record<string, { label: string; color: string; glyph: string }> = {
  untracked: { label: 'New', color: 'var(--ink-hi)', glyph: '?' },
  modified: { label: 'Modified', color: 'var(--lime)', glyph: 'M' },
  deleted: { label: 'Deleted', color: 'var(--danger)', glyph: 'D' },
  'staged-new': { label: 'Staged', color: 'var(--lime)', glyph: 'S' },
  'staged-modified': { label: 'Staged', color: 'var(--lime)', glyph: 'S' },
  'staged-deleted': { label: 'Staged-Del', color: 'var(--lime)', glyph: 'S' },
  committed: { label: 'Committed', color: 'var(--lime)', glyph: '✓' },
}

/** Working Dir / Staging / Repository trays — file names never clipped. */
export function AreasPanel({ repo, lang }: { repo: Repo; lang: Lang }) {
  const states = allFileStates(repo)
  const wd = states.filter((s) => s.state === 'untracked' || s.state === 'modified' || s.state === 'deleted')
  const staged = states.filter((s) => s.state.startsWith('staged-'))
  const lastSnap = committedFileList(repo)

  const Tray = ({ id, files }: { id: 'wd' | 'staging' | 'repo'; files: typeof states }) => {
    const titles: Record<string, string> = {
      wd: t(STRINGS.areas.wd, lang),
      staging: t(STRINGS.areas.staging, lang),
      repo: t(STRINGS.areas.repo, lang),
    }
    const empties: Record<string, string> = {
      wd: t(STRINGS.areas.empty, lang),
      staging: t(STRINGS.areas.empty, lang),
      repo: t(STRINGS.areas.emptyRepo, lang),
    }
    return (
      <div className="min-w-0 flex flex-col">
        <p className="font-display text-[11px] text-lime mb-1.5 px-0.5">{titles[id]}</p>
        <div
          className="flex flex-wrap content-start justify-center gap-1.5 min-h-[76px] rounded-brut border-3 border-theme p-2.5 shadow-brut-xs bg-brut-shade"
          style={id === 'staging' ? { borderStyle: 'dashed' } : undefined}
        >
          {files.length === 0 && (
            <p className="w-full text-[11px] text-ink-low font-bold text-center leading-snug self-center my-auto">{empties[id]}</p>
          )}
          {files.map((f) => {
            const m = STATE_META[f.state] ?? STATE_META.untracked
            return (
              <div
                key={f.name}
                className="anim-hop relative flex items-center bg-brut-panel border-2 border-theme rounded-brut px-2.5 py-1.5 shadow-brut-xs"
                title={f.name}
              >
                {/* full file name, always one single uncut line; tile sizes to it */}
                <span
                  className="text-xs font-mono font-bold whitespace-nowrap"
                  style={{ color: 'rgb(var(--ink-hi))' }}
                >
                  {f.name}
                </span>
                {/* small fixed-corner status badge; never squeezes the text */}
                <span
                  className="absolute -top-1.5 -right-1.5 h-[16px] min-w-[16px] flex items-center justify-center rounded-full border-2 border-theme bg-brut-shade text-[8px] font-mono font-bold px-0.5"
                  style={{ color: `rgb(${m.color})` }}
                  aria-hidden="true"
                >
                  {m.glyph === '✓' ? <IconCheck size={9} strokeWidth={3} /> : m.glyph}
                </span>
                <span className="sr-only">{m.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      <Tray id="wd" files={wd} />
      <Tray id="staging" files={staged} />
      <Tray id="repo" files={lastSnap} />
    </div>
  )
}

/** Files in the last commit (repository tray). */
function committedFileList(repo: Repo) {
  const id = repo.head.kind === 'branch' ? repo.branches[repo.head.name]?.head : repo.head.id
  const last = id ? repo.commits[id] : null
  if (!last) return []
  return Object.keys(last.snapshot)
    .sort()
    .map((name) => ({ name, state: 'committed', content: last.snapshot[name] }))
}
