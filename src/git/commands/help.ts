import type { CommandDef } from '../types'

export const help: CommandDef = {
  name: 'help',
  description: 'Saare commands aur unka use dekho.',
  usage: 'help <command>',
  examples: ['help', 'help commit'],
  execute(args, ctx) {
    const cmds = ctx.allCommands ?? []
    const target = args[0]
    if (target) {
      const cmd = cmds.find((c) => c.name === target)
      if (!cmd) return { kind: 'error', lines: [`'${target}' command nahi mila. 'help' likho poora list ke liye.`] }
      return {
        kind: 'info',
        lines: [cmd.name.toUpperCase(), cmd.description, 'Use: git ' + cmd.usage, 'Example: ' + cmd.examples.join(' | ')],
      }
    }
    const lines = ['Available commands:']
    for (const c of cmds) lines.push('  git ' + c.usage.padEnd(46) + ' ' + c.description)
    return { kind: 'info', lines }
  },
}
