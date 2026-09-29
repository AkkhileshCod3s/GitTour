import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import { t, STRINGS } from '../i18n/strings'
import type { Lang } from '../storage'
import type { PlayerProgress } from '../game/progress'
import { rankForXp } from '../levels/scoring'
import { LEVELS } from '../levels/levels'
import { WORLDS } from '../levels/worlds'
import { Mascot } from '../components/Mascot'
import { IconStar, IconCheckCircle, IconTrophy, IconWorld } from '../ui/Icons'

interface Props {
  hasProgress: boolean
  onStart: () => void
  onContinue: () => void
  onOpenMap: () => void
  lang: Lang
  progress: PlayerProgress
}

/** Decorative lime marquee of Git commands; loops, pauses on reduced-motion. */
function Marquee() {
  const text = t(STRINGS.marquee.commands, 'hinglish')
  return (
    <div className="marquee-wrap relative w-full overflow-hidden border-y-4 border-theme bg-lime py-1.5" aria-hidden="true">
      <div className="anim-marquee flex whitespace-nowrap w-max">
        {[0, 1].map((k) => (
          <span key={k} className="font-display text-lg tracking-wider pr-4" style={{ color: '#0A0A0A' }}>
            {text.repeat(3)}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Original abstract branching-path illustration (lime on transparent). */
function PathArt() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g stroke="rgb(var(--lime))" fill="none" strokeLinecap="round">
        <path d="M60 380 C 140 380, 140 300, 220 300 C 300 300, 300 190, 380 190 C 430 190, 440 120, 470 90" strokeWidth="10" opacity="0.14" />
        <path d="M220 300 C 260 300, 270 350, 320 360" strokeWidth="7" opacity="0.1" />
        <circle cx="60" cy="380" r="14" fill="rgb(var(--lime))" opacity="0.16" />
        <circle cx="220" cy="300" r="14" fill="rgb(var(--lime))" opacity="0.16" />
        <circle cx="380" cy="190" r="14" fill="rgb(var(--lime))" opacity="0.16" />
        <circle cx="470" cy="90" r="14" fill="rgb(var(--lime))" opacity="0.2" />
        <circle cx="400" cy="80" r="46" strokeWidth="6" opacity="0.1" />
        <circle cx="400" cy="80" r="30" strokeWidth="4" opacity="0.08" />
      </g>
    </svg>
  )
}

/** Floating demo card: mini terminal + mini commit graph + XP badge. */
function PreviewCard() {
  return (
    <div className="relative anim-float-card">
      <div className="bg-brut-panel border-4 border-lime rounded-brut-lg shadow-key overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-lime">
          <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#0A0A0A', background: 'rgb(var(--danger))' }} />
          <span className="w-3 h-3 rounded-full border-2 bg-brut-panel" style={{ borderColor: '#0A0A0A' }} />
          <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#0A0A0A', background: '#F5F5F2' }} />
          <span className="ml-1 font-display text-xs" style={{ color: '#0A0A0A' }}>TIME TERMINAL</span>
        </div>
        <div className="p-4 font-mono text-[12.5px] leading-relaxed" style={{ backgroundColor: '#101013' }}>
          <p><span className="text-lime">$</span> <span style={{ color: '#F5F5F2' }}>git switch -c feature</span></p>
          <p style={{ color: '#CAD0C2' }}>Switched to a new branch 'feature'</p>
          <p className="mt-1"><span className="text-lime">$</span> <span style={{ color: '#F5F5F2' }}>git commit -m "time jump"</span></p>
          <p className="font-bold text-lime">[feature a1b2c3d] time jump</p>
          <p style={{ color: '#CAD0C2' }}>1 file changed, 2 insertions(+)</p>
        </div>
        <div className="border-t-3 border-lime bg-brut-shade px-4 py-3">
          <svg viewBox="0 0 260 74" width="100%" height="74" aria-hidden="true">
            <path d="M24 50 C 70 50, 70 24, 116 24" stroke="rgb(var(--lime))" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M116 24 C 160 24, 160 50, 204 50" stroke="rgb(var(--lime))" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.55" />
            <circle cx="24" cy="50" r="10" fill="rgb(var(--brut-panel))" stroke="rgb(var(--lime))" strokeWidth="3" />
            <circle cx="116" cy="24" r="10" fill="rgb(var(--lime))" stroke="#0A0A0A" strokeWidth="2.5" />
            <circle cx="204" cy="50" r="10" fill="rgb(var(--brut-panel))" stroke="rgb(var(--lime))" strokeWidth="3" />
            <rect x="130" y="52" width="62" height="18" rx="6" fill="#F5F5F2" stroke="#0A0A0A" strokeWidth="2" />
            <text x="139" y="65" fontSize="10.5" fontWeight="700" fill="#0A0A0A" fontFamily="monospace">feature</text>
          </svg>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-[11px] text-ink-mid">HEAD → feature</span>
            <span className="font-display text-xs bg-lime rounded-brut px-2 py-0.5 font-bold" style={{ color: '#0A0A0A' }}>
              {t(STRINGS.preview.xp, 'hinglish')}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute -top-9 -right-4 bg-brut-panel border-3 border-lime rounded-brut shadow-key-sm p-1.5">
        <Mascot mood="happy" size={44} />
      </div>
    </div>
  )
}

export function TitleScreen({ hasProgress, onStart, onContinue, onOpenMap, lang, progress }: Props) {
  const rank = rankForXp(progress.xp)
  const completedCount = progress.completed.length
  const nextLevel = LEVELS.find((l) => !progress.completed.includes(l.id))
  const currentWorld = nextLevel ? WORLDS.find((w) => w.id === nextLevel.world)?.name ?? '—' : '—'

  return (
    <div className="relative min-h-full flex flex-col">
      {/* HERO: two columns */}
      <section className="relative flex-1 px-4 py-5 md:py-7 overflow-hidden">
        <PathArt />
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
          <div>
            <h1 className="font-display leading-[1.02] text-4xl sm:text-5xl xl:text-6xl" style={{ color: 'rgb(var(--ink-hi))' }}>
              {t(STRINGS.landing.heroLine1, lang)}
              <br />
              <span className="text-lime">{t(STRINGS.landing.heroLine2, lang)}</span>
            </h1>
            {/* legible light-grey subtitle (≥9:1 on black) */}
            <p className="mt-4 text-base sm:text-lg text-ink-mid max-w-xl leading-relaxed">
              {t(STRINGS.landing.heroSub, lang)}
            </p>
            {/* primary CTA pair */}
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={hasProgress ? onContinue : onStart}>
                {t(STRINGS.landing.startLearning, lang)}
              </Button>
              {/* real action: opens the learning path (command reference lives in levels) */}
              <Button size="md" variant="secondary" onClick={onOpenMap}>
                {t(STRINGS.landing.cheatSheet, lang)}
              </Button>
            </div>
          </div>
          <div className="hidden sm:block px-6 pt-8">
            <PreviewCard />
          </div>
        </div>
      </section>

      <Marquee />

      {/* stats row */}
      <section className="max-w-6xl w-full mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={<IconStar size={13} className="text-lime shrink-0" />} label={t(STRINGS.stats.score, lang)} value={String(progress.xp)} />
        <StatCard icon={<IconCheckCircle size={13} className="text-lime shrink-0" />} label={t(STRINGS.stats.completed, lang)} value={`${completedCount}/${LEVELS.length}`} />
        <StatCard icon={<IconTrophy size={13} className="text-lime shrink-0" />} label={t(STRINGS.stats.rank, lang)} value={rank} />
        <StatCard icon={<IconWorld size={13} className="text-lime shrink-0" />} label={t(STRINGS.stats.world, lang)} value={currentWorld} />
        <div className="col-span-2 md:col-span-1 flex">
          <Button className="w-full" onClick={hasProgress ? onContinue : onStart}>
            {t(STRINGS.landing.continue, lang)}
          </Button>
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-brut-panel border-3 border-theme rounded-brut shadow-key-sm p-3 flex flex-col gap-1 min-w-0">
      <span className="flex items-center gap-1.5 text-xs font-bold text-ink-mid">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <span className="font-display text-lime text-lg leading-tight break-words" title={value}>{value}</span>
    </div>
  )
}
