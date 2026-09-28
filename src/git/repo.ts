import type { Commit, Repo, WorkFile } from './types'

const HEX = '0123456789abcdef'
let hashCounter = 0
let hashJump = 1

/** 7-char fake hash; counter-based so ids stay unique. */
export function makeHash(seed?: string): string {
  hashJump = (hashJump * 31 + 7) % 9973
  let h = (hashCounter++ * hashJump + (seed ? seed.length : 0)) >>> 0
  let s = ''
  while (s.length < 7) {
    s += HEX[h % 16]
    h = (Math.floor(h / 16) + hashJump) >>> 0
  }
  return s.slice(0, 7)
}

export function resetHashCounter(): void {
  hashCounter = 0
  hashJump = 1
}

export function emptyRepo(name = 'project'): Repo {
  return {
    name,
    initialized: false,
    workdir: {},
    staged: {},
    stagedDeletions: [],
    commits: {},
    branches: {},
    head: { kind: 'commit', id: '' },
    config: {},
  }
}

export function lastCommit(repo: Repo): Commit | null {
  const id = repo.head.kind === 'branch' ? repo.branches[repo.head.name]?.head : repo.head.id
  return id && repo.commits[id] ? repo.commits[id] : null
}

export function headBranchName(repo: Repo): string | null {
  return repo.head.kind === 'branch' ? repo.head.name : null
}

/** Branch name even when HEAD is unborn (no commits yet). */
export function currentBranchName(repo: Repo): string | null {
  if (repo.head.kind === 'branch') return repo.head.name
  if (repo.head.kind === 'commit' && repo.head.id === '') return 'main'
  return null
}

/** Classifies a file's state for status/areas UI. */
export function fileState(repo: Repo, name: string): WorkFile & { state: string } {
  const wd = repo.workdir[name]
  const last = lastCommit(repo)
  const committed = last ? last.snapshot[name] : undefined

  if (name in repo.staged) {
    const changed = committed !== undefined && committed !== repo.staged[name]
    return { name, content: wd ?? repo.staged[name], state: changed ? 'staged-modified' : 'staged-new' }
  }
  if (repo.stagedDeletions.includes(name)) return { name, content: '', state: 'staged-deleted' }

  if (wd === undefined && committed !== undefined) return { name, content: '', state: 'deleted' }
  if (wd === undefined) return { name, content: '', state: 'missing' }
  if (committed === undefined) return { name, content: wd, state: 'untracked' }
  if (committed !== wd) return { name, content: wd, state: 'modified' }
  return { name, content: wd, state: 'committed' }
}

export function allFileStates(repo: Repo): Array<{ name: string; state: string; content: string }> {
  const names = new Set<string>([
    ...Object.keys(repo.workdir),
    ...(repo.staged ? Object.keys(repo.staged) : []),
    ...repo.stagedDeletions,
    ...(lastCommit(repo) ? Object.keys(lastCommit(repo)!.snapshot) : []),
  ])
  return [...names].sort().map((n) => fileState(repo, n))
}

/** Ancestors of a commit, most recent first (walks first parent then merges). */
export function logWalk(repo: Repo, startId: string): Commit[] {
  const out: Commit[] = []
  const seen = new Set<string>()
  const stack = [startId]
  while (stack.length) {
    const id = stack.shift()!
    if (seen.has(id) || !repo.commits[id]) continue
    seen.add(id)
    const c = repo.commits[id]
    out.push(c)
    stack.push(...c.parents)
  }
  return out
}

export function commitSnapshot(c: Commit): Record<string, string> {
  return { ...c.snapshot }
}
