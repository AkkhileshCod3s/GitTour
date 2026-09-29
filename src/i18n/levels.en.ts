/**
 * English overrides for per-level strings. Anything not listed falls back to
 * the Hinglish original (which also serves as content for 'hinglish' mode).
 */
export const LEVEL_TEXT_EN: Record<string, { title?: string; story: string; explanation: string; task: string; hints?: string[] }> = {
  w1l1: {
    title: 'What is Git?',
    story: 'Time Traveler! This is a broken timeline. Remember Google Docs "version history"? Git is exactly that — but for code. Let’s go!',
    explanation: 'git init turns this folder into a Git timeline. git add sends a file to the staging area. git commit makes a permanent snapshot of your changes.',
    task: 'Initialize the repo, set your name/email, add app.js and commit it with the message "first timeline".',
    hints: [
      'Run git init first.',
      'git config user.name "Name" and git config user.email "email" — then git add app.js',
      'git init → git config user.name "TT" → git config user.email tt@t.io → git add app.js → git commit -m "first timeline"',
    ],
  },
  w1l2: {
    title: 'Secret of the Staging Area',
    story: 'Two new files are lying in the timeline. You don’t have to save everything at once — Git first collects files in "staging".',
    explanation: 'git add <file> stages only one file. git add . stages everything. Use git status to see where each file is.',
    task: 'Stage index.html and commit it. Then add style.css and make a second commit. (2 commits total)',
    hints: [
      'Run git status to see where the files are.',
      'First commit only index.html: git add index.html → git commit -m "..."',
      'git add index.html; git commit -m "html"; git add style.css; git commit -m "css"',
    ],
  },
  w1l3: {
    title: 'History Detective',
    story: 'Something in the timeline changed... but what? Time to become a history detective — find the change!',
    explanation: 'git log shows commit history. git diff shows unstaged changes. git diff --staged shows changes in the staging area.',
    task: 'Run git diff to see what changed in app.js. Then stage the change and commit it.',
    hints: [
      'git diff shows the difference: old lines with "- ", new lines with "+ ".',
      'Now git add app.js.',
      'git add app.js → git commit -m "update greeting"',
    ],
  },
  w1l4: {
    title: 'No Commit Without a Message',
    story: 'Files exist in the timeline but there are no snapshots. Git is stopping you until your identity is set!',
    explanation: 'Before committing, user.name and user.email must be set — this records who made the change.',
    task: 'Set your identity and commit all files. Try the -am shortcut!',
    hints: [
      'git config user.name "Name" — quotes are optional.',
      'git add . stages all files at once.',
      'git config user.name "TT" → git config user.email tt@t.io → git add . → git commit -m "secrets saved"',
    ],
  },
  w1boss: {
    title: 'BOSS: Broken Timeline',
    story: 'BOSS LEVEL! You get an old timeline — with no hints. You remember it all, right? init, config, add, commit!',
    explanation: 'You’ve learned everything. Go save the timeline!',
    task: 'Init a new repo, set your identity, add both files and save them in one commit.',
    hints: [],
  },
  w2l1: {
    title: 'Open a Parallel Universe',
    story: 'A new world door has opened! A branch = a new parallel universe where you can experiment without touching the main timeline.',
    explanation: 'git branch <name> creates a branch. git switch <name> moves to it. git switch -c <name> creates + moves.',
    task: 'Create a branch named feature and switch to it.',
    hints: [
      'git branch feature creates the branch.',
      'git switch feature moves you there.',
      'One command: git switch -c feature',
    ],
  },
  w2l2: {
    title: 'Two Worlds, Two Jobs',
    story: 'You’re on the feature branch. Create a new file here — the main timeline stays safe!',
    explanation: 'Committing on a branch only advances that branch, not main.',
    task: 'While on feature: create quantum.js (echo "entangled" > quantum.js), then add + commit.',
    hints: [
      'echo "entangled" > quantum.js creates the file.',
      'git add quantum.js then commit.',
      'echo "entangled" > quantum.js → git add quantum.js → git commit -m "quantum"',
    ],
  },
  w2l3: {
    title: 'Join the Universes (Merge)',
    story: 'Now bring the two universes together! If main hasn’t diverged, Git simply "fast-forwards" — like skipping a video.',
    explanation: 'git merge <branch> brings that branch’s commits into your current branch.',
    task: 'Switch to main and merge feature into it.',
    hints: [
      'First git switch main.',
      'Now git merge feature.',
      'git switch main → git merge feature',
    ],
  },
  w2l4: {
    title: 'CONFLICT! Step by Step',
    story: 'DANGER! Both universes changed the SAME file differently. Git is confused — only you can decide.',
    explanation: 'The file gets <<<<<<< / ======= / >>>>>>> markers. Edit the content (in the editor), then git add + git commit.',
    task: 'Merge, resolve the conflict: set the file to "final", add it, commit it.',
    hints: [
      'Run git merge feature — you’ll get a conflict.',
      'cat spell.txt shows the markers. Edit the content to "final".',
      'git merge feature → edit file to "final" → git add spell.txt → git commit -m "resolve"',
    ],
  },
  w2boss: {
    title: 'BOSS: Multiverse Chaos',
    story: 'BOSS! Three universes in chaos. Merge them into a clean timeline with no hints.',
    explanation: 'You have everything: switch, merge, add, commit. Show them!',
    task: 'Even messier: merge the feature branch, resolve the conflict ("unified" content), everything must be committed.',
    hints: [],
  },
  w3l1: {
    title: 'Bring the File Back',
    story: 'Time Machine online! Someone corrupted a file’s content — restore it from the last commit.',
    explanation: 'git restore <file> brings the file back to its last-commit state. git restore --staged <file> removes it from staging.',
    task: 'Restore curse.txt to its previous content.',
    hints: [
      'git restore curse.txt.',
      'Just one command: git restore curse.txt',
      'git restore curse.txt — done!',
    ],
  },
  w3l2: {
    title: 'Accidentally Staged',
    story: 'Oops! secret.txt accidentally landed in the staging area. Get it out before it gets committed!',
    explanation: 'git restore --staged <file> moves the file back from staging to the working directory.',
    task: 'Unstage secret.txt (don’t commit that file!).',
    hints: [
      'git restore --staged secret.txt',
      'This only removes the file from staging; it doesn’t delete it.',
      'git restore --staged secret.txt',
    ],
  },
  w3l3: {
    title: 'Reverse the Time Paradox',
    story: 'A bad commit slipped into history! Don’t delete it — REVERT it, creating a new commit.',
    explanation: 'git revert <commit-id> undoes that commit’s changes by creating a NEW commit. History stays safe.',
    task: 'Revert the bad commit (the one that created doom.txt). Use git log --oneline to find its id.',
    hints: [
      'git log --oneline shows the "doom" commit’s id.',
      'git revert <id> — full id or a unique prefix works.',
      'git log --oneline → git revert <doom-commit-id>',
    ],
  },
  w3l4: {
    title: 'Time Rewind (Reset)',
    story: 'Two commits — the second one is wrong. Rewind the timeline to the first commit and wipe out the mistake.',
    explanation: 'git reset --hard <id> moves the branch to that commit AND resets the workdir. DANGER: un-committed work is lost!',
    task: 'Hard reset to the first commit (the bad commit disappears).',
    hints: [
      'git log --oneline gives you the first commit’s id.',
      'git reset --hard <id>',
      'git log --oneline → git reset --hard <first-commit-id>',
    ],
  },
  w3boss: {
    title: 'BOSS: Time Repair Master',
    story: 'FINAL BOSS of this world! Three problems, no hints: unstage a secret, revert a bad commit, and restore a cursed file.',
    explanation: 'restore + revert + reset — you have all three weapons.',
    task: 'Unstage secret.txt, restore cursed.txt to its last-commit content, and verify everything.',
    hints: [],
  },
  w4l1: {
    title: 'Open the Cloud Portal',
    story: 'Cloud Portal! Now the timeline connects to the world. First, add a remote.',
    explanation: 'git remote add origin <url> connects a cloud repo. git push origin <branch> sends commits.',
    task: 'Add a remote named "origin" and push the main branch.',
    hints: [
      'git remote add origin https://gittime.dev/timeline',
      'Now git push origin main.',
      'git remote add origin url → git push origin main',
    ],
  },
  w4l2: {
    title: 'Bring It Back from the Cloud',
    story: 'Another time traveler pushed a new commit to the cloud! Pull to sync your timeline.',
    explanation: 'git pull = fetch (download) + merge (join). You’ll see both steps in the output.',
    task: 'Run git pull to fetch the latest cloud commit.',
    hints: [
      'Only one command needed: git pull',
      'Pull = fetch + merge, both happen automatically.',
      'git pull',
    ],
  },
  w4boss: {
    title: 'BOSS: Cloud Guardian',
    story: 'FINAL BOSS! The portal’s guardian will test you: connect a remote, make a new commit, push — with no hints.',
    explanation: 'remote add + commit + push. The whole world is watching!',
    task: 'Add the remote, create prophecy.txt ("the portal is open"), add+commit, then push.',
    hints: [],
  },
}
