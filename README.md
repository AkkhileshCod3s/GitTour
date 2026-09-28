# Git Time Traveler 🕹⏳

Ek browser-based **game** jo Git sikhata hai — fake terminal mein commands type karo, live commit graph dekho, timelines repair karo. No backend, no real Git — kuch bhi nahi tootega.

## Tech

Vite + React + TypeScript + Tailwind + SVG + Web Audio + localStorage. Tests: Vitest.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest (engine + levels)
npm run build    # dist/ ready for Vercel / GitHub Pages
```

## How to add a NEW COMMAND (e.g. `git stash`)

1. Create `src/git/commands/stash.ts`:

```ts
import type { CommandDef } from '../types'
export const stash: CommandDef = {
  name: 'stash',
  description: 'Changes ko temporarily side mein rakho.',
  usage: 'git stash',
  examples: ['git stash'],
  execute(args, ctx) {
    // mutate ctx.repo, return lines
    return { kind: 'success', lines: ['Changes stashed!'] }
  },
}
```

2. Register it in `src/git/registry.ts`:

```ts
import { stash } from './commands/stash'
// commands array mein add karo: stash,
```

3. (Optional) Test in `src/git/git.test.ts`. Bas — UI, help, aur tab-completion automatic pickup karte hain.

> Note: flags (jaise `-m`) registry `ctx.flagBag` mein daalta hai; args ke bina `git commit -am` wale commands `ctx.flagBag ?? []` padho.

## How to add a NEW LEVEL

`src/levels/levels.ts` mein ek object add karo:

```ts
{
  id: 'w2l5', world: 2, title: 'Merge Marathon',
  storyHinglish: '...', explanationHinglish: '...', task: '...',
  startState: { repo: { initialized: true, workdir: {...}, commits: {...}, branches: {...}, head: { kind: 'branch', name: 'main' } } },
  goal: { minCommits: 3, headBranch: 'main', cleanTree: true },  // STATE-based check
  hints: ['small', 'bigger', 'solution'],
  allowedCommands: ['branch', 'switch', 'merge', 'add', 'commit', 'status', 'log'],
  parCommands: 4, isBoss: false,
}
```

Star rating automatic hai: no hints + ≤ parCommands = 3★ (see `src/levels/scoring.ts`).

## How to add a NEW BADGE

`src/game/achievements.ts`:

```ts
{ id: 'my-badge', name: 'My Badge', desc: 'Kya kiya isse milta hai.', icon: 'bolt' }
```

Unlock condition `checkBadges()` (tests) aur `computeBadges()` (`src/App.tsx`) dono mein add karo.

## Architecture (why it looks like this)

```
src/git/       → pure Git engine. NO React imports. 100% testable.
src/levels/    → levels are DATA; checker compares final STATE to goal (not commands).
src/game/      → XP, stars, badges, streak, sound.
src/ui/        → design-system components (Button, Panel, Modal...).
src/screens/   → Title, WorldMap, Level, LevelComplete, BossIntro, Profile.
src/components/→ Terminal (CRT), CommitGraph (SVG), AreasPanel, HUD, Mascot.
src/storage.ts → ALL localStorage I/O in one file, try/catch wrapped.
```

Design choices: engine/UI separation (testability), state-based win checking (multiple solutions allowed), data-driven levels (add without touching code), all animation via transform/opacity (mobile-friendly), `prefers-reduced-motion` respected globally.

All art is original inline SVG; sounds are generated with Web Audio. Fonts: Press Start 2P / JetBrains Mono / Nunito via Google Fonts.
