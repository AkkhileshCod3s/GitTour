/**
 * Sound module reduced to a no-op: the app shows no sound controls anywhere,
 * so no audio is ever played.
 */
export function setMuted(_m: boolean): void {
  /* no-op */
}

export function isMuted(): boolean {
  return true
}

function tone(): void {
  /* no-op */
}

export const sfx = {
  key(): void {
    tone()
  },
  success(): void {
    tone()
  },
  error(): void {
    tone()
  },
  levelComplete(): void {
    tone()
  },
  badge(): void {
    tone()
  },
}
