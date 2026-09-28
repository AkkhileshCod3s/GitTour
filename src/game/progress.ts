export interface PlayerProgress {
  xp: number
  stars: Record<string, number> // levelId -> 1..3
  completed: string[] // levelIds in order
  badges: string[]
  streak: number
  lastPlayedDay: string // YYYY-MM-DD
  soundOn: boolean
  hintsUsedTotal: number
}

export function defaultProgress(): PlayerProgress {
  return {
    xp: 0,
    stars: {},
    completed: [],
    badges: [],
    streak: 0,
    lastPlayedDay: '',
    soundOn: false,
    hintsUsedTotal: 0,
  }
}

export function totalStars(p: PlayerProgress): number {
  return Object.values(p.stars).reduce((a, b) => a + b, 0)
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Updates streak when a level is completed today. */
export function touchStreak(p: PlayerProgress): void {
  const today = todayKey()
  if (p.lastPlayedDay === today) return
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  p.streak = p.lastPlayedDay === yesterday ? p.streak + 1 : 1
  p.lastPlayedDay = today
}
