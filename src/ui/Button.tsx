import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const styles: Record<string, string> = {
  primary: 'bg-space-panel2 border-neon-cyan/60 text-neon-cyan hover:shadow-glow hover:border-neon-cyan',
  secondary: 'bg-space-panel2 border-space-border text-ink-hi hover:border-neon-cyan/60 hover:text-neon-cyan',
  gold: 'bg-space-panel2 border-gold/60 text-gold hover:shadow-glow-gold hover:border-gold',
  danger: 'bg-space-panel2 border-danger/60 text-danger hover:shadow-[0_0_12px_rgba(248,113,113,.35)]',
}

const sizes: Record<string, string> = {
  sm: 'px-2.5 py-1 text-[8px]',
  md: 'px-4 py-2 text-[10px]',
  lg: 'px-6 py-3 text-xs',
}

/** Pixel-font game button with press-down effect. */
export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <button
      className={`focus-neon font-display border rounded-md transition-all duration-150 active:translate-y-[2px] disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
