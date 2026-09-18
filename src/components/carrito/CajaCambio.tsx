import { useVenta } from '../../store/venta'
import { AnimatedNumber } from '../ui/AnimatedNumber'

export function CajaCambio() {
  const { cambio } = useVenta()

  return (
    <div className="flex items-center justify-between rounded-lg bg-change-bg px-3 py-2.5">
      <span className="font-semibold text-change-fg">Cambio</span>
      <AnimatedNumber value={cambio} className="text-base font-bold text-change-fg" />
    </div>
  )
}
