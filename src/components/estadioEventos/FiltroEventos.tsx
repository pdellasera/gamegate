import type { CategoriaEvento } from '../../types'
import { cn } from '../../lib/cn'

export type FiltroEvento = CategoriaEvento | 'Todos'

const OPCIONES: FiltroEvento[] = ['Todos', 'LPF', 'Selección', 'Concierto', 'Otros']

export function FiltroEventos({ value, onChange }: { value: FiltroEvento; onChange: (v: FiltroEvento) => void }) {
  return (
    <div className="flex h-9 items-center gap-0.5 rounded-[10px] bg-[#f4f7fc] p-[3px]">
      {OPCIONES.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'flex h-full flex-1 items-center justify-center rounded-[7px] text-[13px] font-semibold transition-colors',
            value === opt ? 'bg-[#0166fa] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
