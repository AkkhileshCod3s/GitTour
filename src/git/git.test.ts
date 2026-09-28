import { describe, it, expect, beforeEach } from 'vitest'
import { emptyRepo, makeHash } from './repo'
import type { GitContext } from './types'
import { registry } from './registry'

function makeCtx(): GitContext {
  return { repo: emptyRepo('test'), cwd: '' }
}

function run(input: string, ctx: GitContext) {
  return registry.run(input, ctx)
}

/** Setup helper: init + config + commit a file. */
function seedRepo(ctx: GitContext, files: Record<string, string> = { 'app.js': 'console.log(1)' }, msg = 'first') {
  run('git init', ctx)
  run('git config user.name TT', ctx)
  run('git config user.email tt@t.io', ctx)
  for (const [n, c] of Object.entries(files)) ctx.repo.workdir[n] = c
  run('git add .', ctx)
  const r = run(`git commit -m "${msg}"`, ctx)
  expect(r.kind).toBe('success')
}

describe('init/config', () => {
  it('init initializes repo once', () => {
    const ctx = makeCtx()
    expect(run('git init', ctx).kind).toBe('success')
    expect(run('git init', ctx).kind).toBe('info')
  })
  it('config sets values', () => {
    const ctx = makeCtx()
    run('git init', ctx)
    expect(run('git config user.name TT', ctx).kind).toBe('success')
    expect(ctx.repo.config['user.name']).toBe('TT')
  })
})

describe('add/commit', () => {
  let ctx: GitContext
  beforeEach(() => (ctx = makeCtx()))

  it('add + commit creates commit', () => {
    seedRepo(ctx)
    expect(Object.keys(ctx.repo.commits).length).toBe(1)
  })
  it('commit fails before init', () => {
    const r = run('git commit -m "x"', ctx)
    expect(r.kind).toBe('error')
  })
  it('commit fails without config', () => {
    run('git init', ctx)
    ctx.repo.workdir['a.js'] = 'x'
    run('git add a.js', ctx)
    const r = run('git commit -m "x"', ctx)
    expect(r.kind).toBe('error')
    expect(r.lines.join(' ')).toContain('config')
  })
  it('commit fails with nothing staged', () => {
    run('git init', ctx)
    run('git config user.name TT', ctx)
    run('git config user.email tt@t.io', ctx)
    const r = run('git commit -m "x"', ctx)
    expect(r.kind).toBe('error')
  })
  it('add missing file errors', () => {
    seedRepo(ctx)
    const r = run('git add nope.js', ctx)
    expect(r.kind).toBe('error')
  })
  it('-am stages tracked modifications', () => {
    seedRepo(ctx)
    ctx.repo.workdir['app.js'] = 'console.log(2)'
    const r = run('git commit -am "update"', ctx)
    expect(r.kind).toBe('success')
  })
})

describe('status/log/diff', () => {
  let ctx: GitContext
  beforeEach(() => (ctx = makeCtx()))

  it('status shows untracked files', () => {
    seedRepo(ctx)
    ctx.repo.workdir['new.js'] = ''
    const r = run('git status', ctx)
    expect(r.lines.join('\n')).toContain('new.js')
  })
  it('log --oneline lists commits', () => {
    seedRepo(ctx)
    ctx.repo.workdir['app.js'] = 'v2'
    run('git add .', ctx)
    run('git commit -m "second"', ctx)
    const r = run('git log --oneline', ctx)
    expect(r.lines.length).toBe(2)
    expect(r.lines[0]).toContain('second')
  })
  it('diff shows unstaged changes', () => {
    seedRepo(ctx)
    ctx.repo.workdir['app.js'] = 'console.log(2)'
    const r = run('git diff', ctx)
    expect(r.lines.join('\n')).toContain('+ console.log(2)')
  })
  it('diff --staged after add', () => {
    seedRepo(ctx)
    ctx.repo.workdir['app.js'] = 'v2'
    run('git add app.js', ctx)
    const r = run('git diff --staged', ctx)
    expect(r.lines.join('\n')).toContain('+ v2')
  })
})

describe('branch/switch/merge', () => {
  let ctx: GitContext
  beforeEach(() => (ctx = makeCtx()))

  it('branch create + switch', () => {
    seedRepo(ctx)
    expect(run('git branch feature', ctx).kind).toBe('success')
    expect(run('git switch feature', ctx).kind).toBe('success')
    expect(ctx.repo.head).toEqual({ kind: 'branch', name: 'feature' })
  })
  it('fast-forward merge', () => {
    seedRepo(ctx)
    run('git switch -c feature', ctx)
    ctx.repo.workdir['feat.js'] = 'f'
    run('git add .', ctx)
    run('git commit -m "feat"', ctx)
    run('git switch main', ctx)
    const r = run('git merge feature', ctx)
    expect(r.kind).toBe('success')
    expect(r.lines.join(' ')).toContain('Fast-forward')
  })
  it('true merge creates merge commit', () => {
    seedRepo(ctx)
    // diverge: branch first, then a commit on each side
    run('git switch -c b', ctx)
    ctx.repo.workdir['b.txt'] = 'B'
    run('git add .', ctx)
    run('git commit -m "B"', ctx)
    run('git switch main', ctx)
    ctx.repo.workdir['m.txt'] = 'M'
    run('git add .', ctx)
    run('git commit -m "main work"', ctx)
    const r = run('git merge b', ctx)
    expect(r.kind).toBe('success')
    const head = ctx.repo.branches['main'].head
    expect(ctx.repo.commits[head].parents.length).toBe(2)
  })
  it('conflict produces markers and resolves with add+commit', () => {
    seedRepo(ctx, { shared: 'base' })
    // branch first, then both sides edit the same file
    run('git switch -c feat', ctx)
    ctx.repo.workdir['shared'] = 'feat version'
    run('git add .', ctx)
    run('git commit -m "feat edit"', ctx)
    run('git switch main', ctx)
    ctx.repo.workdir['shared'] = 'main version'
    run('git add .', ctx)
    run('git commit -m "main edit"', ctx)
    const r = run('git merge feat', ctx)
    expect(r.kind).toBe('error')
    expect(ctx.repo.workdir['shared']).toContain('<<<<<<<')
    ctx.repo.workdir['shared'] = 'resolved'
    run('git add shared', ctx)
    const c = run('git commit -m "resolve conflict"', ctx)
    expect(c.kind).toBe('success')
    const head = ctx.repo.branches['main'].head
    expect(ctx.repo.commits[head].parents.length).toBe(2)
  })
  it('branch -d refuses current branch', () => {
    seedRepo(ctx)
    const r = run('git branch -d main', ctx)
    expect(r.kind).toBe('error')
  })
})

describe('restore/revert/reset', () => {
  let ctx: GitContext
  beforeEach(() => (ctx = makeCtx()))

  it('restore --staged unstages', () => {
    seedRepo(ctx)
    ctx.repo.workdir['app.js'] = 'v2'
    run('git add app.js', ctx)
    run('git restore --staged app.js', ctx)
    expect('app.js' in ctx.repo.staged).toBe(false)
  })
  it('restore workdir from last commit', () => {
    seedRepo(ctx)
    ctx.repo.workdir['app.js'] = 'changed'
    run('git restore app.js', ctx)
    expect(ctx.repo.workdir['app.js']).toBe('console.log(1)')
  })
  it('revert creates undo commit', () => {
    seedRepo(ctx)
    ctx.repo.workdir['app.js'] = 'v2'
    run('git add .', ctx)
    run('git commit -m "v2"', ctx)
    const bad = ctx.repo.branches['main'].head
    const r = run(`git revert ${bad}`, ctx)
    expect(r.kind).toBe('success')
    expect(ctx.repo.workdir['app.js']).toBe('console.log(1)')
  })
  it('reset --hard moves branch and wipes changes', () => {
    seedRepo(ctx)
    const first = ctx.repo.branches['main'].head
    ctx.repo.workdir['app.js'] = 'v2'
    run('git add .', ctx)
    run('git commit -m "v2"', ctx)
    const r = run(`git reset --hard ${first}`, ctx)
    expect(r.kind).toBe('success')
    expect(ctx.repo.branches['main'].head).toBe(first)
    expect(ctx.repo.workdir['app.js']).toBe('console.log(1)')
  })
  it('reset --soft keeps changes staged', () => {
    seedRepo(ctx)
    const first = ctx.repo.branches['main'].head
    ctx.repo.workdir['app.js'] = 'v2'
    run('git add .', ctx)
    run('git commit -m "v2"', ctx)
    run(`git reset --soft ${first}`, ctx)
    expect(ctx.repo.staged['app.js']).toBe('v2')
  })
  it('reset --mixed unstages', () => {
    seedRepo(ctx)
    const first = ctx.repo.branches['main'].head
    ctx.repo.workdir['app.js'] = 'v2'
    run('git add .', ctx)
    run('git commit -m "v2"', ctx)
    run(`git reset --mixed ${first}`, ctx)
    expect(ctx.repo.staged['app.js']).toBeUndefined()
    expect(ctx.repo.workdir['app.js']).toBe('v2')
  })
})

describe('remote/push/pull', () => {
  let ctx: GitContext
  beforeEach(() => (ctx = makeCtx()))

  it('push requires remote', () => {
    seedRepo(ctx)
    expect(run('git push origin main', ctx).kind).toBe('error')
  })
  it('remote add + push + pull flow', () => {
    seedRepo(ctx)
    expect(run('git remote add origin url', ctx).kind).toBe('success')
    expect(run('git push origin main', ctx).kind).toBe('success')
    ctx.repo.workdir['cloud.js'] = 'hi'
    run('git add .', ctx)
    run('git commit -m "cloud"', ctx)
    expect(run('git push origin main', ctx).kind).toBe('success')
    const head = ctx.repo.branches['main'].head
    run(`git reset --hard ${Object.keys(ctx.repo.commits)[0]}`, ctx)
    const r = run('git pull', ctx)
    expect(r.kind).toBe('success')
    expect(ctx.repo.branches['main'].head).toBe(head)
    expect(ctx.repo.workdir['cloud.js']).toBe('hi')
  })
})

describe('shell helpers', () => {
  it('touch/echo/cat/ls work', () => {
    const ctx = makeCtx()
    run('touch a.js', ctx)
    expect(run('echo "hello" > a.js', ctx).kind).toBe('success')
    expect(run('cat a.js', ctx).lines.join('')).toContain('hello')
    expect(run('ls', ctx).lines[0]).toContain('a.js')
    expect(run('rm a.js', ctx).kind).toBe('success')
  })
  it('unknown command suggests', () => {
    const ctx = makeCtx()
    const r = run('git stats', ctx)
    expect(r.lines.join(' ')).toContain('git status')
  })
  it('hashes are 7 chars', () => {
    expect(makeHash('x')).toMatch(/^[0-9a-f]{7}$/)
  })
})
