import { useEstadio } from '../../hooks/useEstadio'
import { Card } from '../ui/Card'

export function LeyendaEstadio() {
  const { data } = useEstadio()
  const secciones = data?.secciones ?? []
  const izq = secciones.slice(0, 4)
  const der = secciones.slice(4)

  return (
    <Card className="shrink-0 p-6">
      <h2 className="text-[20px] font-bold tracking-tight text-slate-900">Secciones del estadio</h2>
      <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5">
        {[izq, der].map((col, ci) => (
          <div key={ci} className="space-y-2.5">
            {col.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span
                  className="h-6 w-6 shrink-0 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[15px] font-semibold text-slate-700">{s.nombre}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  )
}
