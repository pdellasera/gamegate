import type { ButtonHTMLAttributes } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

interface BotonIngresarProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pendiente?: boolean
}

export function BotonIngresar({ className, pendiente, children, disabled, ...props }: BotonIngresarProps) {
  return (
    <button
      className={cn(
        'inline-flex h-[68px] w-full items-center justify-center gap-2.5 rounded-xl text-[17px] font-semibold text-white',
        'bg-[linear-gradient(90deg,#0b7af0_0%,#0055e6_100%)] shadow-[0_14px_30px_-12px_rgba(0,90,220,0.6)]',
        'transition-[filter] hover:brightness-105 active:brightness-95',
        'disabled:cursor-not-allowed disabled:opacity-70',
        className,
      )}
      disabled={pendiente || disabled}
      {...props}
    >
      {children}
      {pendiente ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
    </button>
  )
}
