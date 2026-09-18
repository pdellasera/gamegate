import { LocateFixed, Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

interface ZoomControlsProps {
  zoom: number
  onChange: (zoom: number) => void
}

const clamp = (v: number) => Math.min(1.6, Math.max(0.7, v))

export function ZoomControls({ zoom, onChange }: ZoomControlsProps) {
  return (
    <div className="absolute left-4 top-4 flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => onChange(clamp(zoom + 0.15))}
        className="flex h-8 w-8 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50"
        aria-label="Acercar"
      >
        <Plus size={15} />
      </button>
      <div className="h-px bg-slate-200" />
      <button
        onClick={() => onChange(clamp(zoom - 0.15))}
        className="flex h-8 w-8 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50"
        aria-label="Alejar"
      >
        <Minus size={15} />
      </button>
      <div className="h-px bg-slate-200" />
      <button
        onClick={() => onChange(1)}
        className={cn(
          'flex h-8 w-8 items-center justify-center transition-colors hover:bg-slate-50',
          zoom === 1 ? 'text-brand-600' : 'text-slate-600',
        )}
        aria-label="Centrar"
      >
        <LocateFixed size={15} />
      </button>
    </div>
  )
}
