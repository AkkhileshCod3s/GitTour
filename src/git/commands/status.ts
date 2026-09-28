import type { CommandDef } from '../types'
import { allFileStates, headBranchName } from '../repo'

function icon(state: string): string {
  switch (state) {
    case 'untracked': return '[?]'
    case 'modified': return '[M]'
    case 'staged-new': return '[+S]'
    case 'staged-modified': return '[+S]'
    case 'staged-deleted': return '[-S]'
    case 'deleted': return '[D]'
    default: return '[ok]'
  }
}

export const status: CommandDef = {
  name: 'status',
  description: 'Batao kaunsi files kahan hain: working dir, staging, ya committed.',
  usage: 'git status',
  examples: ['git status'],
  execute(_args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) {
      return { kind: 'error', lines: ["Pehle 'git init' karo, phir status dekh sakte ho."] }
    }
    const branch = headBranchName(repo) ?? 'detached HEAD'
    const lines: string[] = ['Branch: ' + branch]

    const states = allFileStates(repo)
    const untracked = states.filter((s) => s.state === 'untracked')
    const modified = states.filter((s) => s.state === 'modified' || s.state === 'deleted')
    const staged = states.filter((s) => s.state.startsWith('staged-'))

    if (staged.length) {
      lines.push('Staging area mein (commit ke liye tayyar):')
      staged.forEach((s) => lines.push('  ' + icon(s.state) + ' ' + s.name))
    }
    if (modified.length) {
      lines.push('Badli hui (un-staged) files:')
      modified.forEach((s) => lines.push('  ' + icon(s.state) + ' ' + s.name))
    }
    if (untracked.length) {
      lines.push('Nayi files jo Git abhi track nahi karta:')
      untracked.forEach((s) => lines.push('  ' + icon(s.state) + ' ' + s.name))
    }
    if (!staged.length && !modified.length && !untracked.length) {
      lines.push('Sab kuch clean hai! Working directory aur last commit match karte hain.')
    } else if (!staged.length) {
      lines.push('Tip: git add <file> se changes staging area mein bhejo.')
    }
    return { kind: 'info', lines }
  },
}
