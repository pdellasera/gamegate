import { CheckCircle2, RefreshCw } from 'lucide-react'
import { Card } from '../ui/Card'
import { useAccesos } from '../../hooks/usePos'
import { formatNum } from '../../lib/format'

export function AccesosDelDia() {
  const { data, isLoading, refetch, isFetching } = useAccesos()

  return (
    <Card className="h-full p-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-green-500" />
        <h3 className="text-sm font-bold text-slate-900">Accesos del día</h3>
      </div>
      {isLoading || !data ? (
        <div className="mt-2 h-10 animate-pulse rounded-lg bg-slate-100" />
      ) : (
        <div className="mt-2">
          <p className="text-base font-bold leading-tight text-slate-900">
            Ingresos hoy {formatNum(data.ingresosHoy)}
          </p>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Última actualización {data.ultimaActualizacion}</span>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 text-brand-600 transition-colors hover:underline"
            >
              <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
