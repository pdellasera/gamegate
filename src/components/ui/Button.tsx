import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Kbd } from './Kbd'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md'
  kbd?: string
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  outline: 'border border-brand-300 bg-white text-brand-700 hover:bg-brand-50',
  ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
  danger: 'text-slate-500 hover:bg-red-50 hover:text-red-600',
}

const SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  kbd,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
      {kbd ? (
        <Kbd
          className={cn(
            'ml-auto',
            variant === 'primary'
              ? 'border-white/25 bg-white/15 text-white'
              : 'border-brand-200 bg-brand-50 text-brand-700',
          )}
        >
          {kbd}
        </Kbd>
      ) : null}
    </button>
  )
}
