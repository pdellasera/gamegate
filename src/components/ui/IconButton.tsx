import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function IconButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-brand-500',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
