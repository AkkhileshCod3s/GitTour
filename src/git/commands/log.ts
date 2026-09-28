import type { CommandDef } from '../types'
import { lastCommit } from '../repo'

export const log: CommandDef = {
  name: 'log',
  description: 'Commit history dekho (naye se purane).',
  usage: 'git log | git log --oneline',
  examples: ['git log --oneline'],
  execute(_args, ctx) {
    const repo = ctx.repo
    const flags = ctx.flagBag ?? []
    if (!repo.initialized) {
      return { kind: 'error', lines: ["Pehle 'git init' karo, phir log dekh sakte ho."] }
    }
    const last = lastCommit(repo)
    if (!last) return { kind: 'info', lines: ['Abhi koi commit nahi hua. Pehle git add + git commit karo.'] }

    // Walk all commits reachable from current head
    const out: string[] = []
    const seen = new Set<string>()
    const stack = [last.id]
    while (stack.length) {
      const id = stack.shift()!
      if (seen.has(id) || !repo.commits[id]) continue
      seen.add(id)
      const c = repo.commits[id]
      if (flags.includes('oneline')) {
        out.push(id + ' ' + c.message)
      } else {
        out.push('commit ' + id)
        if (c.parents.length > 1) out.push('Merge: ' + c.parents.map((p) => p.slice(0, 7)).join(' '))
        out.push('    ' + c.message)
        out.push('')
      }
      stack.push(...c.parents)
    }
    return { kind: 'info', lines: out }
  },
}
