import type { CommandDef } from '../types'
import { lastCommit } from '../repo'

export const branch: CommandDef = {
  name: 'branch',
  description: 'Branches: dekho, banao, ya delete karo.',
  usage: 'git branch | git branch <name> | git branch -d <name>',
  examples: ['git branch feature', 'git branch -d old'],
  execute(args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) return { kind: 'error', lines: ["Pehle 'git init' karo."] }
    const flags = ctx.flagBag ?? []
    const rest = args

    if (flags.includes('d')) {
      const name = rest[0]
      if (!name) return { kind: 'error', lines: ['Kaunsi branch delete karni hai? git branch -d <name>'] }
      if (!repo.branches[name]) return { kind: 'error', lines: [`'${name}' branch exist nahi karti.`] }
      if (repo.head.kind === 'branch' && repo.head.name === name) {
        return { kind: 'error', lines: ['Jis branch pe ho usko delete nahi kar sakte. Pehle switch karo.'] }
      }
      delete repo.branches[name]
      return { kind: 'success', lines: [`'${name}' branch delete ho gayi.`] }
    }

    if (rest.length === 0) {
      const lines = ['Branches:']
      for (const name of Object.keys(repo.branches)) {
        const isCurrent = repo.head.kind === 'branch' && repo.head.name === name
        lines.push((isCurrent ? '* ' : '  ') + name + (isCurrent ? ' (yahi pe ho)' : ''))
      }
      return { kind: 'info', lines }
    }

    const name = rest[0]
    if (repo.branches[name]) return { kind: 'error', lines: [`'${name}' pehle se exist karti hai.`] }
    const last = lastCommit(repo)
    if (!last) return { kind: 'error', lines: ['Pehle ek commit karo, phir branch banao.'] }
    repo.branches[name] = { name, head: last.id }
    return { kind: 'success', lines: [`'${name}' branch ban gayi.`] }
  },
}
