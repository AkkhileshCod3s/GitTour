import type { PlayerProgress } from './game/progress'
import { defaultProgress } from './game/progress'

const KEY = 'git-time-traveler-progress-v1'

/** ALL localStorage access lives here only. Every call wrapped in try/catch. */
export function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>
    // graceful merge over defaults (handles corrupt/partial data)
    const d = defaultProgress()
    return {
      xp: typeof parsed.xp === 'number' ? parsed.xp : d.xp,
      stars: typeof parsed.stars === 'object' && parsed.stars ? parsed.stars : d.stars,
      completed: Array.isArray(parsed.completed) ? parsed.completed : d.completed,
      badges: Array.isArray(parsed.badges) ? parsed.badges : d.badges,
      streak: typeof parsed.streak === 'number' ? parsed.streak : d.streak,
      lastPlayedDay: typeof parsed.lastPlayedDay === 'string' ? parsed.lastPlayedDay : d.lastPlayedDay,
      soundOn: typeof parsed.soundOn === 'boolean' ? parsed.soundOn : d.soundOn,
      hintsUsedTotal: typeof parsed.hintsUsedTotal === 'number' ? parsed.hintsUsedTotal : d.hintsUsedTotal,
    }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(p: PlayerProgress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* storage full/blocked — progress stays in memory only */
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

export const STORAGE_NOTICE = 'Progress is browser mein save hota hai. Browser data clear karne pe reset ho jayega.'
