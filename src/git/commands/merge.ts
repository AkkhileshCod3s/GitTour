import type { CommandDef } from '../types'
import { lastCommit, makeHash } from '../repo'
import { hasUncommittedChanges, mergeBase } from './merge-helpers'

export const CONFLICT_START = '<<<<<<< HEAD'
export const CONFLICT_SEP = '======='
export const CONFLICT_END = '>>>>>>> '

export const merge: CommandDef = {
  name: 'merge',
  description: 'Ek branch ke commits ko current branch mein lao.',
  usage: 'git merge <branch>',
  examples: ['git merge feature'],
  execute(args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) return { kind: 'error', lines: ["Pehle 'git init' karo."] }
    const name = args.filter((a) => !a.startsWith('-'))[0]
    if (!name) return { kind: 'error', lines: ['Kaunsi branch merge karni hai? git merge <branch>'] }
    if (!repo.branches[name]) return { kind: 'error', lines: [`'${name}' branch exist nahi karti.`] }
    if (repo.head.kind !== 'branch') {
      return { kind: 'error', lines: ['Pehle kisi branch pe switch karo, phir merge karo.'] }
    }
    if (hasUncommittedChanges(repo)) {
      return {
        kind: 'error',
        lines: ['Pehle apne changes commit karo, phir merge karo. Warna Git merge shuru nahi karega.'],
      }
    }
    const target = repo.branches[name].head
    const last = lastCommit(repo)
    if (!last) return { kind: 'error', lines: ['Current branch pe koi commit nahi hai.'] }
    if (target === last.id) {
      return { kind: 'info', lines: ['Already up to date — kuch merge karne jaisa nahi hai.'] }
    }
    const base = mergeBase(repo, last.id, target)

    // fast-forward: base == current head
    if (base === last.id) {
      repo.branches[repo.head.name].head = target
      applySnapshotToWorkdir(repo, repo.commits[target].snapshot)
      return {
        kind: 'success',
        lines: [
          'Fast-forward merge! Koi merge commit nahi bana.',
          `HEAD ab ${target} pe hai.`,
        ],
      }
    }

    // true merge
    const baseSnap = base ? repo.commits[base].snapshot : {}
    const aSnap = last.snapshot
    const bSnap = repo.commits[target].snapshot
    const names = new Set([...Object.keys(aSnap), ...Object.keys(bSnap), ...Object.keys(baseSnap)])
    const merged: Record<string, string> = { ...aSnap }
    const conflicts: string[] = []
    const changes: string[] = []

    for (const n of names) {
      const a = aSnap[n]
      const b = bSnap[n]
      const baseC = baseSnap[n]
      if (a === b) continue // same in both (or both deleted)
      // changed only on one side
      if (a === baseC) {
        merged[n] = b ?? ''
        changes.push(n)
        continue
      }
      if (b === baseC) {
        merged[n] = a ?? ''
        continue
      }
      // both changed differently -> conflict
      const marker = CONFLICT_END + name
      merged[n] =
        (a ?? '') + '\n' + CONFLICT_START + '\n' + (baseC ?? '') + '\n' + CONFLICT_SEP + '\n' + (b ?? '') + '\n' + marker
      conflicts.push(n)
    }

    if (conflicts.length > 0) {
      // enter conflict mode
      repo.workdir = merged
      for (const n of conflicts) repo.staged[n] = repo.workdir[n]
      ctx.conflictBranch = name
      return {
        kind: 'error',
        lines: [
          'CONFLICT! Dono branches ne ' + conflicts.join(', ') + ' ko alag tarike se badla.',
          'File ko kholo (cat ' + conflicts[0] + '), content edit karo (UI editor), phir:',
          'git add <file> aur git commit -m "resolve conflict"',
        ],
      }
    }

    // create merge commit
    const id = makeHash()
    repo.commits[id] = {
      id,
      message: `Merge branch '${name}'`,
      parents: [last.id, target],
      timestamp: Date.now(),
      snapshot: merged,
      changedFiles: changes,
    }
    repo.branches[repo.head.name].head = id
    applySnapshotToWorkdir(repo, merged)
    return {
      kind: 'success',
      lines: ['Merge ho gaya! Ek merge commit bana jisme dono timelines jud gayi.', 'HEAD: ' + id],
    }
  },
}

/** Sets workdir to snapshot contents (simulates checkout of result). */
export function applySnapshotToWorkdir(repo: { workdir: Record<string, string> }, snap: Record<string, string>): void {
  repo.workdir = { ...snap }
}
