import { Logo } from '../ui/Logo'
import { IconSettings, IconUser, IconFlame, IconTrophy } from '../ui/Icons'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'
import type { PlayerProgress } from '../game/progress'

interface Props {
  screen: 'title' | 'map' | 'level' | 'profile'
  lang: Lang
  progress: PlayerProgress
  onHome: () => void
  onMap: () => void
  onProfile: () => void
  onSettings: () => void
  onLang: (l: Lang) => void
}

const pill =
  'focus-neon hidden md:flex items-center gap-1.5 rounded-full border-2 border-lime bg-brut-shade px-3 py-1.5 font-bold text-xs text-ink-hi'

/** Final nav bar: only real, distinct functionality. */
export function NavBar({ screen, lang, progress, onHome, onMap, onProfile, onSettings }: Props) {
  const link = (active: boolean) =>
    `focus-neon press-snap font-display text-sm tracking-tight px-4 py-1.5 rounded-full border-2 ${
      active
        ? 'bg-brut-panel text-lime border-lime shadow-key-xs font-bold'
        : 'text-ink-hi border-transparent hover:text-lime'
    }`

  return (
    <nav className="sticky top-0 z-40 w-full border-b-4 border-lime bg-brut-bg" style={{ boxShadow: '0 4px 0 rgba(0,0,0,0.4)' }}>
      <div className="max-w-7xl mx-auto flex items-center gap-2 px-3 py-2 whitespace-nowrap overflow-x-auto">
        <button onClick={onHome} className="focus-neon press-snap flex items-center shrink-0 rounded-brut px-1.5 py-1" aria-label="Git Tour home">
          <Logo size={30} mode="lockup" />
        </button>

        <div className="hidden md:flex items-center gap-1 ml-4 shrink-0">
          <button onClick={onHome} className={link(screen === 'title')} aria-current={screen === 'title' ? 'page' : undefined}>
            {t(STRINGS.nav.home, lang)}
          </button>
          <button onClick={onMap} className={link(screen === 'map' || screen === 'level')} aria-current={screen === 'map' ? 'page' : undefined}>
            {t(STRINGS.nav.playground, lang)}
          </button>
          <button onClick={onProfile} className={link(screen === 'profile')} aria-current={screen === 'profile' ? 'page' : undefined}>
            {t(STRINGS.nav.arcade, lang)}
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          {/* real tracked stats (from progress): streak + XP */}
          <span className={pill} title={t(STRINGS.hud.streak, lang)}>
            <IconFlame size={14} className="text-lime shrink-0" /> {progress.streak}
          </span>
          <span className={pill} title={t(STRINGS.profile.xp, lang)}>
            <IconTrophy size={14} className="text-lime shrink-0" /> {progress.xp} XP
          </span>

          {/* profile */}
          <button
            onClick={onProfile}
            className="focus-neon press-snap hidden sm:flex h-10 w-10 items-center justify-center rounded-full border-3 border-lime bg-brut-panel text-lime shadow-key-xs"
            aria-label={t(STRINGS.hud.openProfile, lang)}
            title={t(STRINGS.hud.openProfile, lang)}
          >
            <IconUser size={18} strokeWidth={2.4} />
          </button>

          {/* settings — the single gear entry (language selector lives inside the settings panel) */}
          <button
            onClick={onSettings}
            className="focus-neon press-snap flex h-10 w-10 items-center justify-center rounded-brut border-3 border-lime bg-brut-panel text-lime shadow-key-xs"
            aria-label={t(STRINGS.hud.settings, lang)}
            title={t(STRINGS.hud.settings, lang)}
          >
            <IconSettings size={18} strokeWidth={2.4} />
          </button>

          <button
            onClick={onMap}
            className="focus-neon press-snap font-display text-sm font-bold tracking-tight border-3 border-[#0A0A0A] rounded-brut shadow-key px-4 py-2 shrink-0 text-[#0A0A0A] bg-[linear-gradient(180deg,#C8FA57_0%,#B6F13A_45%,#8FD517_100%)]"
          >
            {t(STRINGS.nav.startLearning, lang)}
          </button>
        </div>
      </div>
    </nav>
  )
}
