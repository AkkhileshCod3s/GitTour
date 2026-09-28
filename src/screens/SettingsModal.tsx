import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { STORAGE_NOTICE } from '../storage'

interface Props {
  open: boolean
  onClose: () => void
  soundOn: boolean
  onToggleSound: () => void
}

export function SettingsModal({ open, onClose, soundOn, onToggleSound }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="⚙ SETTINGS">
      <div className="space-y-4 text-sm">
        <label className="flex items-center justify-between gap-4">
          <span>🔊 Sound effects</span>
          <button
            onClick={onToggleSound}
            className="focus-neon font-display text-[9px] border rounded px-3 py-1.5"
            style={{ borderColor: soundOn ? '#34d399' : '#64748b', color: soundOn ? '#34d399' : '#94a3b8' }}
            aria-pressed={soundOn}
          >
            {soundOn ? 'ON' : 'OFF'}
          </button>
        </label>
        <p className="text-xs text-ink-low border-t border-space-border pt-3">ℹ {STORAGE_NOTICE}</p>
        <div className="text-right">
          <Button size="sm" onClick={onClose}>DONE</Button>
        </div>
      </div>
    </Modal>
  )
}
