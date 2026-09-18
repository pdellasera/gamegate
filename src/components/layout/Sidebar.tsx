import { BarChart3, CalendarDays, Calculator, LogOut, Settings, Ticket } from 'lucide-react'
import { cn } from '../../lib/cn'
import logoWhite from '../../../assets/logo_white.webp'
import sidebarBg from '../../../assets/sidebar_background.webp'

const NAV = [
  { id: 'venta', label: 'Venta de tickets', icon: Ticket },
  { id: 'eventos', label: 'Eventos', icon: CalendarDays },
  { id: 'reportes', label: 'Reporte de ventas', icon: BarChart3 },
  { id: 'cierre', label: 'Cierre de caja', icon: Calculator },
  { id: 'config', label: 'Configuración', icon: Settings },
]

interface SidebarProps {
  activeId?: string
  onNavigate?: (id: string) => void
  onSalir?: () => void
}

export function Sidebar({ activeId = 'venta', onNavigate, onSalir }: SidebarProps) {
  return (
    <aside className="relative isolate flex w-60 shrink-0 flex-col overflow-hidden bg-ink-950">
      {/* Fondo: poster del estadio */}
      <img
        src={sidebarBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover object-center"
      />
      {/* Scrim para legibilidad de la navegación */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/95 via-ink-950/85 to-ink-950/35" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-brand-600/20 via-transparent to-transparent" />

      {/* Marca GameGate */}
      <div className="shrink-0 border-b border-white/10 px-4 pb-4 pt-5">
        <img src={logoWhite} alt="GameGate — Boletería oficial LPF" className="w-full" />
      </div>

      <nav className="flex-1 space-y-1.5 px-3 pt-4">
        {NAV.map((item) => {
          const active = item.id === activeId
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={cn(
                'flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-[15px] font-medium transition-colors',
                active
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
              )}
            >
              <Icon size={20} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bloque inferior: versión + salir */}
      <div className="px-3 pb-4">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-ink-950/60 px-2 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-sm">
            <Ticket size={12} className="text-brand-400" />
            TicketGest <span className="text-slate-500">v1.0.0</span>
          </span>
        </div>

        <button
          onClick={onSalir}
          className="mt-2 flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-[15px] font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
