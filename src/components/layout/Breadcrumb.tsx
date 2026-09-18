import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { formatFechaCorta, formatHora } from '../../lib/format'

export function Breadcrumb() {
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-slate-400">Taquilla</span>
        <ChevronRight size={15} className="text-slate-300" />
        <span className="font-medium text-slate-900">Venta de tickets</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>{formatFechaCorta(ahora)}</span>
        <span className="font-semibold text-slate-900">{formatHora(ahora)}</span>
      </div>
    </div>
  )
}
