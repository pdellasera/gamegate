import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useVenta } from '../../store/venta'
import { cn } from '../../lib/cn'
import { formatPrecio } from '../../lib/format'
import { LeyendaEstados } from './LeyendaEstados'
import type { Sector } from '../../types'

const ESTILOS = {
  disponible: 'bg-[#22c55e] hover:bg-[#16a34a]',
  seleccionado: 'bg-brand-600 text-white',
  ocupado: 'bg-[#f87171]',
  bloqueado: 'bg-slate-200',
} as const

export function SeatGrid({ sector }: { sector: Sector }) {
  const { items, toggleAsiento } = useVenta()
  const seleccionados = new Set(items.map((i) => i.asientoId))

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="mb-3 flex shrink-0 items-center justify-center rounded-md bg-ink-900 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
        ↓ Cancha / Escenario
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto w-fit space-y-1.5">
        <div className="flex items-center gap-1 pl-6">
          {Array.from({ length: sector.columnas }, (_, i) => (
            <div key={i} className="w-6 shrink-0 text-center text-[10px] font-medium text-slate-400">
              {i + 1}
            </div>
          ))}
        </div>

        {sector.filas.map((fila) => {
          const filaAsientos = sector.asientos.filter((a) => a.fila === fila)
          return (
            <div key={fila} className="flex items-center gap-1">
              <div className="w-5 shrink-0 text-center text-[10px] font-semibold text-slate-400">{fila}</div>
              {filaAsientos.map((a) => {
                const esta = seleccionados.has(a.id)
                const estado = esta ? 'seleccionado' : a.estado
                const clickable = a.estado === 'disponible' || esta
                return (
                  <motion.button
                    key={a.id}
                    type="button"
                    disabled={!clickable}
                    onClick={() => toggleAsiento(sector, a)}
                    whileHover={clickable ? { scale: 1.12 } : undefined}
                    whileTap={clickable ? { scale: 0.88 } : undefined}
                    title={`Fila ${a.fila} • Asiento ${a.numero} — ${formatPrecio(a.precio)}`}
                    className={cn(
                      'flex h-5 w-6 shrink-0 items-center justify-center rounded-[5px] text-[9px] transition-colors',
                      ESTILOS[estado],
                      !clickable && 'cursor-not-allowed',
                    )}
                  >
                    {estado === 'seleccionado' ? <Check size={11} strokeWidth={3.5} /> : null}
                  </motion.button>
                )
              })}
            </div>
          )
        })}
        </div>
      </div>

      <LeyendaEstados className="mt-3 shrink-0 border-t border-slate-200 pt-2.5" />
    </div>
  )
}
