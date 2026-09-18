import { Plus, Search } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

export function PanelCliente() {
  return (
    <Card className="flex h-full flex-col p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900">
          Cliente <span className="font-normal text-slate-400">(opcional)</span>
        </h3>
        <Button variant="outline" size="sm" className="shrink-0">
          <Plus size={14} />
          Nuevo
        </Button>
      </div>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          placeholder="Buscar por nombre, documento o teléfono..."
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
    </Card>
  )
}
