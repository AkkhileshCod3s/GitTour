import type { Repo } from '../git/types'
import { allFileStates, logWalk } from '../git/repo'
import type { Level } from './worlds'

/** STATE-BASED check: final repo compared to goal, not the commands typed. */
export function checkGoal(level: Level, repo: Repo, ctx?: { remote?: { repo: Repo; tracking: Record<string, string> } }): boolean {
  const g = level.goal
  const commits = Object.keys(repo.commits).length

  if (g.minCommits !== undefined && commits < g.minCommits) return false
  if (g.headBranch !== undefined && (repo.head.kind !== 'branch' || repo.head.name !== g.headBranch)) return false
  if (g.branchExists !== undefined) {
    for (const b of g.branchExists) if (!repo.branches[b]) return false
  }
  if (g.files !== undefined) {
    for (const [name, want] of Object.entries(g.files)) {
      if (repo.workdir[name] !== want) return false
    }
  }
  if (g.filesAbsent !== undefined) {
    for (const name of g.filesAbsent) {
      if (repo.workdir[name] !== undefined) return false
    }
  }
  if (g.cleanTree) {
    const states = allFileStates(repo)
    const dirty = states.some((s) => s.state !== 'committed')
    if (dirty) return false
  }
  if (g.minMergeCommits !== undefined) {
    const headId = repo.head.kind === 'branch' ? repo.branches[repo.head.name]?.head : repo.head.id
    const walk = headId ? logWalk(repo, headId) : []
    const merges = walk.filter((c) => c.parents.length >= 2).length
    if (merges < g.minMergeCommits) return false
  }
  if (g.remoteConnected) {
    if (!ctx?.remote) return false
  }
  if (g.pushed) {
    if (!ctx?.remote) return false
    const headId = repo.head.kind === 'branch' ? repo.branches[repo.head.name]?.head : repo.head.id
    if (!headId || ctx.remote.tracking[repo.head.kind === 'branch' ? repo.head.name : 'main'] !== headId) return false
  }
  return true
}
