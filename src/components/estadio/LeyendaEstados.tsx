import { cn } from '../../lib/cn'

const ITEMS = [
  { label: 'Disponible', color: '#22C55E' },
  { label: 'Seleccionado', color: '#0B6BFF' },
  { label: 'Ocupado', color: '#F87171' },
  { label: 'Bloqueado', color: '#CBD5E1' },
]

export function LeyendaEstados({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {ITEMS.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}
