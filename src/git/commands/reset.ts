import type { CommandDef } from '../types'
import { logWalk } from '../repo'

export const reset: CommandDef = {
  name: 'reset',
  description: 'Branch ko purane commit pe le jao. --soft: commits only, --mixed: +unstage, --hard: sab wipe.',
  usage: 'git reset --soft|--mixed|--hard <commit-id>',
  examples: ['git reset --hard a1b2c3d'],
  execute(args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) return { kind: 'error', lines: ["Pehle 'git init' karo."] }
    const flags = ctx.flagBag ?? []
    const rest = args
    const id = rest[0]
    if (!id) return { kind: 'error', lines: ['Commit id do: git reset --hard <id> (git log --oneline se dekho)'] }

    let resolved: string | null = null
    if (repo.commits[id]) resolved = id
    else {
      const matches = Object.keys(repo.commits).filter((k) => k.startsWith(id))
      if (matches.length === 1) resolved = matches[0]
    }
    if (!resolved || !repo.commits[resolved]) {
      return { kind: 'error', lines: [`'${id}' commit nahi mila. git log --oneline se sahi id dekho.`] }
    }

    const lastId = repo.head.kind === 'branch' ? repo.branches[repo.head.name]?.head : repo.head.id
    const lastC = lastId ? repo.commits[lastId] : null
    if (!lastC) return { kind: 'error', lines: ['Current branch pe koi commit nahi hai.'] }
    const reachable = logWalk(repo, lastC.id)
    if (!reachable.some((c) => c.id === resolved)) {
      return { kind: 'error', lines: [`'${id}' is branch ki history mein nahi hai.`] }
    }
    const mode = flags.includes('hard') ? 'hard' : flags.includes('soft') ? 'soft' : 'mixed'
    const oldHeadId = lastC.id
    if (repo.head.kind === 'branch') repo.branches[repo.head.name].head = resolved
    else repo.head = { kind: 'commit', id: resolved }

    const target = repo.commits[resolved]
    if (mode === 'hard') {
      repo.workdir = { ...target.snapshot }
      repo.staged = {}
      repo.stagedDeletions = []
      return { kind: 'success', lines: ['Hard reset! Sab kuch ' + resolved + ' jaisa ho gaya. Un-committed kaam gaya — sambhal ke!'] }
    }
    if (mode === 'soft') {
      // workdir untouched; index still holds old HEAD content -> appears staged
      repo.staged = { ...(repo.commits[oldHeadId]?.snapshot ?? {}) }
      repo.stagedDeletions = []
      return { kind: 'success', lines: ['Soft reset! Commits hat gaye, changes ab bhi staged hain.'] }
    }
    // mixed: index reset to target, workdir untouched
    repo.staged = {}
    repo.stagedDeletions = []
    return { kind: 'success', lines: ['Mixed reset! Changes working directory mein hain, staging khali.'] }
  },
}

