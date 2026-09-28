import type { CommandDef } from '../types'

export const config: CommandDef = {
  name: 'config',
  description: 'Apna naam aur email set karo (commit ke liye zaroori).',
  usage: 'git config user.name <naam> | git config user.email <email>',
  examples: ['git config user.name "Time Traveler"', 'git config user.email tt@time.io'],
  execute(args, ctx) {
    if (args.length < 2) {
      return {
        kind: 'error',
        lines: [
          'Naam ya email missing hai!',
          'Aise use karo: git config user.name "Tumhara Naam"',
          'Phir: git config user.email "tum@example.com"',
        ],
      }
    }
    const [key, value] = args
    if (key !== 'user.name' && key !== 'user.email') {
      return {
        kind: 'error',
        lines: [`'${key}' samajh nahi aaya. Sirf user.name aur user.email support karte hain.`],
      }
    }
    ctx.repo.config[key] = value
    return { kind: 'success', lines: [`Set ho gaya: ${key} = ${value}`] }
  },
}
