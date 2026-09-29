/**
 * Thin re-export layer over lucide-react.
 *
 * All app components import their icons from here (named `Icon*`) so the
 * underlying library can be swapped again without touching call sites.
 * Size/stroke defaults keep the previous inline-set look: small sizes,
 * ~2.2 stroke, currentColor, aria-hidden by default.
 */
export {
  Globe as IconGlobe,
  Settings as IconSettings,
  User as IconUser,
  Home as IconHome,
  Map as IconMap,
  Medal as IconMedal,
  Trophy as IconTrophy,
  Star as IconStar,
  Flame as IconFlame,
  CircleCheck as IconCheckCircle,
  Earth as IconWorld,
  Package as IconPackage,
  Clock as IconClock,
  Lightbulb as IconBulb,
  Target as IconTarget,
  Book as IconBook,
  Crown as IconCrown,
  GitBranch as IconGitBranch,
  Lock as IconLock,
  Play as IconPlay,
  RotateCcw as IconRetry,
  ArrowLeft as IconArrowLeft,
  ArrowRight as IconArrowRight,
  Info as IconInfo,
  TriangleAlert as IconWarning,
  CircleHelp as IconQuestion,
  Shield as IconShield,
  Wrench as IconWrench,
  Zap as IconBolt,
  Check as IconCheck,
} from 'lucide-react'

import type { LucideProps } from 'lucide-react'
import { Star as LucideStar } from 'lucide-react'

/** Filled star variant (lucide's Star has no filled twin). */
export function IconStarFilled({ size = 16, ...rest }: LucideProps) {
  return <LucideStar size={size} fill="currentColor" strokeWidth={1} {...rest} />
}
