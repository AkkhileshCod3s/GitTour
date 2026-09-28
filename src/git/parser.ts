import type { ParsedCommand } from './types'

/** Tokenize respecting quotes; `>` is its own token. */
export function tokenize(input: string): string[] {
  const out: string[] = []
  let cur = ''
  let quote: '"' | "'" | null = null
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      if (ch === quote) quote = null
      else cur += ch
    } else if (ch === '"' || ch === "'") {
      quote = ch
    } else if (ch === ' ' || ch === '\t') {
      if (cur) out.push(cur)
      cur = ''
    } else if (ch === '>') {
      if (cur) {
        out.push(cur)
        cur = ''
      }
      out.push('>')
    } else {
      cur += ch
    }
  }
  if (cur) out.push(cur)
  return out
}

/**
 * Parse "git commit -m 'msg'" into {command, flags, args}.
 * -m / -am consume the next token (the message).
 * Bare shell commands (no "git") keep command:'' and args hold all tokens.
 */
export function parse(input: string): ParsedCommand {
  const tokens = tokenize(input.trim())
  if (tokens.length === 0) return { command: '', flags: [], args: [], raw: input }
  let i = 0
  let command = ''
  if (tokens[0] === 'git') {
    i = 1
    if (i < tokens.length && !tokens[i].startsWith('-')) {
      command = tokens[i]
      i++
    }
  }
  const flags: string[] = []
  const args: string[] = []
  let valueFlag: string | null = null

  for (; i < tokens.length; i++) {
    const t = tokens[i]
    if (t === '--') continue
    if (t.startsWith('-')) {
      const f = t.replace(/^-+/, '')
      flags.push(f)
      // -m and -am consume the next token as value
      valueFlag = f === 'm' || f === 'message' || f === 'am' ? f : null
    } else if (valueFlag) {
      args.push(t)
      valueFlag = null
    } else {
      args.push(t)
    }
  }
  return { command, flags, args, raw: input }
}
