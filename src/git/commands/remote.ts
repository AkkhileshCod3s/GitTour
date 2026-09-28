import type { CommandDef } from '../types'
import { emptyRepo } from '../repo'

export const remote: CommandDef = {
  name: 'remote',
  description: 'Fake remote (cloud portal) connect karo.',
  usage: 'git remote add origin <url> | git remote -v',
  examples: ['git remote add origin https://gittime.dev/repo'],
  execute(args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) return { kind: 'error', lines: ["Pehle 'git init' karo."] }
    if (args[0] === '-v') {
      return { kind: 'info', lines: ctx.remote ? ['origin ' + (ctx.remote.url ?? 'https://gittime.dev/' + repo.name)] : ['Koi remote connected nahi hai.'] }
    }
    if (args[0] === 'add') {
      if (ctx.remote) return { kind: 'info', lines: ['Remote pehle se connected hai.'] }
      ctx.remote = { name: args[1] ?? 'origin', repo: emptyRepo('remote/' + repo.name), tracking: {}, url: args[2] ?? 'https://gittime.dev/' + repo.name }
      return { kind: 'success', lines: [`Remote '${ctx.remote.name}' connect ho gaya! Ab push/fetch kar sakte ho.`] }
    }
    return { kind: 'error', lines: ['Aise use karo: git remote add origin <url>'] }
  },
}

export const clone: CommandDef = {
  name: 'clone',
  description: 'Remote repo ki copy download karo (naya local repo).',
  usage: 'git clone <url>',
  examples: ['git clone https://gittime.dev/project'],
  execute(_args, ctx) {
    if (!ctx.remote) {
      // simulate: create remote then copy
      ctx.remote = { name: 'origin', repo: emptyRepo('remote/project'), tracking: {}, url: 'https://gittime.dev/project' }
    }
    const r = ctx.remote
    r.repo.initialized = true
    return {
      kind: 'success',
      lines: ['Cloud portal khula! Repo clone ho gaya (simulation).', 'Ab pull/push karke dekho kaise hota hai.'],
    }
  },
}
