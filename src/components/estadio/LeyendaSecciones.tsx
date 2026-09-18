import { SECCIONES, type SeccionZona } from '../../data/secciones'
import { formatPrecio } from '../../lib/format'

const ORDEN = [
  'sur-superior',
  'sur-inferior',
  'balboa',
  'estacionamientos',
  'este-superior',
  'este-inferior',
  'oeste-superior',
  'oeste-inferior',
]

export function LeyendaSecciones() {
  const filas = ORDEN.map((id) => SECCIONES.find((s) => s.id === id)).filter((s): s is SeccionZona => Boolean(s))
  const izq = filas.slice(0, 4)
  const der = filas.slice(4)

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 rounded-lg border border-slate-100 bg-white p-3">
      {[izq, der].map((col, ci) => (
        <div key={ci} className="space-y-1.5">
          {col.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-[11px]">
              <span
                className="h-3 w-3 shrink-0 rounded-[3px] ring-1 ring-black/10"
                style={{ backgroundColor: s.color }}
              />
              <span className="font-semibold text-slate-700">{s.nombre}</span>
              <span className="ml-auto tabular-nums text-slate-500">{formatPrecio(s.precio)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
