<p align="center">
  <img src="assets/banner.svg" alt="Git Tour - learn Git by playing" width="100%" />
</p>

<p align="center">
  <b>Ek browser-based game jo Git sikhata hai</b> — fake terminal mein commands type karo,<br/>
  live commit graph dekho, timelines repair karo.<br/>
  <b>No backend, no real Git — kuch bhi nahi tootega.</b>
</p>

<p align="center">
  <a href="https://gittour.vercel.app/">
    <img src="assets/play.svg" alt="Play now" />
  </a>
</p>

<p align="center">
  <img src="assets/chip-vite.svg" alt="Vite" />
  <img src="assets/chip-react.svg" alt="React" />
  <img src="assets/chip-ts.svg" alt="TypeScript" />
  <img src="assets/chip-tailwind.svg" alt="Tailwind" />
  <img src="assets/chip-svg.svg" alt="SVG" />
  <img src="assets/chip-audio.svg" alt="Web Audio" />
  <img src="assets/chip-storage.svg" alt="localStorage" />
  <img src="assets/chip-vitest.svg" alt="Vitest" />
</p>

<p align="center">
  <img src="assets/terminal.svg" alt="Git Tour terminal and live commit graph" width="100%" />
</p>

<a name="contents"></a>
<img src="assets/h-toc.svg" alt="Contents" width="100%" />

<p align="center">
  <a href="#about">About</a> ·
  <a href="#features">Features</a> ·
  <a href="#how-to-play">How to play</a> ·
  <a href="#tech">Tech</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="#scripts">Scripts</a> ·
  <a href="#deploy">Deploy</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#add-command">Add a command</a> ·
  <a href="#add-level">Add a level</a> ·
  <a href="#add-badge">Add a badge</a> ·
  <a href="#design">Design choices</a> ·
  <a href="#testing">Testing</a> ·
  <a href="#contributing">Contributing</a> ·
  <a href="#troubleshooting">Troubleshooting</a> ·
  <a href="#credits">Credits</a>
</p>

---

<a name="about"></a>
<img src="assets/h-about.svg" alt="About" width="100%" />

<p align="center">
  <img src="assets/scene-about.svg" alt="About Git Tour" width="100%" />
</p>

**Git Tour** ek game hai jisme tum Git commands ek **fake terminal** mein type karte ho, aur har command ka asar **live commit graph** par dekhte ho. Levels mein toote hue timelines (branches, commits, merges) ko repair karna hota hai.

Poora game browser mein chalta hai. Koi server nahi, koi real Git nahi — isliye tum jo bhi try karo, **kuch bhi nahi tootega**. Galti ho gayi? Level reset karo aur phir se khelo.

Live version: **https://gittour.vercel.app/**

<a name="features"></a>
<img src="assets/h-features.svg" alt="Features" width="100%" />

<p align="center">
  <img src="assets/features.svg" alt="Fake terminal, live graph, repair timelines, no backend" width="100%" />
</p>

- **CRT-style fake terminal** — real Git jaisi commands, help aur tab-completion ke saath.
- **Live commit graph** — SVG graph jo har command ke baad update hota hai.
- **Levels in worlds** — story, explanation aur task ke saath, boss levels bhi.
- **Hints** — 3 steps: chhota hint, bada hint, aur solution.
- **XP, stars, badges, streak** — progress aur rewards.
- **Sound effects** — Web Audio se generate hote hain, koi audio file nahi.
- **Progress saved** — `localStorage` mein, browser band karne ke baad bhi.
- **Mobile friendly** — animations `transform`/`opacity` se, aur `prefers-reduced-motion` respect hota hai.

<a name="how-to-play"></a>
<img src="assets/h-play.svg" alt="How to play" width="100%" />

<p align="center">
  <img src="assets/scene-play.svg" alt="Read story, type commands, watch graph, earn stars" width="100%" />
</p>

1. **Story padho** — level ka story, explanation aur task samjho.
2. **Commands type karo** — terminal mein Git commands chalao (jaise `git add`, `git commit`, `git switch`, `git merge`).
3. **Graph dekho** — har command ke baad commit graph aur areas panel badalte hain.
4. **Goal poora karo** — win check **state-based** hai: final repo goal se match kare to level complete, chahe tumne koi bhi raasta liya ho.
5. **Stars kamao** — **no hints + par commands ke andar = 3★**.

<a name="tech"></a>
<img src="assets/h-tech.svg" alt="Tech" width="100%" />

<p align="center">
  <img src="assets/scene-tech.svg" alt="Tech stack" width="100%" />
</p>

**Vite + React + TypeScript + Tailwind + SVG + Web Audio + localStorage.** Tests: Vitest.

<a name="quick-start"></a>
<img src="assets/h-setup.svg" alt="Quick start" width="100%" />

<p align="center">
  <img src="assets/scene-setup.svg" alt="Clone, install, dev, play" width="100%" />
</p>

**Prerequisites:** Node.js 18+ aur npm.

```bash
# 1. Clone
git clone <your-repo-url>
cd gittour

# 2. Install
npm install

# 3. Run
npm run dev      # http://localhost:5173
```

Browser mein `http://localhost:5173` kholo — bas, game ready hai.

<a name="scripts"></a>
<img src="assets/h-scripts.svg" alt="Scripts" width="100%" />

<p align="center">
  <img src="assets/scene-run.svg" alt="npm run dev" width="100%" />
</p>

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest (engine + levels)
npm run build    # dist/ ready for Vercel / GitHub Pages
```

| Command | Kya karta hai |
|---|---|
| `npm install` | Dependencies install karta hai |
| `npm run dev` | Dev server chalata hai (`http://localhost:5173`) |
| `npm test` | Vitest se engine aur levels ke tests chalata hai |
| `npm run build` | `dist/` mein production build banata hai |

<a name="deploy"></a>
<img src="assets/h-deploy.svg" alt="Deploy" width="100%" />

<p align="center">
  <img src="assets/scene-deploy.svg" alt="Build and deploy to Vercel or GitHub Pages" width="100%" />
</p>

Game ek static site hai (no backend), isliye kahin bhi host ho jata hai.

**Vercel**
1. Repo ko Vercel mein import karo.
2. Framework preset: **Vite**.
3. Build command: `npm run build`, output directory: `dist`.

**GitHub Pages**
1. `npm run build` chalao.
2. `dist/` ko Pages par publish karo.
3. Agar site subpath par hai (`username.github.io/gittour/`), to `vite.config` mein `base: '/gittour/'` set karo.

<a name="architecture"></a>
<img src="assets/h-arch.svg" alt="Architecture" width="100%" />

<p align="center">
  <img src="assets/scene-arch.svg" alt="Architecture overview" width="100%" />
</p>

*Why it looks like this:*

```
src/git/       → pure Git engine. NO React imports. 100% testable.
src/levels/    → levels are DATA; checker compares final STATE to goal (not commands).
src/game/      → XP, stars, badges, streak, sound.
src/ui/        → design-system components (Button, Panel, Modal...).
src/screens/   → Title, WorldMap, Level, LevelComplete, BossIntro, Profile.
src/components/→ Terminal (CRT), CommitGraph (SVG), AreasPanel, HUD, Mascot.
src/storage.ts → ALL localStorage I/O in one file, try/catch wrapped.
```

<a name="add-command"></a>
<img src="assets/h-command.svg" alt="Add a new command" width="100%" />

<p align="center">
  <img src="assets/scene-command.svg" alt="Create, register, test a command" width="100%" />
</p>

Example: `git stash`

**1.** Create `src/git/commands/stash.ts`:

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

**2.** Register it in `src/git/registry.ts`:

```ts
import { stash } from './commands/stash'
// commands array mein add karo: stash,
```

**3.** (Optional) Test in `src/git/git.test.ts`. Bas — UI, help, aur tab-completion automatic pickup karte hain.

> **Note:** flags (jaise `-m`) registry `ctx.flagBag` mein daalta hai; args ke bina `git commit -am` wale commands `ctx.flagBag ?? []` padho.

<a name="add-level"></a>
<img src="assets/h-level.svg" alt="Add a new level" width="100%" />

<p align="center">
  <img src="assets/scene-level.svg" alt="Level map with stars and boss" width="100%" />
</p>

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

Star rating automatic hai: **no hints + ≤ `parCommands` = 3★** (see `src/levels/scoring.ts`).

<a name="add-badge"></a>
<img src="assets/h-badge.svg" alt="Add a new badge" width="100%" />

<p align="center">
  <img src="assets/scene-badge.svg" alt="Badges and trophy" width="100%" />
</p>

`src/game/achievements.ts`:

```ts
{ id: 'my-badge', name: 'My Badge', desc: 'Kya kiya isse milta hai.', icon: 'bolt' }
```

Unlock condition `checkBadges()` (tests) aur `computeBadges()` (`src/App.tsx`) dono mein add karo.

<a name="design"></a>
<img src="assets/h-design.svg" alt="Design choices" width="100%" />

<p align="center">
  <img src="assets/scene-design.svg" alt="Design choices" width="100%" />
</p>

- **Engine/UI separation** — testability.
- **State-based win checking** — multiple solutions allowed.
- **Data-driven levels** — add without touching code.
- **Transform/opacity-only animation** — mobile-friendly, aur `prefers-reduced-motion` globally respect hota hai.

<a name="testing"></a>
<img src="assets/h-test.svg" alt="Testing" width="100%" />

<p align="center">
  <img src="assets/scene-test.svg" alt="All tests green" width="100%" />
</p>

```bash
npm test
```

Vitest engine (`src/git/`) aur levels dono ko test karta hai. Naya command ya level add karo to uska test bhi likho — engine pure hai (no React), isliye tests fast aur simple rehte hain. Badge unlock logic bhi `checkBadges()` ke through tests mein cover hota hai.

<a name="contributing"></a>
<img src="assets/h-contrib.svg" alt="Contributing" width="100%" />

<p align="center">
  <img src="assets/scene-contrib.svg" alt="Fork, branch, commit, PR, merged" width="100%" />
</p>

1. Repo **fork** karo aur clone karo.
2. Naya branch banao: `git switch -c my-feature`
3. Changes karo (naya command, level ya badge — upar ke guides dekho).
4. `npm test` aur `npm run build` chalao, dono pass hone chahiye.
5. Commit karo aur **Pull Request** kholo.

<a name="troubleshooting"></a>
<img src="assets/h-trouble.svg" alt="Troubleshooting" width="100%" />

<p align="center">
  <img src="assets/scene-trouble.svg" alt="Troubleshooting tips" width="100%" />
</p>

| Problem | Fix |
|---|---|
| `5173` port busy hai | Dusra process band karo, ya Vite ka port badlo (`npm run dev -- --port 3000`). |
| Install / build error | Node.js 18+ use karo, phir `node_modules` delete karke `npm install` dobara chalao. |
| Sound nahi aa raha | Browsers audio tab tak block karte hain jab tak tum page par click na karo. Ek baar click karo. |
| Progress reset ho gaya | Progress `localStorage` mein hota hai. Private window ya browser data clear karne par reset hota hai. |

<a name="credits"></a>
<img src="assets/h-credits.svg" alt="Credits" width="100%" />

<p align="center">
  <img src="assets/scene-credits.svg" alt="Fonts and credits" width="100%" />
</p>

All art is original inline SVG; sounds are generated with Web Audio. Fonts: Press Start 2P / JetBrains Mono / Nunito via Google Fonts.

<p align="center">
  <img src="assets/divider.svg" alt="" width="100%" />
</p>

<p align="center">
  <sub><code>$ git commit -m "game over? nahi — continue?"</code></sub>
</p>
