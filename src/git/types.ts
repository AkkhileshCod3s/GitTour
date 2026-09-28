// ---------- Git engine types (pure data, no React) ----------

/** A file inside the working directory or a commit snapshot. */
export interface WorkFile {
  name: string
  content: string
}

/** One commit in history. */
export interface Commit {
  id: string // 7-char fake hash
  message: string
  parents: string[] // empty for root, 2 for merge commits
  timestamp: number
  /** Full snapshot of tracked files at this commit. */
  snapshot: Record<string, string>
  /** Files that changed vs the first parent (for diff/revert). */
  changedFiles: string[]
}

export interface Branch {
  name: string
  /** Commit id the branch points to. */
  head: string
}

/** Where HEAD points: a branch (normal) or a raw commit (detached). */
export type HeadRef = { kind: 'branch'; name: string } | { kind: 'commit'; id: string }

export type ConfigValue = string

export interface Repo {
  name: string
  initialized: boolean
  /** Working directory files. */
  workdir: Record<string, string>
  /** Staged file contents (subset/override of workdir vs last commit). */
  staged: Record<string, string>
  /** Files staged for deletion from the last commit. */
  stagedDeletions: string[]
  commits: Record<string, Commit>
  branches: Record<string, Branch>
  head: HeadRef
  config: Record<string, ConfigValue>
}

/** A second repo object simulates the fake "remote". */
export interface RemoteRef {
  name: string // e.g. "origin"
  repo: Repo
  /** Branch name -> commit id on remote. */
  tracking: Record<string, string>
  url?: string
}

export interface GitContext {
  repo: Repo
  remote?: RemoteRef
  /** Current working directory of the fake shell (for ls/touch/cat). */
  cwd: string
  /** Registry injects parsed flags here for commands that need them. */
  flagBag?: string[]
  /** Set during a merge conflict; branch name we tried to merge. */
  conflictBranch?: string
  /** Registry injects all commands here (for help). */
  allCommands?: CommandDef[]
}

/** Result of running a command. */
export interface CommandResult {
  lines: string[]
  /** 'error' makes the terminal flash red; 'success' flashes green. */
  kind: 'info' | 'error' | 'success'
}

export interface CommandDef {
  name: string
  description: string
  usage: string
  examples: string[]
  /** Parsed args come without the command itself. */
  execute(args: string[], ctx: GitContext): CommandResult
}

/** Parsed input like: git commit -m "msg" -> { command:'commit', flags:['m'], args:['msg'] } */
export interface ParsedCommand {
  command: string // '' for shell commands like clear/ls
  flags: string[]
  args: string[]
  raw: string
}
