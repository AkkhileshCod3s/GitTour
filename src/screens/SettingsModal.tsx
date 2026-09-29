import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'

interface Props {
  open: boolean
  onClose: () => void
  lang: Lang
  onLang: (l: Lang) => void
}

export function SettingsModal({ open, onClose, lang, onLang }: Props) {
  const langOpts: Array<{ value: Lang; label: string }> = [
    { value: 'hinglish', label: t(STRINGS.settings.langHinglish, 'hinglish') },
    { value: 'english', label: t(STRINGS.settings.langEnglish, 'english') },
  ]

  return (
    <Modal open={open} onClose={onClose} title={t(STRINGS.settings.title, lang)}>
      <div className="space-y-5 text-sm">
        <div>
          <p className="font-display font-bold text-lime mb-2">{t(STRINGS.settings.language, lang)}</p>
          <div className="flex gap-2">
            {langOpts.map((o) => (
              <button
                key={o.value}
                onClick={() => onLang(o.value)}
                aria-pressed={lang === o.value}
                className={`focus-neon press-snap flex-1 font-bold font-display py-2 px-3 border-3 rounded-brut ${
                  lang === o.value
                    ? 'text-[#0A0A0A] border-[#0A0A0A] shadow-key bg-[linear-gradient(180deg,#C8FA57_0%,#B6F13A_45%,#8FD517_100%)]'
                    : 'bg-brut-panel text-lime border-lime shadow-key-sm'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-low border-t-3 border-theme pt-3 font-bold">{t(STRINGS.settings.storage, lang)}</p>
        <div className="text-right">
          <Button size="sm" onClick={onClose}>{t(STRINGS.settings.done, lang)}</Button>
        </div>
      </div>
    </Modal>
  )
}
