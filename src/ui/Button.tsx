import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'utility' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

/**
 * Locked button family (black + lime). All text/borders FULL opacity always;
 * only genuine disabled states may dim (handled by disabled: utilities below).
 */
const styles: Record<string, string> = {
  primary:
    'text-[#0A0A0A] border-[#0A0A0A] shadow-key bg-[linear-gradient(180deg,#C8FA57_0%,#B6F13A_45%,#8FD517_100%)] hover:shadow-[0_7px_0px_rgb(0_0_0/0.85),0_10px_18px_rgb(0_0_0/0.5)] active:shadow-[0_2px_0px_rgb(0_0_0/0.85)]',
  secondary:
    'bg-[#141416] text-[#B6F13A] border-[#B6F13A] shadow-key-sm hover:brightness-110 active:shadow-[0_1px_0px_rgb(0_0_0/0.85)]',
  utility:
    'bg-[#141416] text-[#F5F8F0] border-[#B6F13A] shadow-key-xs hover:brightness-110 active:shadow-[0_1px_0px_rgb(0_0_0/0.85)]',
  danger: 'bg-[#FF6B70] text-[#0A0A0A] border-[#0A0A0A] shadow-key-xs font-bold',
}

const sizes: Record<string, string> = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <button
      className={`focus-neon press-snap inline-flex items-center justify-center gap-2 font-bold font-display tracking-tight border-3 rounded-brut disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:saturate-50 ${styles[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
