import { Banknote, CreditCard, Landmark, Wallet } from 'lucide-react'
import { Segmented } from '../ui/Segmented'
import { useVenta } from '../../store/venta'
import type { MetodoPago as TipoMetodo } from '../../types'

const OPCIONES = [
  { value: 'efectivo' as const, label: 'Efectivo', icon: <Banknote size={15} /> },
  { value: 'tarjeta' as const, label: 'Tarjeta', icon: <CreditCard size={15} /> },
  { value: 'transferencia' as const, label: 'Transfer.', icon: <Landmark size={14} /> },
  { value: 'otros' as const, label: 'Otros', icon: <Wallet size={15} /> },
]

export function MetodoPago() {
  const { metodoPago, setMetodoPago } = useVenta()

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Método de pago
      </p>
      <Segmented<TipoMetodo> options={OPCIONES} value={metodoPago} onChange={setMetodoPago} />
    </div>
  )
}
