import type { CommandDef, CommandResult, GitContext, ParsedCommand } from './types'
import { parse, tokenize } from './parser'
import { config } from './commands/config'
import { init } from './commands/init'
import { add } from './commands/add'
import { commit } from './commands/commit'
import { status } from './commands/status'
import { log } from './commands/log'
import { diff } from './commands/diff'
import { branch } from './commands/branch'
import { switchCmd } from './commands/switch'
import { merge } from './commands/merge'
import { restore } from './commands/restore'
import { revert } from './commands/revert'
import { reset } from './commands/reset'
import { remote, clone } from './commands/remote'
import { push, fetch, pull } from './commands/push'
import { ls, cat, touch, rm, handleEchoRedirect, clearCmd } from './commands/shell'
import { help } from './commands/help'

const commands: CommandDef[] = [
  config, init, add, commit, status, log, diff,
  branch, switchCmd, merge, restore, revert, reset,
  remote, clone, push, fetch, pull,
  ls, cat, touch, rm, clearCmd, help,
]

export class CommandRegistry {
  private map = new Map<string, CommandDef>()

  register(cmd: CommandDef): void {
    this.map.set(cmd.name, cmd)
  }
  get(name: string): CommandDef | undefined {
    return this.map.get(name)
  }
  all(): CommandDef[] {
    return [...this.map.values()]
  }
  names(): string[] {
    return [...this.map.keys()]
  }

  run(input: string, ctx: GitContext): CommandResult {
    const trimmed = input.trim()
    if (!trimmed) return { kind: 'info', lines: [] }
    const tokens = tokenize(trimmed)
    const echo = handleEchoRedirect(tokens, ctx)
    if (echo) return echo

    // Shell commands (no "git" prefix): ls, cat, touch, rm, clear, help
    if (tokens[0] !== 'git') {
      const shell = this.map.get(tokens[0])
      if (shell) return shell.execute(tokens.slice(1), ctx)
      const suggestion = nearest(this.all().map((c) => c.name), tokens[0])
      return {
        kind: 'error',
        lines: [`'${tokens[0]}'? Ye command nahi samajh aaya.` + (suggestion ? ` Kya aapka matlab '${suggestion}' tha?` : " Kya aapka matlab 'git status' tha?")],
      }
    }

    const p: ParsedCommand = parse(trimmed)
    const cmd = this.map.get(p.command)
    if (!cmd) {
      const suggestion = nearest(this.all().map((c) => c.name), p.command)
      return {
        kind: 'error',
        lines: [`'git ${p.command}' nahi mila.` + (suggestion ? ` Kya aapka matlab 'git ${suggestion}' tha?` : '')],
      }
    }
    ctx.flagBag = p.flags
    ctx.allCommands = this.all()
    return cmd.execute(p.args, ctx)
  }
}

function nearest(candidates: string[], word: string): string | null {
  let best: string | null = null
  let bestD = 3
  for (const c of candidates) {
    const d = editDistance(c, word)
    if (d < bestD) {
      bestD = d
      best = c
    }
  }
  return best
}

function editDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return dp[a.length][b.length]
}

export const registry = new CommandRegistry()
for (const c of commands) registry.register(c)
