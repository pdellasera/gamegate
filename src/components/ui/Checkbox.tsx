import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
}

export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex cursor-pointer items-center gap-2.5 text-left text-sm text-slate-600',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors',
          checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white',
        )}
      >
        {checked ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      <span className="select-none">{label}</span>
    </button>
  )
}
