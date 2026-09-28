let audioCtx: AudioContext | null = null
let muted = true

export function setMuted(m: boolean): void {
  muted = m
}

export function isMuted(): boolean {
  return muted
}

function ctx(): AudioContext | null {
  if (muted) return null
  try {
    if (!audioCtx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      audioCtx = new AC()
    }
    return audioCtx
  } catch {
    return null
  }
}

function tone(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.04): void {
  const c = ctx()
  if (!c) return
  try {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(vol, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
    o.connect(g)
    g.connect(c.destination)
    o.start()
    o.stop(c.currentTime + dur)
  } catch {
    /* ignore */
  }
}

export const sfx = {
  key(): void {
    tone(880, 0.03, 'square', 0.015)
  },
  success(): void {
    tone(523, 0.09)
    setTimeout(() => tone(659, 0.09), 90)
    setTimeout(() => tone(784, 0.14), 180)
  },
  error(): void {
    tone(196, 0.18, 'sawtooth', 0.05)
  },
  levelComplete(): void {
    tone(523, 0.1)
    setTimeout(() => tone(659, 0.1), 110)
    setTimeout(() => tone(784, 0.1), 220)
    setTimeout(() => tone(1047, 0.22), 330)
  },
  badge(): void {
    tone(988, 0.08, 'triangle', 0.05)
    setTimeout(() => tone(1319, 0.16, 'triangle', 0.05), 90)
  },
}
