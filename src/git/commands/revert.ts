import type { CommandDef } from '../types'
import { lastCommit, makeHash } from '../repo'

export const revert: CommandDef = {
  name: 'revert',
  description: 'Ek purane commit ka ulta karke NAYA commit banao (safe undo).',
  usage: 'git revert <commit-id>',
  examples: ['git revert a1b2c3d'],
  execute(args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) return { kind: 'error', lines: ["Pehle 'git init' karo."] }
    const id = args[0]
    if (!id) {
      return {
        kind: 'error',
        lines: ['Kaunsa commit revert karna hai? git log se id dekho, phir: git revert <id>'],
      }
    }
    const target = repo.commits[id]
    if (!target) {
      const ids = Object.keys(repo.commits).filter((k) => k.startsWith(id))
      if (ids.length === 1) {
        repo.commits[ids[0]] // found partial match
        return revertCommit(ctx, ids[0])
      }
      return {
        kind: 'error',
        lines: [`'${id}' jaisa koi commit nahi mila. git log --oneline se sahi id dekho.`],
      }
    }
    return revertCommit(ctx, target.id)
  },
}

function revertCommit(ctx: import('../types').GitContext, id: string): import('../types').CommandResult {
  const repo = ctx.repo
  const target = repo.commits[id]
  const last = lastCommit(repo)
  if (!last) return { kind: 'error', lines: ['Revert ke liye history chahiye.'] }

  // Undo = restore each file the commit touched back to its parent's version.
  const parentId = target.parents[0]
  const parent = parentId ? repo.commits[parentId] : null
  const snapshot = { ...last.snapshot }
  const changedFiles: string[] = []
  for (const f of target.changedFiles) {
    const oldVal = parent ? parent.snapshot[f] : undefined
    if (oldVal === undefined) {
      if (f in snapshot) {
        delete snapshot[f]
        changedFiles.push(f)
      }
    } else {
      if (snapshot[f] !== oldVal) {
        snapshot[f] = oldVal
        changedFiles.push(f)
      }
    }
  }
  if (changedFiles.length === 0) {
    return { kind: 'info', lines: ['Is commit ke changes already cancel ho chuke hain.'] }
  }

  // apply to workdir too
  for (const f of changedFiles) {
    if (snapshot[f] === undefined) delete repo.workdir[f]
    else repo.workdir[f] = snapshot[f]
  }

  const newId = makeHash()
  repo.commits[newId] = {
    id: newId,
    message: 'Revert "' + target.message + '"',
    parents: [last.id],
    timestamp: Date.now(),
    snapshot,
    changedFiles,
  }
  if (repo.head.kind === 'branch') repo.branches[repo.head.name].head = newId
  else repo.head = { kind: 'commit', id: newId }
  return {
    kind: 'success',
    lines: [`Revert commit bana: ${newId}`, `${target.message} ka effect undo ho gaya (safely).`],
  }
}
