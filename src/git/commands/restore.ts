import type { CommandDef } from '../types'
import { lastCommit } from '../repo'

export const restore: CommandDef = {
  name: 'restore',
  description: 'File ko last commit wali state mein wapas lao (ya staging se hatao).',
  usage: 'git restore <file> | git restore --staged <file>',
  examples: ['git restore app.js', 'git restore --staged app.js'],
  execute(args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) return { kind: 'error', lines: ["Pehle 'git init' karo."] }
    const flags = ctx.flagBag ?? []
    const rest = args
    const name = rest[0]
    if (!name) return { kind: 'error', lines: ['File ka naam do: git restore <file>'] }

    if (flags.includes('staged')) {
      if (name in repo.staged) {
        delete repo.staged[name]
        return { kind: 'success', lines: [`'${name}' staging se hata di — ab ye sirf working directory mein hai.`] }
      }
      if (repo.stagedDeletions.includes(name)) {
        repo.stagedDeletions = repo.stagedDeletions.filter((n) => n !== name)
        const last = lastCommit(repo)
        if (last && last.snapshot[name] !== undefined) repo.workdir[name] = last.snapshot[name]
        return { kind: 'success', lines: [`'${name}' ki deletion staging se hata di.`] }
      }
      return { kind: 'info', lines: [`'${name}' staging mein hai hi nahi.`] }
    }

    // restore workdir from last commit
    const last = lastCommit(repo)
    if (!last || last.snapshot[name] === undefined) {
      return {
        kind: 'error',
        lines: [
          `'${name}' kisi commit mein nahi mili — restore ke paas wapas jaane ke liye kuch nahi hai.`,
          'Nayi (untracked) file ko hatane ke liye use karo: rm <file>',
        ],
      }
    }
    repo.workdir[name] = last.snapshot[name]
    return { kind: 'success', lines: [`'${name}' last commit wali state pe wapas aa gayi.`] }
  },
}
