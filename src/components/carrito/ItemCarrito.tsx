import { Armchair, X } from 'lucide-react'
import { formatPrecio } from '../../lib/format'
import type { ItemVenta } from '../../types'

interface ItemCarritoProps {
  item: ItemVenta
  onRemove: (id: string) => void
}

export function ItemCarrito({ item, onRemove }: ItemCarritoProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-2.5 py-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Armchair size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          Fila {item.fila} • Asiento {item.numero}
        </p>
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {item.sector}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="whitespace-nowrap text-sm font-semibold text-slate-900">
          {formatPrecio(item.precio)}
        </span>
        <button
          onClick={() => onRemove(item.asientoId)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label={`Quitar Fila ${item.fila} • Asiento ${item.numero}`}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
