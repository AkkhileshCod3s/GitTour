import type { PlayerProgress } from './progress'
import type { Level } from '../levels/worlds'

export interface Badge {
  id: string
  name: string
  desc: string
  icon: 'star' | 'shield' | 'bolt' | 'clock' | 'crown' | 'flame' | 'globe' | 'wrench'
}

export const BADGES: Badge[] = [
  { id: 'first-commit', name: 'First Commit', desc: 'Pehla commit complete kiya!', icon: 'star' },
  { id: 'conflict-crusher', name: 'Conflict Crusher', desc: 'Merge conflict level solve kiya.', icon: 'shield' },
  { id: 'time-machine', name: 'Time Machine', desc: 'Reset ya revert use kiya.', icon: 'clock' },
  { id: 'boss-slayer', name: 'Boss Slayer', desc: 'Koi bhi BOSS level beat kiya.', icon: 'crown' },
  { id: 'no-hints-world1', name: 'Pure Mind', desc: 'World 1 bina hints ke complete kiya.', icon: 'bolt' },
  { id: 'cloud-walker', name: 'Cloud Walker', desc: 'Push/pull complete kiya.', icon: 'globe' },
  { id: 'streak-3', name: 'On Fire', desc: '3 din ka streak.', icon: 'flame' },
  { id: 'perfect-world', name: 'Perfectionist', desc: 'Ek world ke saare levels 3-star par.', icon: 'wrench' },
]

/** Returns ids of newly unlocked badges. */
export function checkBadges(p: PlayerProgress, levels: Level[], justCompleted: Level, hintsUsed: number): string[] {
  const unlocked: string[] = []
  const has = (id: string) => p.badges.includes(id) || unlocked.includes(id)
  const completedIds = new Set([...p.completed, justCompleted.id])

  if (!has('first-commit') && completedIds.size >= 1) unlocked.push('first-commit')
  if (!has('conflict-crusher') && (justCompleted.id === 'w2l4' || justCompleted.id === 'w2boss')) unlocked.push('conflict-crusher')
  if (!has('time-machine') && justCompleted.world === 3) unlocked.push('time-machine')
  if (!has('boss-slayer') && justCompleted.isBoss) unlocked.push('boss-slayer')
  if (!has('cloud-walker') && justCompleted.world === 4) unlocked.push('cloud-walker')
  if (!has('no-hints-world1') && hintsUsed === 0) {
    const w1 = levels.filter((l) => l.world === 1)
    if (w1.every((l) => completedIds.has(l.id))) unlocked.push('no-hints-world1')
  }
  if (!has('streak-3') && p.streak >= 3) unlocked.push('streak-3')
  if (!has('perfect-world')) {
    for (let w = 1; w <= 4; w++) {
      const wl = levels.filter((l) => l.world === w)
      if (wl.length && wl.every((l) => (p.stars[l.id] ?? 0) >= 3)) {
        unlocked.push('perfect-world')
        break
      }
    }
  }
  return unlocked
}
