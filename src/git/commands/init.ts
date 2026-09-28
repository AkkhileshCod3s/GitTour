import type { CommandDef } from '../types'
import { emptyRepo } from '../repo'

export const init: CommandDef = {
  name: 'init',
  description: 'Is folder mein naya Git repository shuru karo.',
  usage: 'git init',
  examples: ['git init'],
  execute(_args, ctx) {
    if (ctx.repo.initialized) {
      return {
        kind: 'info',
        lines: ['Ye repo pehle se initialized hai. Dobara init karne ki zaroorat nahi.'],
      }
    }
    const workdir = { ...ctx.repo.workdir } // files survive init
    const fresh = emptyRepo(ctx.repo.name)
    Object.assign(ctx.repo, fresh)
    ctx.repo.initialized = true
    ctx.repo.workdir = workdir
    return { kind: 'success', lines: ['Timeline anchor set! Repository initialize ho gaya.'] }
  },
}
