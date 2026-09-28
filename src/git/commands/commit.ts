import type { CommandDef, CommandResult, GitContext } from '../types'
import { lastCommit, makeHash } from '../repo'

export const commit: CommandDef = {
  name: 'commit',
  description: 'Staged changes ko permanent snapshot (commit) bana do.',
  usage: 'git commit -m "msg"',
  examples: ['git commit -m "first timeline"'],
  execute(args, ctx) {
    const flags: string[] = (ctx as { flagBag?: string[] }).flagBag ?? []
    return commitImpl(args, ctx, flags)
  },
}

export function commitImpl(args: string[], ctx: GitContext, flags: string[]): CommandResult {
  const repo = ctx.repo
  if (!repo.initialized) {
    return { kind: 'error', lines: ["Pehle 'git init' karo, tabhi Git is folder ko track karega."] }
  }
  if (!repo.config['user.name'] || !repo.config['user.email']) {
    return {
      kind: 'error',
      lines: [
        'Commit se pehle apni identity set karo:',
        'git config user.name "Naam"',
        'git config user.email "tum@example.com"',
      ],
    }
  }

  const hasM = flags.includes('m') || flags.includes('message')
  const hasAm = flags.includes('am')
  if ((hasM || hasAm) && args.length === 0) {
    return { kind: 'error', lines: ['Message dena mat bhoolo: git commit -m "mera kaam"'] }
  }
  if (!hasM && !hasAm) {
    return {
      kind: 'error',
      lines: [
        'Message ke bina commit nahi hota.',
        'Aise likho: git commit -m "kya badla" (quotes zaroori hain)',
      ],
    }
  }
  const message = args[0]

  if (hasAm) {
    const last0 = lastCommit(repo)
    if (last0) {
      for (const n of Object.keys(last0.snapshot)) {
        const wd = repo.workdir[n]
        if (wd !== undefined && wd !== last0.snapshot[n]) repo.staged[n] = wd
      }
    }
  }

  const last = lastCommit(repo)
  const snapshot: Record<string, string> = last ? { ...last.snapshot } : {}
  let changed = false
  const changedFiles: string[] = []

  for (const [n, c] of Object.entries(repo.staged)) {
    if (!last || last.snapshot[n] !== c) {
      changed = true
      changedFiles.push(n)
    }
    if (c === '' && repo.workdir[n] === undefined) delete snapshot[n]
    else snapshot[n] = c
  }
  for (const n of repo.stagedDeletions) {
    if (n in snapshot) {
      changed = true
      changedFiles.push(n)
      delete snapshot[n]
    }
  }
  if (!changed) {
    return { kind: 'error', lines: ['Commit karne ke liye kuch staged hona chahiye! Pehle git add <file> karo.'] }
  }

  const id = makeHash()
  // Finishing a conflict resolution? Then this is the merge commit (2 parents).
  const conflictBranch = ctx.conflictBranch
  const mergeParent = conflictBranch && repo.branches[conflictBranch] ? repo.branches[conflictBranch].head : null
  const parents = last ? [last.id, ...(mergeParent && mergeParent !== last.id ? [mergeParent] : [])] : []
  repo.commits[id] = { id, message, parents, timestamp: Date.now(), snapshot, changedFiles }
  ctx.conflictBranch = undefined
  if (repo.head.kind === 'branch') {
    repo.branches[repo.head.name].head = id
  } else if (repo.head.kind === 'commit' && repo.head.id === '') {
    // unborn HEAD: first commit creates the default branch 'main'
    repo.branches['main'] = { name: 'main', head: id }
    repo.head = { kind: 'branch', name: 'main' }
  } else {
    repo.head = { kind: 'commit', id }
  }
  repo.staged = {}
  repo.stagedDeletions = []
  const label = repo.head.kind === 'branch' ? repo.head.name : 'HEAD'
  return {
    kind: 'success',
    lines: ['[' + label + ' ' + id + '] ' + message, changedFiles.length + ' file(s) timeline mein save ho gayi.'],
  }
}
