import { CheckCircle2, ChevronRight } from 'lucide-react'
import { Card } from '../ui/Card'

export function EstadoSistema() {
  return (
    <Card className="flex h-full items-center gap-3 border-system-bd bg-system-bg p-3">
      <CheckCircle2 size={18} className="shrink-0 text-green-600" />
      <div className="flex-1">
        <p className="text-sm font-bold text-green-900">Sistema operativo</p>
        <p className="text-xs text-green-700">Todos los servicios funcionando</p>
      </div>
      <ChevronRight size={16} className="shrink-0 text-green-600" />
    </Card>
  )
}
