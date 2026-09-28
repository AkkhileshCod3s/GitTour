import type { CommandDef } from '../types'
import { lastCommit } from '../repo'

/** Unified diff-ish line list between two texts (simple line compare). */
export function diffLines(oldText: string, newText: string): string[] {
  const oldL = oldText ? oldText.split('\n') : []
  const newL = newText ? newText.split('\n') : []
  const out: string[] = []
  const max = Math.max(oldL.length, newL.length)
  for (let i = 0; i < max; i++) {
    const o = oldL[i]
    const n = newL[i]
    if (o === n) continue
    if (o !== undefined) out.push('- ' + o)
    if (n !== undefined) out.push('+ ' + n)
  }
  return out
}

export const diff: CommandDef = {
  name: 'diff',
  description: 'Dekho kya badla — abhi ke changes vs last commit.',
  usage: 'git diff | git diff --staged',
  examples: ['git diff', 'git diff --staged'],
  execute(_args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) {
      return { kind: 'error', lines: ["Pehle 'git init' karo, phir diff chalega."] }
    }
    const staged = (ctx.flagBag ?? []).includes('staged')
    const last = lastCommit(repo)
    const out: string[] = []

    if (staged) {
      const base = last ? last.snapshot : {}
      let any = false
      for (const [n, c] of Object.entries(repo.staged)) {
        const oldC = base[n] ?? ''
        if (oldC !== c) {
          any = true
          out.push('--- ' + n + ' (staged)')
          out.push(...diffLines(oldC, c))
        }
      }
      for (const n of repo.stagedDeletions) {
        if (base[n] !== undefined) {
          any = true
          out.push('--- ' + n + ' (staged deletion)')
          out.push(...diffLines(base[n], ''))
        }
      }
      if (!any) out.push('Staged changes mein koi farak nahi.')
    } else {
      const base = last ? last.snapshot : {}
      const names = new Set<string>([...Object.keys(repo.workdir), ...Object.keys(base)])
      let any = false
      for (const n of names) {
        const wd = repo.workdir[n]
        const oldC = base[n]
        if (wd === undefined && oldC === undefined) continue
        if (wd === oldC) continue
        if (repo.staged[n] === wd && repo.staged[n] !== undefined) continue // already staged, skip
        any = true
        out.push('--- ' + n)
        out.push(...diffLines(oldC ?? '', wd ?? ''))
      }
      if (!any) out.push('Working directory mein koi unstaged farak nahi.')
    }
    return { kind: 'info', lines: out }
  },
}
