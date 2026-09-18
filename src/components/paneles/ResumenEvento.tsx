import { Card } from '../ui/Card'
import { useResumen } from '../../hooks/usePos'
import { formatNum } from '../../lib/format'

export function ResumenEvento() {
  const { data, isLoading } = useResumen()

  if (isLoading || !data) {
    return <Card className="h-full animate-pulse bg-slate-50" />
  }

  const pctVendido = Math.round((data.vendidos / data.capacidadTotal) * 100)
  const pctDisp = 100 - pctVendido

  return (
    <Card className="h-full p-3">
      <h3 className="text-sm font-bold text-slate-900">Resumen del evento</h3>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        <Stat label="Capacidad total" value={formatNum(data.capacidadTotal)} />
        <Stat label="Vendidos" value={formatNum(data.vendidos)} hint={`${pctVendido}%`} />
        <Stat label="Disponibles" value={formatNum(data.disponibles)} hint={`${pctDisp}%`} />
      </div>
    </Card>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-2 py-2">
      <p className="text-base font-bold leading-tight text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-500">
        {label}
        {hint ? <span className="block text-slate-400">({hint})</span> : null}
      </p>
    </div>
  )
}
