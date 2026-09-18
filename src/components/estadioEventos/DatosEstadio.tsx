import { Landmark, MapPin, Ruler, Users } from 'lucide-react'
import { useEstadio } from '../../hooks/useEstadio'
import { Card } from '../ui/Card'

export function DatosEstadio() {
  const { data } = useEstadio()

  const items = [
    { icon: Users, valor: data?.capacidad ?? '—', label: 'Capacidad total' },
    { icon: Ruler, valor: data?.dimensiones ?? '—', label: 'Dimensiones' },
    { icon: MapPin, valor: data?.ciudad ?? '—', label: 'Ciudad' },
    { icon: Landmark, valor: data?.anio ?? '—', label: 'Año de inauguración' },
  ]

  return (
    <Card className="shrink-0 p-5">
      <div className="grid grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center text-center">
            <it.icon size={22} className="text-[#0061f8]" />
            <span className="mt-1.5 text-[20px] font-bold leading-none text-slate-900">{it.valor}</span>
            <span className="mt-1.5 text-[13px] text-slate-500">{it.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
