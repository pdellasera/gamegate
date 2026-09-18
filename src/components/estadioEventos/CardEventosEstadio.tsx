import { useState } from 'react'
import { useEventosEstadio } from '../../hooks/useEstadio'
import { Card } from '../ui/Card'
import { FilaEvento } from './FilaEvento'
import { FiltroEventos, type FiltroEvento } from './FiltroEventos'

export function CardEventosEstadio() {
  const [filtro, setFiltro] = useState<FiltroEvento>('Todos')
  const { data, isLoading } = useEventosEstadio(filtro)

  return (
    <Card className="flex h-full min-h-0 flex-col p-6">
      <div className="shrink-0">
        <h2 className="text-[20px] font-bold tracking-tight text-slate-900">Eventos en este estadio</h2>
        <p className="mt-1 text-[15px] text-slate-500">Partidos, conciertos y más eventos programados</p>
        <div className="mt-4">
          <FiltroEventos value={filtro} onChange={setFiltro} />
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
        {isLoading || !data ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[86px] animate-pulse rounded-lg bg-slate-50" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[#eff3fa]">
            {data.map((ev) => (
              <FilaEvento key={ev.id} evento={ev} />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
