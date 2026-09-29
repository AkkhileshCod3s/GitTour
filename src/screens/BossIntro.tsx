import { useEffect, useState } from 'react'
import { Mascot } from '../components/Mascot'
import { IconWarning } from '../ui/Icons'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'

/** Full-screen dramatic BOSS LEVEL intro. */
export function BossIntro({ title, lang, onDone }: { title: string; accent: string; lang: Lang; onDone: () => void }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900)
    const t2 = setTimeout(onDone, 2200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="alertdialog"
      aria-label={t(STRINGS.boss.alert, lang)}
      style={{ background: 'var(--scrim)' }}
    >
      <div className="text-center bg-brut-panel border-4 border-lime rounded-brut-lg shadow-brut px-5 sm:px-10 py-6 sm:py-8 anim-pop max-w-[92vw]">
        <div className="flex justify-center mb-3">
          <Mascot mood="worried" size={72} />
        </div>
        <p className={`flex justify-center ${phase === 0 ? '' : 'hidden'}`}>
          <IconWarning size={40} className="text-danger" />
        </p>
        <p className={`font-display text-4xl ${phase === 0 ? 'hidden' : ''}`} style={{ color: 'rgb(var(--danger))' }}>
          {t(STRINGS.boss.warn, lang)}
        </p>
        <p className={`font-display text-2xl sm:text-3xl tracking-wide ${phase === 0 ? 'hidden' : ''}`} style={{ color: 'rgb(var(--danger))' }}>
          {t(STRINGS.boss.level, lang)}
        </p>
        <h2 className="mt-4 font-display text-xl text-lime">{title}</h2>
        <p className="mt-3 text-sm text-ink-mid font-bold">{t(STRINGS.boss.noHints, lang)}</p>
      </div>
    </div>
  )
}
