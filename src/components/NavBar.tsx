import { useEffect, useRef, useState } from 'react'
import { Logo } from '../ui/Logo'
import {
  IconSettings,
  IconUser,
  IconFlame,
  IconTrophy,
  IconHome,
  IconMap,
  IconInfo,
} from '../ui/Icons'
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

/** Final nav bar: mobile = compact top bar + bottom tabs + overflow drawer; desktop unchanged. */
export function NavBar({ screen, lang, progress, onHome, onMap, onProfile, onSettings }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close overflow menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('touchstart', onDown, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('touchstart', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const link = (active: boolean) =>
    `focus-neon press-snap font-display text-sm tracking-tight px-4 py-1.5 rounded-full border-2 ${
      active
        ? 'bg-brut-panel text-lime border-lime shadow-key-xs font-bold'
        : 'text-ink-hi border-transparent hover:text-lime'
    }`

  const activeTab = screen === 'map' || screen === 'level' ? 'map' : screen

  const tabs: Array<{ key: string; label: string; icon: React.ReactNode; onTap: () => void }> = [
    { key: 'title', label: t(STRINGS.nav.home, lang), icon: <IconHome size={20} />, onTap: onHome },
    { key: 'map', label: t(STRINGS.nav.playground, lang), icon: <IconMap size={20} />, onTap: onMap },
    { key: 'profile', label: t(STRINGS.nav.arcade, lang), icon: <IconUser size={20} />, onTap: onProfile },
  ]

  return (
    <>
      {/* ---------- Top bar ---------- */}
      <nav
        className="sticky top-0 z-40 w-full border-b-4 border-lime bg-brut-bg"
        style={{ boxShadow: '0 4px 0 rgba(0,0,0,0.4)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 px-3 py-2 md:whitespace-nowrap md:overflow-x-auto">
          <button onClick={onHome} className="focus-neon press-snap flex items-center shrink-0 rounded-brut px-1.5 py-1" aria-label="Git Tour home">
            <Logo size={30} mode="lockup" />
          </button>

          {/* desktop links */}
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

          {/* compact combined streak+XP pill (mobile only) */}
          <div className="flex md:hidden items-center gap-1 ml-1 rounded-full border-2 border-lime bg-brut-shade px-2 py-1 font-bold text-xs text-ink-hi shrink-0">
            <IconFlame size={13} className="text-lime shrink-0" />
            {progress.streak}
            <span className="text-ink-low" aria-hidden="true">·</span>
            <IconTrophy size={13} className="text-lime shrink-0" />
            {progress.xp}
          </div>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            {/* desktop stats pills */}
            <span className={pill} title={t(STRINGS.hud.streak, lang)}>
              <IconFlame size={14} className="text-lime shrink-0" /> {progress.streak}
            </span>
            <span className={pill} title={t(STRINGS.profile.xp, lang)}>
              <IconTrophy size={14} className="text-lime shrink-0" /> {progress.xp} XP
            </span>

            {/* profile (desktop/small-tablet) */}
            <button
              onClick={onProfile}
              className="focus-neon press-snap hidden sm:flex h-10 w-10 items-center justify-center rounded-full border-3 border-lime bg-brut-panel text-lime shadow-key-xs"
              aria-label={t(STRINGS.hud.openProfile, lang)}
              title={t(STRINGS.hud.openProfile, lang)}
            >
              <IconUser size={18} strokeWidth={2.4} />
            </button>

            {/* mobile overflow menu (profile + settings) */}
            <div className="relative md:hidden" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="focus-neon press-snap flex h-11 w-11 items-center justify-center rounded-brut border-3 border-lime bg-brut-panel text-lime shadow-key-xs"
                aria-label={t(STRINGS.hud.settings, lang)}
                aria-expanded={menuOpen}
                title={t(STRINGS.hud.settings, lang)}
              >
                <IconSettings size={19} strokeWidth={2.4} />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] w-44 bg-brut-panel border-3 border-lime rounded-brut shadow-brut py-1.5 z-50 anim-pop"
                  role="menu"
                >
                  <button
                    onClick={() => { setMenuOpen(false); onProfile() }}
                    className="focus-neon w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-ink-hi hover:text-lime"
                    role="menuitem"
                  >
                    <IconUser size={17} className="text-lime shrink-0" />
                    {t(STRINGS.hud.openProfile, lang)}
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onSettings() }}
                    className="focus-neon w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-ink-hi hover:text-lime"
                    role="menuitem"
                  >
                    <IconSettings size={17} className="text-lime shrink-0" />
                    {t(STRINGS.hud.settings, lang)}
                  </button>
                  <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-ink-mid border-t-2 border-theme mt-1">
                    <IconInfo size={13} className="text-lime shrink-0" />
                    <span className="truncate">{t(STRINGS.hud.streak, lang)}: {progress.streak} · {t(STRINGS.profile.xp, lang)}: {progress.xp}</span>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); onMap() }}
                    className="focus-neon w-full font-display text-sm font-bold tracking-tight border-3 border-[#0A0A0A] rounded-brut shadow-key-sm mx-3 px-4 py-2 text-[#0A0A0A] bg-[linear-gradient(180deg,#C8FA57_0%,#B6F13A_45%,#8FD517_100%)]"
                    style={{ width: 'calc(100% - 1.5rem)' }}
                  >
                    {t(STRINGS.nav.startLearning, lang)}
                  </button>
                </div>
              )}
            </div>

            {/* settings (desktop) */}
            <button
              onClick={onSettings}
              className="focus-neon press-snap hidden md:flex h-10 w-10 items-center justify-center rounded-brut border-3 border-lime bg-brut-panel text-lime shadow-key-xs"
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

      {/* ---------- Mobile bottom tab bar ---------- */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t-4 border-lime bg-brut-bg pb-[env(safe-area-inset-bottom)]" style={{ boxShadow: '0 -4px 0 rgba(0,0,0,0.4)' }}>
        <div className="grid grid-cols-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={tab.onTap}
              className={`focus-neon press-snap flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-1.5 font-display text-[11px] tracking-tight ${
                activeTab === tab.key ? 'text-lime font-bold bg-brut-panel' : 'text-ink-mid'
              }`}
              aria-current={activeTab === tab.key ? 'page' : undefined}
            >
              {tab.icon}
              <span className="truncate max-w-[88px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
