import { CalendarRange, LayoutGrid, Tags, TrendingUp } from 'lucide-react'
import { Segmented } from '../ui/Segmented'

export type TabId = 'mapa' | 'zonas' | 'precios' | 'disponibilidad'

const TABS = [
  { value: 'mapa' as const, label: 'Mapa del estadio', icon: <LayoutGrid size={15} /> },
  { value: 'zonas' as const, label: 'Lista de zonas', icon: <CalendarRange size={15} /> },
  { value: 'precios' as const, label: 'Precios', icon: <Tags size={15} /> },
  { value: 'disponibilidad' as const, label: 'Disponibilidad', icon: <TrendingUp size={15} /> },
]

interface TabsZonasProps {
  value: TabId
  onChange: (value: TabId) => void
}

export function TabsZonas({ value, onChange }: TabsZonasProps) {
  return (
    <Segmented<TabId>
      options={TABS}
      value={value}
      onChange={onChange}
      className="w-full"
    />
  )
}
