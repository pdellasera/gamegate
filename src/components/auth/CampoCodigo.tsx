import type { InputHTMLAttributes } from 'react'
import { CircleUserRound } from 'lucide-react'
import { cn } from '../../lib/cn'

interface CampoCodigoProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function CampoCodigo({ className, error, ...props }: CampoCodigoProps) {
  return (
    <div className={cn('relative', className)}>
      <CircleUserRound
        size={24}
        strokeWidth={1.7}
        className="pointer-events-none absolute left-[27px] top-1/2 -translate-y-1/2 text-[#98a2b6]"
      />
      <input
        className={cn(
          'h-[62px] w-full rounded-xl border bg-white pl-[64px] pr-4 text-[16px] text-slate-900 placeholder:text-[#98a2b6] focus:outline-none focus:ring-2',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
            : 'border-[#dce6f1] focus:border-brand-500 focus:ring-brand-500/20',
        )}
        {...props}
      />
    </div>
  )
}
