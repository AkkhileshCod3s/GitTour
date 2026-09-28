import type { Level } from './worlds'

/** Stars: 3 = no hints & <= par, 2 = no hints but over par OR 1 hint, 1 = rest. */
export function starRating(level: Level, commandsUsed: number, hintsUsed: number): 1 | 2 | 3 {
  if (hintsUsed === 0) {
    if (commandsUsed <= level.parCommands) return 3
    return 2
  }
  if (hintsUsed === 1 && commandsUsed <= level.parCommands + 2) return 2
  return 1
}

export function xpForLevel(level: Level, stars: number): number {
  const base = level.isBoss ? 120 : 50
  return base * stars
}

export type Rank = 'Beginner' | 'Apprentice' | 'Pro' | 'Git Master'

export function rankForXp(xp: number): Rank {
  if (xp >= 1500) return 'Git Master'
  if (xp >= 700) return 'Pro'
  if (xp >= 250) return 'Apprentice'
  return 'Beginner'
}

export const RANKS: Rank[] = ['Beginner', 'Apprentice', 'Pro', 'Git Master']
