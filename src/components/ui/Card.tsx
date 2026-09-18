import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-card border border-slate-200 bg-white shadow-card', className)}
      {...props}
    >
      {children}
    </div>
  )
}
