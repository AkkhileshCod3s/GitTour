import { it } from 'vitest'
import { emptyRepo } from './repo'
import type { GitContext } from './types'
import { registry } from './registry'

it('debug', () => {
  const ctx: GitContext = { repo: emptyRepo('t'), cwd: '' }
  const run = (s: string) => console.log('>', s, '=>', JSON.stringify(registry.run(s, ctx)))
  run('git init'); run('git config user.name TT'); run('git config user.email tt@t.io')
  ctx.repo.workdir['app.js'] = 'console.log(1)'
  run('git add .'); run('git commit -m "first"')
  run('git switch -c a')
  ctx.repo.workdir['a.txt'] = 'A'
  run('git add .'); run('git commit -m "A"')
  run('git switch main')
  run('git switch -c b')
  ctx.repo.workdir['b.txt'] = 'B'
  run('git add .'); run('git commit -m "B"')
  run('git switch main')
  run('git merge b')
  console.log('SNAP', JSON.stringify(Object.values(ctx.repo.commits).map(c => ({ id: c.id, m: c.message, p: c.parents }))))
  // revert
  const bad = ctx.repo.branches['main'].head
  console.log('REVERT', JSON.stringify(registry.run('git revert ' + bad, ctx)))
  console.log('WD', JSON.stringify(ctx.repo.workdir))
  // reset --soft
  const first = (Object.values(ctx.repo.commits)[0] as { id: string }).id
  console.log('SOFT', JSON.stringify(registry.run('git reset --soft ' + first, ctx)))
  console.log('STAGED', JSON.stringify(ctx.repo.staged), 'WD', JSON.stringify(ctx.repo.workdir))
})
