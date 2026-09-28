import type { CommandDef } from '../types'
import { lastCommit } from '../repo'

/** Adds files to staging. Supports `git add <file>` and `git add .` */
export const add: CommandDef = {
  name: 'add',
  description: 'File ko staging area mein bhejo (commit ke liye tayyar karo).',
  usage: 'git add <file> | git add .',
  examples: ['git add app.js', 'git add .'],
  execute(args, ctx) {
    const repo = ctx.repo
    if (!repo.initialized) {
      return { kind: 'error', lines: ["Pehle 'git init' karo, tabhi Git files track karega."] }
    }
    if (args.length === 0) {
      return {
        kind: 'error',
        lines: ['Kya add karna hai? File ka naam do, ya sab ke liye: git add .'],
      }
    }
    const last = lastCommit(repo)
    const target = args[0]

    if (target === '.') {
      const names = new Set<string>([
        ...Object.keys(repo.workdir),
        ...(last ? Object.keys(last.snapshot) : []),
      ])
      let any = false
      for (const n of names) {
        const wd = repo.workdir[n]
        if (wd === undefined) {
          // deletion staging
          if (last && last.snapshot[n] !== undefined && !repo.stagedDeletions.includes(n)) {
            repo.stagedDeletions.push(n)
            any = true
          }
        } else if (!last || last.snapshot[n] !== wd || !(n in repo.staged)) {
          repo.staged[n] = wd
          any = true
        }
      }
      if (!any) return { kind: 'info', lines: ['Add karne jaisa kuch nahi — sab pehle se staged hai.'] }
      return { kind: 'success', lines: ['Sab files staging area mein pahunch gayi.'] }
    }

    // single file
    const wd = repo.workdir[target]
    if (wd === undefined) {
      const committed = last && last.snapshot[target] !== undefined
      if (committed) {
        repo.stagedDeletions.push(target)
        return { kind: 'success', lines: [`'${target}' ki deletion stage kar di.`] }
      }
      return {
        kind: 'error',
        lines: [`'${target}' naam ki file mili hi nahi!`, 'Tip: `ls` se dekho kaunsi files hain.'],
      }
    }
    repo.staged[target] = wd
    return { kind: 'success', lines: [`'${target}' staging area mein aa gayi.`] }
  },
}
