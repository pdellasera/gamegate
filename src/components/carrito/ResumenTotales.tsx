import { useVenta } from '../../store/venta'
import { formatPrecio } from '../../lib/format'
import { AnimatedNumber } from '../ui/AnimatedNumber'

export function ResumenTotales() {
  const { subtotal, cargoServicio, total } = useVenta()

  return (
    <div className="space-y-2 border-t border-slate-100 pt-3 text-sm">
      <div className="flex justify-between text-slate-500">
        <span>Subtotal</span>
        <span>{formatPrecio(subtotal)}</span>
      </div>
      <div className="flex justify-between text-slate-500">
        <span>Cargo de servicio (10%)</span>
        <span>{formatPrecio(cargoServicio)}</span>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-total-bg px-3 py-2.5">
        <span className="font-semibold text-total-fg">Total</span>
        <AnimatedNumber value={total} className="text-base font-bold text-total-fg" />
      </div>
    </div>
  )
}
