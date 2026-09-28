import type { CommandDef, GitContext, CommandResult } from '../types'

/** Shell-ish commands so users can create/edit files inside the fake terminal. */

export const ls: CommandDef = {
  name: 'ls',
  description: 'Folder ki files dekho.',
  usage: 'ls',
  examples: ['ls'],
  execute(_args, ctx) {
    const names = Object.keys(ctx.repo.workdir).sort()
    if (!names.length) return { kind: 'info', lines: ['(folder khali hai — touch <file> se file banao)'] }
    return { kind: 'info', lines: [names.join('   ')] }
  },
}

export const cat: CommandDef = {
  name: 'cat',
  description: 'File ka content dekho.',
  usage: 'cat <file>',
  examples: ['cat app.js'],
  execute(args, ctx) {
    const name = args[0]
    if (!name) return { kind: 'error', lines: ['Kaunsi file? cat <file>'] }
    if (!(name in ctx.repo.workdir)) return { kind: 'error', lines: [`'${name}' file exist nahi karti. ls se dekho.`] }
    return { kind: 'info', lines: ctx.repo.workdir[name].split('\n') }
  },
}

export const touch: CommandDef = {
  name: 'touch',
  description: 'Nayi khali file banao.',
  usage: 'touch <file>',
  examples: ['touch app.js'],
  execute(args, ctx) {
    const name = args[0]
    if (!name) return { kind: 'error', lines: ['File ka naam do: touch <file>'] }
    if (name in ctx.repo.workdir) return { kind: 'info', lines: [`'${name}' pehle se hai.`] }
    ctx.repo.workdir[name] = ''
    return { kind: 'success', lines: [`'${name}' ban gayi (abhi khali hai).`] }
  },
}

export const rm: CommandDef = {
  name: 'rm',
  description: 'File delete karo (working directory se).',
  usage: 'rm <file>',
  examples: ['rm old.js'],
  execute(args, ctx) {
    const name = args[0]
    if (!name || !(name in ctx.repo.workdir)) return { kind: 'error', lines: [`'${name ?? ''}' file nahi mili.`] }
    delete ctx.repo.workdir[name]
    return { kind: 'success', lines: [`'${name}' delete ho gayi.`] }
  },
}

/** Handles `echo "text" > file` (called by registry when raw contains >). */
export function handleEchoRedirect(tokens: string[], ctx: GitContext): CommandResult | null {
  const gt = tokens.indexOf('>')
  if (gt === -1 || tokens[0] !== 'echo') return null
  const text = tokens.slice(1, gt).join(' ')
  const file = tokens[gt + 1]
  if (!file) return { kind: 'error', lines: ['File ka naam do: echo "text" > file'] }
  ctx.repo.workdir[file] = text
  return { kind: 'success', lines: [`'${file}' mein text likh diya.`] }
}

export const clearCmd: CommandDef = {
  name: 'clear',
  description: 'Terminal saaf karo.',
  usage: 'clear',
  examples: ['clear'],
  execute() {
    return { kind: 'info', lines: ['__CLEAR__'] }
  },
}
