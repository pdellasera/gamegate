import { useVenta } from '../../store/venta'
import { formatPrecio } from '../../lib/format'

const QUICK = [20, 50, 100]

export function MontoRecibido() {
  const { montoRecibido, setMontoRecibido } = useVenta()

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Monto recibido
      </p>
      <div className="flex items-center rounded-lg border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
        <span className="pl-3 text-sm font-semibold text-slate-500">B/.</span>
        <input
          type="text"
          inputMode="decimal"
          value={montoRecibido}
          onChange={(e) => setMontoRecibido(e.target.value.replace(/[^\d.]/g, ''))}
          placeholder="0.00"
          className="h-10 w-full bg-transparent px-2 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-300"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => setMontoRecibido(String(q))}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-600"
          >
            {formatPrecio(q)}
          </button>
        ))}
      </div>
    </div>
  )
}
