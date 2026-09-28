import type { CommandDef } from '../types'
import { lastCommit } from '../repo'
import { headBranchName } from '../repo'
import { hasUncommittedChanges } from './merge-helpers'

export const switchCmd: CommandDef = {
  name: 'switch',
  description: 'Doosri branch pe jao (parallel universe switch).',
  usage: 'git switch <branch> | git switch -c <new>',
  examples: ['git switch feature', 'git switch -c feature'],
  execute(args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) return { kind: 'error', lines: ["Pehle 'git init' karo."] }
    const flags = ctx.flagBag ?? []
    const rest = args
    const create = flags.includes('c')
    const name = rest[0]

    if (create) {
      if (repo.branches[name]) {
        return { kind: 'error', lines: [`'${name}' pehle se exist karti hai. Bina -c ke switch karo.`] }
      }
      const last = lastCommit(repo)
      if (!last) return { kind: 'error', lines: ['Pehle commit karo, phir nayi branch banao.'] }
      repo.branches[name] = { name, head: last.id }
      repo.head = { kind: 'branch', name }
      return { kind: 'success', lines: [`Nayi branch '${name}' bani, aur tum switch ho gaye.`] }
    }
    if (!name) return { kind: 'error', lines: ['Branch ka naam do: git switch <name>'] }
    if (!repo.branches[name]) {
      return { kind: 'error', lines: [`'${name}' exist nahi karti. 'git branch' se list dekho.`] }
    }
    if (headBranchName(repo) && hasUncommittedChanges(repo)) {
      return {
        kind: 'error',
        lines: ['Pehle apne changes commit karo, phir switch karo.', 'Git tumhara kaam protect kar raha hai!'],
      }
    }
    repo.head = { kind: 'branch', name }
    // Switching branches updates the working directory to the branch's snapshot.
    const targetId = repo.branches[name].head
    const target = targetId ? repo.commits[targetId] : null
    if (target) {
      repo.workdir = { ...target.snapshot }
      repo.staged = {}
      repo.stagedDeletions = []
    }
    return { kind: 'success', lines: [`'${name}' pe switch ho gaye.`] }
  },
}
