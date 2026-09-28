import type { Level } from './worlds'

export const LEVELS: Level[] = [
  // ---------- WORLD 1: basics ----------
  {
    id: 'w1l1',
    world: 1,
    title: 'Git Kya Hai?',
    storyHinglish:
      'Time Traveler! Ye ek tooti hui timeline hai. Google Docs ka "version history" yaad hai? Git bilkul waisa hai — par code ke liye. Chalo shuru karte hain.',
    explanationHinglish:
      'git init = is folder ko Git timeline banata hai. git add = file ko staging area mein bhejo. git commit = changes ka permanent snapshot.',
    task: 'Repository init karo, apna naam/email set karo, app.js ko add karke "first timeline" message se commit karo.',
    startState: { repo: { initialized: false, workdir: { 'app.js': 'console.log("hello timeline")' } } },
    goal: { minCommits: 1, files: { 'app.js': 'console.log("hello timeline")' } },
    hints: [
      'Pehle git init chalao.',
      'git config user.name "Naam" aur git config user.email "email" — phir git add app.js',
      'git init → git config user.name "TT" → git config user.email tt@t.io → git add app.js → git commit -m "first timeline"',
    ],
    allowedCommands: ['config', 'init', 'add', 'commit', 'status', 'log', 'diff', 'ls', 'cat', 'touch', 'clear', 'help'],
    parCommands: 5,
    isBoss: false,
  },
  {
    id: 'w1l2',
    world: 1,
    title: 'Staging Area Ka Raaz',
    storyHinglish:
      'Timeline mein do nayi files padi hain. Sab kuch ek saath save karna zaroori nahi — Git pehle files ko "staging" mein ikattha karta hai.',
    explanationHinglish:
      'git add <file> sirf ek file stage karta hai. git add . sab stage karta hai. git status dekho kaun kahan hai.',
    task: 'index.html stage karo, commit karo. Phir style.css add karke doosra commit banao. (2 commits total)',
    startState: {
      repo: {
        initialized: true,
        config: { 'user.name': 'TT', 'user.email': 'tt@t.io' },
        workdir: { 'index.html': '<h1>Timeline</h1>', 'style.css': 'body{}' },
      },
    },
    goal: { minCommits: 2, cleanTree: true },
    hints: [
      'git status chala ke dekho files kahan hain.',
      'Pehla commit sirf index.html ka: git add index.html → git commit -m "..."',
      'git add index.html; git commit -m "html"; git add style.css; git commit -m "css"',
    ],
    allowedCommands: ['config', 'init', 'add', 'commit', 'status', 'log', 'diff', 'ls', 'cat', 'touch', 'clear', 'help'],
    parCommands: 4,
    isBoss: false,
  },
  {
    id: 'w1l3',
    world: 1,
    title: 'History Detective',
    storyHinglish:
      'Timeline mein kuch badla hai... par kya? Tumhe history ka detective banna hai — changes dhoondo!',
    explanationHinglish:
      'git log = commit history. git diff = unstaged changes. git diff --staged = staging area ke changes.',
    task: 'git diff chala ke dekho app.js mein kya badla. Phir change stage karke commit karo.',
    startState: {
      repo: {
        initialized: true,
        config: { 'user.name': 'TT', 'user.email': 'tt@t.io' },
        workdir: { 'app.js': 'console.log("hello timeline v2")' },
        commits: {
          a1b2c3d: {
            id: 'a1b2c3d',
            message: 'first timeline',
            parents: [],
            timestamp: 1700000000000,
            snapshot: { 'app.js': 'console.log("hello timeline")' },
            changedFiles: ['app.js'],
          },
        },
        branches: { main: { name: 'main', head: 'a1b2c3d' } },
        head: { kind: 'branch', name: 'main' },
      },
    },
    goal: { minCommits: 2, files: { 'app.js': 'console.log("hello timeline v2")' }, cleanTree: true },
    hints: [
      'git diff se farak dikhega: purani line "- ", nayi line "+ ".',
      'Ab git add app.js karo.',
      'git add app.js → git commit -m "update greeting"',
    ],
    allowedCommands: ['config', 'init', 'add', 'commit', 'status', 'log', 'diff', 'ls', 'cat', 'touch', 'clear', 'help'],
    parCommands: 2,
    isBoss: false,
  },
  {
    id: 'w1l4',
    world: 1,
    title: 'Bina Message Ke Kuch Nahi',
    storyHinglish:
      'Timeline mein files hain par koi snapshot nahi. Git tumhe rok raha hai jab tak identity set nahi hoti!',
    explanationHinglish:
      'Commit se pehle user.name aur user.email set karna zaroori hai — isse pata chalta hai kaam kisne kiya.',
    task: 'Identity set karo aur saari files commit karo. -am shortcut try karo!',
    startState: {
      repo: { initialized: true, workdir: { 'notes.txt': 'timeline secrets', 'map.dat': 'XYZ' } },
    },
    goal: { minCommits: 1, cleanTree: true },
    hints: [
      'git config user.name "Naam" — bina quotes bhi chalega.',
      'git add . sab files ek saath stage karta hai.',
      'git config user.name "TT" → git config user.email tt@t.io → git add . → git commit -m "secrets saved"',
    ],
    allowedCommands: ['config', 'init', 'add', 'commit', 'status', 'log', 'diff', 'ls', 'cat', 'touch', 'clear', 'help'],
    parCommands: 4,
    isBoss: false,
  },
  {
    id: 'w1boss',
    world: 1,
    title: 'BOSS: Tooti Timeline',
    storyHinglish:
      'BOSS LEVEL! Ek purani timeline milegi — bina kisi hint ke. Sab yaad hai na? init, config, add, commit!',
    explanationHinglish: 'Sab kuch tumne seekha hai. Ab timeline ko bachao!',
    task: 'Naya repo init karo, identity set karo, dono files add karke ek commit mein save karo.',
    startState: { repo: { initialized: false, workdir: { 'hero.log': 'time traveler was here', 'vault.key': 'L0CKED' } } },
    goal: { minCommits: 1, files: { 'hero.log': 'time traveler was here', 'vault.key': 'L0CKED' }, cleanTree: true },
    hints: [], // boss: no hints
    allowedCommands: ['config', 'init', 'add', 'commit', 'status', 'log', 'diff', 'ls', 'cat', 'touch', 'clear', 'help'],
    parCommands: 5,
    isBoss: true,
  },

  // ---------- WORLD 2: branching/merging ----------
  {
    id: 'w2l1',
    world: 2,
    title: 'Parallel Universe Kholo',
    storyHinglish:
      'Nayi duniya ka darwaza khula! Branch = ek naya parallel universe jahan tum bina main timeline sambhale experiment kar sakte ho.',
    explanationHinglish:
      'git branch <name> = nayi branch banao. git switch <name> = us branch pe jao. git switch -c <name> = banao + jao.',
    task: 'feature naam ki branch banao aur wahan switch karo.',
    startState: {
      repo: seededMain(),
    },
    goal: { minCommits: 1, headBranch: 'feature', branchExists: ['main', 'feature'] },
    hints: [
      'git branch feature se branch banti hai.',
      'git switch feature se tum wahan jaa sakte ho.',
      'Ek hi command: git switch -c feature',
    ],
    allowedCommands: ['branch', 'switch', 'status', 'log', 'add', 'commit', 'ls', 'cat', 'clear', 'help'],
    parCommands: 1,
    isBoss: false,
  },
  {
    id: 'w2l2',
    world: 2,
    title: 'Do Duniya, Do Kaam',
    storyHinglish:
      'Feature branch pe ho. Yahan ek nayi file banao — main timeline safe rahegi!',
    explanationHinglish: 'Branch pe commit karne se sirf us branch aage badhti hai, main nahi.',
    task: 'feature branch pe ho: quantum.js banao (echo "entangled" > quantum.js), add + commit karo.',
    startState: {
      repo: seededMain(),
    },
    goal: { minCommits: 2, headBranch: 'feature', files: { 'quantum.js': 'entangled' } },
    hints: [
      'echo "entangled" > quantum.js se file banti hai.',
      'git add quantum.js phir commit.',
      'echo "entangled" > quantum.js → git add quantum.js → git commit -m "quantum"',
    ],
    allowedCommands: ['branch', 'switch', 'status', 'log', 'add', 'commit', 'echo', 'ls', 'cat', 'touch', 'clear', 'help'],
    parCommands: 3,
    isBoss: false,
  },
  {
    id: 'w2l3',
    world: 2,
    title: 'Universes Ko Jodo (Merge)',
    storyHinglish:
      'Ab do universes ko ek mein lao! Agar main ne aage badha ho to Git bas "fast-forward" karta hai — jaise video skip.',
    explanationHinglish: 'git merge <branch> = us branch ke commits current branch mein lao.',
    task: 'main pe switch karo aur feature ko merge karo.',
    startState: {
      repo: seededDiverged(),
    },
    goal: { minCommits: 2, headBranch: 'main', files: { 'quantum.js': 'entangled' }, cleanTree: true },
    hints: [
      'Pehle git switch main karo.',
      'Ab git merge feature.',
      'git switch main → git merge feature',
    ],
    allowedCommands: ['branch', 'switch', 'merge', 'status', 'log', 'add', 'commit', 'ls', 'cat', 'clear', 'help'],
    parCommands: 2,
    isBoss: false,
  },
  {
    id: 'w2l4',
    world: 2,
    title: 'CONFLICT! Step by Step',
    storyHinglish:
      'DANGER! Dono universes ne EK HI file ko alag tarike se badla. Git confuse hai — sirf tum decide kar sakte ho.',
    explanationHinglish:
      'File mein <<<<<<< / ======= / >>>>>>> markers aate hain. Content ko edit karo (editor mein), phir git add + git commit.',
    task: 'Merge karo, conflict resolve karo: file ko "final" content do, add karo, commit karo.',
    startState: {
      repo: seededConflict(),
    },
    goal: { minCommits: 3, headBranch: 'main', files: { 'spell.txt': 'final' }, cleanTree: true, minMergeCommits: 1 },
    hints: [
      'Pehle git merge feature chalao — conflict aayega.',
      'cat spell.txt se markers dekho. Editor se content "final" karo.',
      'git merge feature → edit file to "final" → git add spell.txt → git commit -m "resolve"',
    ],
    allowedCommands: ['branch', 'switch', 'merge', 'status', 'log', 'add', 'commit', 'echo', 'cat', 'ls', 'clear', 'help'],
    parCommands: 4,
    isBoss: false,
  },
  {
    id: 'w2boss',
    world: 2,
    title: 'BOSS: Multiverse Chaos',
    storyHinglish:
      'BOSS! Teen universes ka chaos hai. Bina hints ke sab ko merge karke ek clean timeline banao.',
    explanationHinglish: 'Sab tumhare paas hai: switch, merge, add, commit. Dikha do!',
    task: 'Aur bhi messy: feature branch merge karo, conflict resolve karo ("unified" content), sab commit hona chahiye.',
    startState: {
      repo: seededBossConflict(),
    },
    goal: { minCommits: 4, headBranch: 'main', files: { 'core.txt': 'unified' }, cleanTree: true, minMergeCommits: 1 },
    hints: [], // boss: no hints
    allowedCommands: ['branch', 'switch', 'merge', 'status', 'log', 'add', 'commit', 'echo', 'cat', 'ls', 'clear', 'help'],
    parCommands: 5,
    isBoss: true,
  },

  // ---------- WORLD 3: undoing ----------
  {
    id: 'w3l1',
    world: 3,
    title: 'File Ko Wapas Lao',
    storyHinglish:
      'Time Machine online! Kisi ne file ka content bigaad diya — tumhe last commit se wapas lena hai.',
    explanationHinglish:
      'git restore <file> = file ko last commit wali state pe wapas. git restore --staged <file> = staging se hatao.',
    task: 'curse.txt ka content wapas lao (restore).',
    startState: {
      repo: seededCurse(),
    },
    goal: { minCommits: 1, files: { 'curse.txt': 'clean water' }, cleanTree: true },
    hints: [
      'git restore curse.txt.',
      'Bas ek command: git restore curse.txt',
      'git restore curse.txt — ho gaya!',
    ],
    allowedCommands: ['restore', 'status', 'log', 'diff', 'ls', 'cat', 'clear', 'help'],
    parCommands: 1,
    isBoss: false,
  },
  {
    id: 'w3l2',
    world: 3,
    title: 'Galti Se Stage Ho Gaya',
    storyHinglish:
      'Oops! secret.txt galti se staging area mein aa gaya. Commit hone se pehle use nikalo!',
    explanationHinglish: 'git restore --staged <file> = file ko staging se wapas working directory mein bhejo.',
    task: 'secret.txt ko staging se nikalo (commit mat karo us file ko!).',
    startState: {
      repo: seededStagedSecret(),
    },
    goal: { minCommits: 1, filesAbsent: [], cleanTree: false, files: { 'secret.txt': 'crush ka naam' } },
    hints: [
      'git restore --staged secret.txt',
      'Isse file staging se sirf nikalti hai, delete nahi hoti.',
      'git restore --staged secret.txt',
    ],
    allowedCommands: ['restore', 'status', 'log', 'diff', 'ls', 'cat', 'clear', 'help'],
    parCommands: 1,
    isBoss: false,
  },
  {
    id: 'w3l3',
    world: 3,
    title: 'Time Paradox Ulta Karo',
    storyHinglish:
      'Ek galat commit history mein ghus gaya! Delete nahi karna — uska ULTA (revert) karke naya commit banao.',
    explanationHinglish:
      'git revert <commit-id> = us commit ke changes undo karke NAYA commit banata hai. History safe rehti hai.',
    task: 'Galat commit (jisne doom.txt banaya) ko revert karo. git log --oneline se id dekho.',
    startState: {
      repo: seededBadCommit(),
    },
    goal: { minCommits: 3, filesAbsent: ['doom.txt'] },
    hints: [
      'git log --oneline se "doom" commit ki id dekho.',
      'git revert <id> — poora id ya shuruaati hissa chalega.',
      'git log --oneline → git revert <doom-commit-id>',
    ],
    allowedCommands: ['revert', 'log', 'status', 'diff', 'ls', 'cat', 'clear', 'help'],
    parCommands: 2,
    isBoss: false,
  },
  {
    id: 'w3l4',
    world: 3,
    title: 'Time Rewind (Reset)',
    storyHinglish:
      'Do commits hain — doosra wala galat. Timeline ko pehle commit pe rewind karo, sab kuch wipe out.',
    explanationHinglish:
      'git reset --hard <id> = branch ko us commit pe le jao + workdir bhi wahi kar do. DANGER: un-committed kaam chala jayega!',
    task: 'Pehle commit pe hard reset karo (galat commit hat jayega).',
    startState: {
      repo: seededBadCommit(),
    },
    goal: { minCommits: 1, filesAbsent: ['doom.txt'] },
    hints: [
      'git log --oneline se pehle commit ki id lo.',
      'git reset --hard <id>',
      'git log --oneline → git reset --hard <first-commit-id>',
    ],
    allowedCommands: ['reset', 'log', 'status', 'diff', 'ls', 'cat', 'clear', 'help'],
    parCommands: 2,
    isBoss: false,
  },
  {
    id: 'w3boss',
    world: 3,
    title: 'BOSS: Time Repair Master',
    storyHinglish:
      'FINAL BOSS of this world! Teen problems, bina hints: staged secret nikalo, galat commit revert karo, aur cursed file restore karo.',
    explanationHinglish: 'restore + revert + reset — teeno hathiyar tumhare paas hain.',
    task: 'secret.txt ko staging se nikalo, cursed.txt ko last commit wala content wapas lao, aur sab check karo.',
    startState: {
      repo: seededBossUndo(),
    },
    goal: { minCommits: 2, files: { 'cursed.txt': 'pure light' } },
    hints: [], // boss
    allowedCommands: ['restore', 'revert', 'reset', 'log', 'status', 'diff', 'add', 'commit', 'ls', 'cat', 'clear', 'help'],
    parCommands: 2,
    isBoss: true,
  },

  // ---------- WORLD 4: remotes ----------
  {
    id: 'w4l1',
    world: 4,
    title: 'Cloud Portal Kholo',
    storyHinglish:
      'Cloud Portal! Ab timeline duniya se connect hogi. Pehle remote add karo.',
    explanationHinglish: 'git remote add origin <url> = cloud repo connect. git push origin <branch> = commits bhejo.',
    task: 'Remote "origin" add karo aur main branch push karo.',
    startState: { repo: seededMain() },
    goal: { minCommits: 1, remoteConnected: true, pushed: true },
    hints: [
      'git remote add origin https://gittime.dev/timeline',
      'Ab git push origin main.',
      'git remote add origin url → git push origin main',
    ],
    allowedCommands: ['remote', 'push', 'fetch', 'pull', 'status', 'log', 'ls', 'cat', 'clear', 'help'],
    parCommands: 2,
    isBoss: false,
  },
  {
    id: 'w4l2',
    world: 4,
    title: 'Cloud Se Wapas Lao',
    storyHinglish:
      'Doosre time traveler ne cloud pe naya commit dhakel diya! Pull karke apni timeline sync karo.',
    explanationHinglish: 'git pull = fetch (download) + merge (jodo). Dono steps output mein dikhenge.',
    task: 'git pull chala ke cloud ka latest commit lao.',
    startState: {
      repo: seededWithRemote(),
    },
    goal: { minCommits: 3, files: { 'cloud.txt': 'from another traveler' }, cleanTree: true },
    hints: [
      'Sirf ek command chahiye: git pull',
      'Pull = fetch + merge, dono automatic honge.',
      'git pull',
    ],
    allowedCommands: ['remote', 'push', 'fetch', 'pull', 'status', 'log', 'ls', 'cat', 'clear', 'help'],
    parCommands: 1,
    isBoss: false,
  },
  {
    id: 'w4boss',
    world: 4,
    title: 'BOSS: Cloud Guardian',
    storyHinglish:
      'LAST BOSS! Portal ka guardian test karega: remote connect karo, naya commit banao, push karo — bina hints ke.',
    explanationHinglish: 'remote add + commit + push. Saari duniya dekh rahi hai!',
    task: 'Remote add karo, prophecy.txt banao ("the portal is open"), add+commit, phir push.',
    startState: { repo: seededWithRemote(false) },
    goal: { minCommits: 2, remoteConnected: true, pushed: true, files: { 'prophecy.txt': 'the portal is open' } },
    hints: [], // boss
    allowedCommands: ['remote', 'push', 'fetch', 'pull', 'add', 'commit', 'status', 'log', 'echo', 'touch', 'ls', 'cat', 'clear', 'help'],
    parCommands: 4,
    isBoss: true,
  },
]

// ---------- seed state builders (fresh objects each call) ----------

type Workdir = Record<string, string>
type Commits = Record<string, { id: string; message: string; parents: string[]; timestamp: number; snapshot: Record<string, string>; changedFiles: string[] }>
type Branches = Record<string, { name: string; head: string }>

function mk(id: string, message: string, parents: string[], ts: number, snapshot: Workdir, changed: string[]) {
  return { id, message, parents, timestamp: ts, snapshot, changedFiles: changed }
}

function seededMain() {
  const workdir: Workdir = { 'app.js': 'console.log("start")' }
  const commits: Commits = {
    a1b2c3d: mk('a1b2c3d', 'first timeline', [], 1700000000000, { 'app.js': 'console.log("start")' }, ['app.js']),
  }
  const branches: Branches = { main: { name: 'main', head: 'a1b2c3d' } }
  return { initialized: true, config: { 'user.name': 'TT', 'user.email': 'tt@t.io' }, workdir, commits, branches, head: { kind: 'branch' as const, name: 'main' }, staged: {} as Record<string, string>, stagedDeletions: [] as string[] }
}

function seededDiverged() {
  const base = seededMain()
  base.workdir['quantum.js'] = 'entangled'
  base.commits['e4f5a6b'] = mk('e4f5a6b', 'quantum file on feature', ['a1b2c3d'], 1700000001000, { 'app.js': 'console.log("start")', 'quantum.js': 'entangled' }, ['quantum.js'])
  base.branches['feature'] = { name: 'feature', head: 'e4f5a6b' }
  return base
}

function seededConflict() {
  const base = seededMain()
  // main advanced: spell.txt = "main magic"
  base.workdir['spell.txt'] = 'main magic'
  base.commits['c1d2e3f'] = mk('c1d2e3f', 'main magic spell', ['a1b2c3d'], 1700000002000, { 'app.js': 'console.log("start")', 'spell.txt': 'main magic' }, ['spell.txt'])
  base.branches['main'] = { name: 'main', head: 'c1d2e3f' }
  // feature edited same file differently
  base.commits['f7e8d9c'] = mk('f7e8d9c', 'feature magic spell', ['a1b2c3d'], 1700000003000, { 'app.js': 'console.log("start")', 'spell.txt': 'feature magic' }, ['spell.txt'])
  base.branches['feature'] = { name: 'feature', head: 'f7e8d9c' }
  return base
}

function seededBossConflict() {
  const base = seededConflict()
  base.commits['b0a9f8e'] = mk('b0a9f8e', 'main adds core', ['c1d2e3f'], 1700000004000, { 'app.js': 'console.log("start")', 'spell.txt': 'main magic', 'core.txt': 'fragmented' }, ['core.txt'])
  base.branches['main'] = { name: 'main', head: 'b0a9f8e' }
  base.workdir['core.txt'] = 'fragmented'
  return base
}

function seededCurse() {
  const base = seededMain()
  base.workdir['curse.txt'] = 'cursed murky water!!!'
  base.commits['d4e5f6a'] = mk('d4e5f6a', 'add curse file', ['a1b2c3d'], 1700000005000, { 'app.js': 'console.log("start")', 'curse.txt': 'clean water' }, ['curse.txt'])
  base.branches['main'] = { name: 'main', head: 'd4e5f6a' }
  return base
}

function seededStagedSecret() {
  const base = seededMain()
  base.workdir['secret.txt'] = 'crush ka naam'
  base.staged = { 'secret.txt': 'crush ka naam' } as Record<string, string>
  return base
}

function seededBadCommit() {
  const base = seededMain()
  base.workdir['doom.txt'] = 'DOOM!'
  base.commits['b4d0m5s'] = mk('b4d0m5s', 'doom commit (oops)', ['a1b2c3d'], 1700000006000, { 'app.js': 'console.log("start")', 'doom.txt': 'DOOM!' }, ['doom.txt'])
  base.branches['main'] = { name: 'main', head: 'b4d0m5s' }
  return base
}

function seededBossUndo() {
  const base = seededMain()
  base.workdir['cursed.txt'] = 'dark corruption'
  base.staged = { 'secret.txt': 'hidden plans' } as Record<string, string>
  base.workdir['secret.txt'] = 'hidden plans'
  base.commits['c0rsed1'] = mk('c0rsed1', 'add cursed file', ['a1b2c3d'], 1700000007000, { 'app.js': 'console.log("start")', 'cursed.txt': 'pure light' }, ['cursed.txt'])
  base.branches['main'] = { name: 'main', head: 'c0rsed1' }
  return base
}

function seededWithRemote(hasCloudCommit = true) {
  const base = seededMain()
  const remoteCommits: Commits = { a1b2c3d: base.commits['a1b2c3d'] }
  const remoteRepo = {
    initialized: true,
    config: {},
    workdir: { 'app.js': 'console.log("start")' } as Workdir,
    staged: {} as Record<string, string>,
    stagedDeletions: [] as string[],
    commits: remoteCommits,
    branches: { main: { name: 'main', head: 'a1b2c3d' } } as Branches,
    head: { kind: 'branch' as const, name: 'main' },
  }
  if (hasCloudCommit) {
    remoteCommits['c10ud01'] = mk('c10ud01', 'cloud update from another traveler', ['a1b2c3d'], 1700000008000, { 'app.js': 'console.log("start")', 'cloud.txt': 'from another traveler' }, ['cloud.txt'])
    remoteRepo.branches['main'] = { name: 'main', head: 'c10ud01' }
    remoteRepo.workdir['cloud.txt'] = 'from another traveler'
  }
  return {
    ...base,
    remote: {
      name: 'origin',
      url: 'https://gittime.dev/timeline',
      repo: remoteRepo,
      tracking: { main: hasCloudCommit ? 'c10ud01' : 'a1b2c3d' },
    },
  }
}
