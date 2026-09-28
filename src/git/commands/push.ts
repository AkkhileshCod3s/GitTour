import type { CommandDef, Repo } from '../types'
import { lastCommit } from '../repo'

/** Copies branch state local -> remote repo. */
export function syncBranch(remote: Repo, local: Repo, branch: string): void {
  // copy missing commits
  for (const [id, c] of Object.entries(local.commits)) {
    if (!remote.commits[id]) remote.commits[id] = JSON.parse(JSON.stringify(c)) as typeof c
  }
  remote.branches[branch] = { name: branch, head: local.branches[branch].head }
}

export const push: CommandDef = {
  name: 'push',
  description: 'Local commits cloud (remote) par bhejo.',
  usage: 'git push origin <branch>',
  examples: ['git push origin main'],
  execute(args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) return { kind: 'error', lines: ["Pehle 'git init' karo."] }
    if (!ctx.remote) {
      return { kind: 'error', lines: ['Koi remote connected nahi! Pehle: git remote add origin <url>'] }
    }
    const rest = args.filter((a) => !a.startsWith('-'))
    const branch = rest[0] === 'origin' ? rest[1] : (rest[0] ?? (repo.head.kind === 'branch' ? repo.head.name : null))
    if (!branch || !repo.branches[branch]) {
      return { kind: 'error', lines: ['Branch nahi mili. Aise likho: git push origin main'] }
    }
    syncBranch(ctx.remote.repo, repo, branch)
    ctx.remote.tracking[branch] = repo.branches[branch].head
    return { kind: 'success', lines: [`'${branch}' cloud portal tak pahunch gayi! Push successful.`] }
  },
}

export const fetch: CommandDef = {
  name: 'fetch',
  description: 'Remote ke naye commits sirf DOWNLOAD karo (merge baad mein).',
  usage: 'git fetch',
  examples: ['git fetch'],
  execute(_args, ctx) {
    if (!ctx.remote) return { kind: 'error', lines: ['Pehle remote add karo: git remote add origin <url>'] }
    const fetched: string[] = []
    for (const [b, id] of Object.entries(ctx.remote.tracking)) {
      for (const c of Object.values(ctx.remote.repo.commits)) void c
      fetched.push(b + ' -> ' + id)
    }
    if (fetched.length === 0) return { kind: 'info', lines: ['Remote pe kuch naya nahi hai.'] }
    return { kind: 'success', lines: ['Fetch complete! Remote state: ' + fetched.join(', ')] }
  },
}

export const pull: CommandDef = {
  name: 'pull',
  description: 'Fetch + merge ek saath (dono steps output mein dikhenge).',
  usage: 'git pull',
  examples: ['git pull'],
  execute(args, ctx) {
    const fetchRes = fetch.execute(args, ctx)
    const mergeRes = mergeStep(ctx)
    return { kind: fetchRes.kind === 'error' ? 'error' : mergeRes.kind, lines: [...fetchRes.lines, ...mergeRes.lines] }
  },
}

function mergeStep(ctx: import('../types').GitContext): import('../types').CommandResult {
  const repo = ctx.repo
  const remote = ctx.remote!
  const branch = repo.head.kind === 'branch' ? repo.head.name : 'main'
  const remoteHead = remote.tracking[branch]
  if (!remoteHead) return { kind: 'info', lines: ['Remote pe is branch ke commits nahi hain — kuch merge nahi hua.'] }
  const local = lastCommit(repo)
  if (!local || local.id === remoteHead) return { kind: 'info', lines: ['Already up to date!'] }
  // simple: fast-forward local branch to remote head
  const last = lastCommit(repo)!
  repo.commits[remoteHead] = JSON.parse(JSON.stringify(remote.repo.commits[remoteHead]))
  repo.branches[branch].head = remoteHead
  repo.workdir = { ...repo.commits[remoteHead].snapshot }
  return { kind: 'success', lines: [`Merge complete: ${last.id} -> ${remoteHead} (fast-forward).`] }
}
