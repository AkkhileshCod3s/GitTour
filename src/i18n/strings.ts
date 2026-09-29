import type { Lang } from '../storage'

/**
 * All user-facing strings. Level story/explanation/task/hints override
 * via levels.en.ts; everything else lives here.
 * NOTE: decorative glyphs were removed from strings — icons are rendered
 * as real SVG components next to the text (see src/ui/Icons.tsx).
 */
export const STRINGS = {
  nav: {
    home: { hinglish: 'HOME', english: 'HOME' },
    playground: { hinglish: 'PLAYGROUND', english: 'PLAYGROUND' },
    arcade: { hinglish: 'ARCADE', english: 'ARCADE' },
    startLearning: { hinglish: 'START LEARNING', english: 'START LEARNING' },
    export: { hinglish: 'Export progress', english: 'Export progress' },
    help: { hinglish: 'Help', english: 'Help' },
    language: { hinglish: 'Language', english: 'Language' },
    favorites: { hinglish: 'Favorite levels', english: 'Favorite levels' },
  },
  marquee: {
    commands: {
      hinglish: 'GIT PUSH ★ GIT ADD ★ GIT COMMIT -M ★ GIT SWITCH -C ★ GIT MERGE ★ GIT REBASE -I ★ GIT STASH POP ★ ',
      english: 'GIT PUSH ★ GIT ADD ★ GIT COMMIT -M ★ GIT SWITCH -C ★ GIT MERGE ★ GIT REBASE -I ★ GIT STASH POP ★ ',
    },
  },
  landing: {
    heroLine1: { hinglish: 'TRAVEL THROUGH TIME.', english: 'TRAVEL THROUGH TIME.' },
    heroLine2: { hinglish: 'LEARN GIT.', english: 'LEARN GIT.' },
    heroSub: {
      hinglish: 'Git Tour ek retro time-machine hai jahan tum real Git commands type karte ho, broken timelines repair karte ho, aur commit graph ko live reshape hote dekhte ho — ek ek level mein naya power.',
      english: 'Git Tour is a retro time machine where you type real Git commands, repair broken timelines, and watch the commit graph reshape live — a new power every level.',
    },
    startLearning: { hinglish: 'Start Learning', english: 'Start Learning' },
    cheatSheet: { hinglish: 'Cheat Sheet', english: 'Cheat Sheet' },
    difficulty: { hinglish: 'Difficulty', english: 'Difficulty' },
    difficultyLevel: { hinglish: 'CASUAL', english: 'CASUAL' },
    shop: { hinglish: 'Shop', english: 'Shop' },
    miniGames: { hinglish: 'Mini Games', english: 'Mini Games' },
    map: { hinglish: 'LEARNING PATH', english: 'LEARNING PATH' },
    profile: { hinglish: 'PROFILE', english: 'PROFILE' },
    continue: { hinglish: 'CONTINUE', english: 'CONTINUE' },
  },
  stats: {
    score: { hinglish: 'SCORE', english: 'SCORE' },
    completed: { hinglish: 'COMPLETED', english: 'COMPLETED' },
    rank: { hinglish: 'RANK', english: 'RANK' },
    world: { hinglish: 'WORLD', english: 'WORLD' },
  },
  preview: {
    branch: { hinglish: 'feature', english: 'feature' },
    xp: { hinglish: '+50 XP', english: '+50 XP' },
    label: { hinglish: 'LIVE DEMO', english: 'LIVE DEMO' },
  },
  app: { tagline: { hinglish: 'Tooti hui timelines repair karo. Git commands type karo, commits ka graph dekho — aur Git master bano!', english: 'Repair broken timelines. Type Git commands, watch the commit graph — and become a Git master!' } },
  title: {
    pressStart: { hinglish: 'PRESS START', english: 'PRESS START' },
    cont: { hinglish: 'CONTINUE', english: 'CONTINUE' },
    profile: { hinglish: 'PROFILE', english: 'PROFILE' },
    sound: { hinglish: 'Sound', english: 'Sound' },
  },
  hud: {
    map: { hinglish: 'MAP', english: 'MAP' },
    profile: { hinglish: 'PROFILE', english: 'PROFILE' },
    settings: { hinglish: 'Settings', english: 'Settings' },
    stars: { hinglish: 'Total stars', english: 'Total stars' },
    streak: { hinglish: 'Daily streak', english: 'Daily streak' },
    closeMap: { hinglish: 'Open learning path', english: 'Open learning path' },
    openProfile: { hinglish: 'Open profile and badges', english: 'Open profile and badges' },
    home: { hinglish: 'Back to home', english: 'Back to home' },
    leaveConfirm: { hinglish: 'Level chal raha hai — ghar jana hai? Level ka in-level progress reset ho jayega (completed levels safe hain).', english: 'A level is in progress — go home? In-level progress resets (completed levels are safe).' },
  },
  map: {
    title: { hinglish: 'TIMELINE MAP', english: 'TIMELINE MAP' },
    toTitle: { hinglish: 'TITLE', english: 'TITLE' },
    lockedWorld: { hinglish: 'Pichle world ka BOSS harao pehle.', english: 'Defeat the previous world’s BOSS first.' },
    storageNotice: { hinglish: 'Progress is browser mein save hota hai. Browser data clear karne pe reset ho jayega.', english: 'Progress is saved in your browser. Clearing browser data will reset it.' },
  },
  level: {
    loading: { hinglish: 'Timeline load ho rahi hai...', english: 'Loading the timeline...' },
    welcome: { hinglish: 'Timeline load ho gayi. Terminal tumhara intezaar kar raha hai...', english: 'Timeline loaded. The terminal is waiting for you...' },
    taskPrefix: { hinglish: 'Task: ', english: 'Task: ' },
    commitGraph: { hinglish: 'COMMIT GRAPH', english: 'COMMIT GRAPH' },
    fileAreas: { hinglish: 'FILE AREAS', english: 'FILE AREAS' },
    reset: { hinglish: 'RESET', english: 'RESET' },
    restart: { hinglish: 'Restart this level', english: 'Restart this level' },
    terminalTitle: { hinglish: 'TIME TERMINAL', english: 'TIME TERMINAL' },
    emptyGraph: { hinglish: 'Abhi koi commit nahi. Pehla commit banao — timeline yahan dikhegi!', english: 'No commits yet. Make your first commit — the timeline will appear here!' },
    hintBtn: { hinglish: 'HINT', english: 'HINT' },
    hintLeft: { hinglish: 'left', english: 'left' },
    hintStars: { hinglish: 'stars kam honge!', english: 'stars will drop!' },
    learn: { hinglish: 'LEARN (SEEKHO)', english: 'LEARN' },
    task: { hinglish: 'TASK', english: 'TASK' },
  },
  areas: {
    wd: { hinglish: '1. WORKING DIR', english: '1. WORKING DIR' },
    staging: { hinglish: '2. STAGING', english: '2. STAGING' },
    repo: { hinglish: '3. REPOSITORY', english: '3. REPOSITORY' },
    empty: { hinglish: '(khali)', english: '(empty)' },
    emptyRepo: { hinglish: '(koi commit nahi)', english: '(no commits yet)' },
  },
  terminal: {
    prompt: { hinglish: 'git>', english: 'git>' },
  },
  complete: {
    repaired: { hinglish: 'TIMELINE REPAIRED!', english: 'TIMELINE REPAIRED!' },
    bossBeaten: { hinglish: 'BOSS DEFEATED!', english: 'BOSS DEFEATED!' },
    learned: { hinglish: 'AAJ KYA SEEKHA', english: 'WHAT YOU LEARNED' },
    next: { hinglish: 'NEXT LEVEL', english: 'NEXT LEVEL' },
    retry: { hinglish: 'RETRY (for stars)', english: 'RETRY (for stars)' },
    map: { hinglish: 'MAP', english: 'MAP' },
    newBadge: { hinglish: 'NEW BADGE: ', english: 'NEW BADGE: ' },
  },
  boss: {
    warn: { hinglish: 'BOSS ALERT', english: 'BOSS ALERT' },
    level: { hinglish: 'BOSS LEVEL', english: 'BOSS LEVEL' },
    noHints: { hinglish: 'Koi hint nahi milega. All the best, Time Traveler!', english: 'No hints here. Good luck, Time Traveler!' },
    alert: { hinglish: 'boss level intro', english: 'boss level intro' },
  },
  profile: {
    title: { hinglish: 'PROFILE', english: 'PROFILE' },
    back: { hinglish: 'BACK', english: 'BACK' },
    rank: { hinglish: 'RANK', english: 'RANK' },
    xp: { hinglish: 'TOTAL XP', english: 'TOTAL XP' },
    stars: { hinglish: 'STARS', english: 'STARS' },
    streakLabel: { hinglish: 'STREAK', english: 'STREAK' },
    progress: { hinglish: 'PROGRESS: ', english: 'PROGRESS: ' },
    levels: { hinglish: 'levels', english: 'levels' },
    badges: { hinglish: 'BADGES', english: 'BADGES' },
    lockedBadge: { hinglish: '??? — khelo aur kholo!', english: '??? — play to unlock!' },
    danger: { hinglish: 'Danger zone: sab progress delete ho jayega (browser data).', english: 'Danger zone: all progress will be deleted (browser data).' },
    resetAll: { hinglish: 'RESET ALL', english: 'RESET ALL' },
  },
  settings: {
    title: { hinglish: 'SETTINGS', english: 'SETTINGS' },
    language: { hinglish: 'Language / Bhasha', english: 'Language' },
    langHinglish: { hinglish: 'Hinglish', english: 'Hinglish' },
    langEnglish: { hinglish: 'English', english: 'English' },
    theme: { hinglish: 'Theme', english: 'Theme' },
    light: { hinglish: 'Light', english: 'Light' },
    dark: { hinglish: 'Dark', english: 'Dark' },
    storage: { hinglish: 'Progress is browser mein save hota hai. Browser data clear karne pe reset ho jayega.', english: 'Progress is saved in your browser. Clearing browser data will reset it.' },
    done: { hinglish: 'DONE', english: 'DONE' },
  },
  toast: {
    badgeUnlocked: { hinglish: 'BADGE UNLOCKED!', english: 'BADGE UNLOCKED!' },
  },

  profile_confirm: {
    reset: { hinglish: 'Pakka? Sab progress delete ho jayega!', english: 'Sure? All progress will be deleted!' },
  },
} as const

export type StringKey = keyof typeof STRINGS

/** Look up a string in one language. */
export function t(entry: { hinglish: string; english: string }, lang: Lang): string {
  return entry[lang]
}
