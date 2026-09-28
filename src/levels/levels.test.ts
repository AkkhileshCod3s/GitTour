import { describe, it, expect } from 'vitest'
import { LEVELS } from './levels'
import { checkGoal } from './checker'
import { starRating, xpForLevel, rankForXp } from './scoring'
import { emptyRepo } from '../git/repo'
import type { Repo, GitContext } from '../git/types'
import { registry } from '../git/registry'

function ctxFor(repo: Partial<Repo>): { repo: Repo } & GitContext {
  return { repo: { ...emptyRepo('t'), ...repo } as Repo, cwd: '' }
}

describe('level data integrity', () => {
  it('has unique ids and at least one boss per world 1-4', () => {
    const ids = new Set(LEVELS.map((l) => l.id))
    expect(ids.size).toBe(LEVELS.length)
    for (const w of [1, 2, 3, 4]) {
      expect(LEVELS.some((l) => l.world === w && l.isBoss)).toBe(true)
    }
  })
  it('boss levels have no hints', () => {
    for (const l of LEVELS) {
      if (l.isBoss) expect(l.hints.length).toBe(0)
    }
  })
})

describe('checker', () => {
  it('w1l1 goal passes after solving', () => {
    const lvl = LEVELS.find((l) => l.id === 'w1l1')!
    const ctx = ctxFor(lvl.startState.repo)
    const run = (s: string) => registry.run(s, ctx)
    run('git init')
    run('git config user.name TT')
    run('git config user.email tt@t.io')
    run('git add app.js')
    run('git commit -m "first timeline"')
    expect(checkGoal(lvl, ctx.repo, ctx)).toBe(true)
  })
  it('w1l1 goal fails before solving', () => {
    const lvl = LEVELS.find((l) => l.id === 'w1l1')!
    const ctx = ctxFor(lvl.startState.repo)
    expect(checkGoal(lvl, ctx.repo, ctx)).toBe(false)
  })
  it('cleanTree requires no dirty files', () => {
    const lvl = LEVELS.find((l) => l.id === 'w1l2')!
    const ctx = ctxFor(lvl.startState.repo)
    // 2 commits but nothing staged-committed properly (workdir dirty is fine; staged? no)
    registry.run('git add index.html', ctx)
    registry.run('git commit -m "html"', ctx)
    expect(checkGoal(lvl, ctx.repo, ctx)).toBe(false) // only 1 commit
    registry.run('git add style.css', ctx)
    registry.run('git commit -m "css"', ctx)
    expect(checkGoal(lvl, ctx.repo, ctx)).toBe(true)
  })
  it('w2l1 detects branch switch', () => {
    const lvl = LEVELS.find((l) => l.id === 'w2l1')!
    const ctx = ctxFor(lvl.startState.repo)
    expect(checkGoal(lvl, ctx.repo, ctx)).toBe(false)
    registry.run('git switch -c feature', ctx)
    expect(checkGoal(lvl, ctx.repo, ctx)).toBe(true)
  })
})

describe('scoring', () => {
  const lvl = LEVELS.find((l) => l.id === 'w1l1')!
  it('3 stars: no hints, at par', () => {
    expect(starRating(lvl, 5, 0)).toBe(3)
  })
  it('2 stars: no hints, over par', () => {
    expect(starRating(lvl, 7, 0)).toBe(2)
  })
  it('2 stars: one hint at par', () => {
    expect(starRating(lvl, 5, 1)).toBe(2)
  })
  it('1 star: many hints', () => {
    expect(starRating(lvl, 9, 2)).toBe(1)
  })
  it('boss gives more xp', () => {
    const boss = LEVELS.find((l) => l.isBoss)!
    expect(xpForLevel(boss, 3)).toBeGreaterThan(xpForLevel(lvl, 3))
  })
  it('rank thresholds', () => {
    expect(rankForXp(0)).toBe('Beginner')
    expect(rankForXp(300)).toBe('Apprentice')
    expect(rankForXp(800)).toBe('Pro')
    expect(rankForXp(2000)).toBe('Git Master')
  })
})
