import type { Repo } from '../types'
import { lastCommit } from '../repo'

/** True when workdir/staging differ from last commit. */
export function hasUncommittedChanges(repo: Repo): boolean {
  const last = lastCommit(repo)
  const base = last ? last.snapshot : {}
  const baseKeys = new Set(Object.keys(base))
  let sawAnyWorkdir = false
  for (const [n, c] of Object.entries(repo.workdir)) {
    sawAnyWorkdir = true
    if (baseKeys.has(n) && base[n] !== c) return true
  }
  if (sawAnyWorkdir) {
    for (const n of Object.keys(base)) {
      if (!(n in repo.workdir)) return true // tracked file deleted from workdir
    }
  }
  for (const n of Object.keys(repo.staged)) {
    if (base[n] !== repo.staged[n]) return true
  }
  return repo.stagedDeletions.length > 0
}

/** Merge base via BFS on parents (simple LCA for small graphs). */
export function mergeBase(repo: Repo, a: string, b: string): string | null {
  const ancestors = (id: string): Set<string> => {
    const s = new Set<string>()
    const stack = [id]
    while (stack.length) {
      const cur = stack.pop()!
      if (s.has(cur) || !repo.commits[cur]) continue
      s.add(cur)
      stack.push(...repo.commits[cur].parents)
    }
    return s
  }
  const bAnc = ancestors(b)
  // Walk from a in BFS order; the first commit also reachable from b is the base.
  const queue = [a]
  const seen = new Set<string>([a])
  while (queue.length) {
    const cur = queue.shift()!
    if (bAnc.has(cur)) return cur
    const parents = repo.commits[cur]?.parents ?? []
    for (const p of parents) {
      if (!seen.has(p)) {
        seen.add(p)
        queue.push(p)
      }
    }
  }
  return null
}
