import { Armchair, BriefcaseBusiness, CalendarDays, Images, Info } from 'lucide-react'
import { cn } from '../../lib/cn'

export type TabEstadioId = 'informacion' | 'eventos' | 'mapa' | 'servicios' | 'galeria'

const TABS: { id: TabEstadioId; label: string; icon: typeof Info }[] = [
  { id: 'informacion', label: 'Información', icon: Info },
  { id: 'eventos', label: 'Eventos', icon: CalendarDays },
  { id: 'mapa', label: 'Mapa de asientos', icon: Armchair },
  { id: 'servicios', label: 'Servicios', icon: BriefcaseBusiness },
  { id: 'galeria', label: 'Galería', icon: Images },
]

export function TabsEstadio({ value, onChange }: { value: TabEstadioId; onChange: (v: TabEstadioId) => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-[14px] border border-[#e9eef6] bg-white p-1.5 shadow-card">
      {TABS.map((t) => {
        const Icon = t.icon
        const active = t.id === value
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              'flex h-[42px] flex-1 items-center justify-center gap-2 rounded-[10px] px-2 text-[14px] font-semibold transition-colors',
              active ? 'bg-[#027afc] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
            )}
          >
            <Icon size={17} className="shrink-0" />
            <span className="whitespace-nowrap">{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
