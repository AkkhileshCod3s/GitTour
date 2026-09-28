import type { Repo } from '../git/types'

/** A world = one phase of Git learning. */
export interface World {
  id: number
  name: string
  theme: 'cyan' | 'magenta' | 'amber' | 'green'
  accent: string
  storyHinglish: string[]
}

/** Level defined as pure DATA. */
export interface Level {
  id: string
  world: number
  title: string
  storyHinglish: string
  explanationHinglish: string
  task: string
  startState: {
    repo: Partial<Repo> & { initialized: boolean }
  }
  goal: {
    /** All conditions must hold on final repo state. */
    minCommits?: number
    headBranch?: string
    branchExists?: string[]
    /** file name -> required workdir content ('*' = any) */
    files?: Record<string, string>
    /** file must NOT exist in workdir */
    filesAbsent?: string[]
    cleanTree?: boolean
    minMergeCommits?: number
    remoteConnected?: boolean
    pushed?: boolean
  }
  hints: string[]
  allowedCommands: string[] | '*'
  parCommands: number
  isBoss: boolean
}

export const WORLDS: World[] = [
  {
    id: 1,
    name: 'The First Timeline',
    theme: 'cyan',
    accent: '#22d3ee',
    storyHinglish: [
      'Time Machine chalu ho gayi hai... par timeline (repo) tootig hui hai!',
      'Tumhe Git commands se is timeline ko theek karna hai.',
    ],
  },
  {
    id: 2,
    name: 'Parallel Universes',
    theme: 'magenta',
    accent: '#e879f9',
    storyHinglish: [
      'Ek timeline kaafi nahi! Ab tum parallel universes (branches) khol sakte ho.',
      'Universes ko merge karke nayi realities banao — par conflicts se bach ke!',
    ],
  },
  {
    id: 3,
    name: 'The Time Machine',
    theme: 'amber',
    accent: '#fbbf24',
    storyHinglish: [
      'Galtiyan ho gayi? Koi baat nahi — time machine mein undo button hai!',
      'restore, revert, reset se mistakes ko mitao aur timeline ko theek karo.',
    ],
  },
  {
    id: 4,
    name: 'The Cloud Portal',
    theme: 'green',
    accent: '#34d399',
    storyHinglish: [
      'Tumhari timelines ab sirf tumhare paas nahi — cloud portal kholo!',
      'Remote se push/pull karke duniya ke saath timeline share karo.',
    ],
  },
]
