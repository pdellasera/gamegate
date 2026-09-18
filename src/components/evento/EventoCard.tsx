import { ArrowLeftRight, CalendarDays, MapPin } from 'lucide-react'
import { useEvento } from '../../hooks/usePos'
import { formatFechaLarga, formatHora } from '../../lib/format'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

export function EventoCard() {
  const { data, isLoading } = useEvento()

  if (isLoading || !data) {
    return <Card className="h-[92px] animate-pulse bg-slate-50" />
  }

  const fecha = new Date(data.fechaISO)

  return (
    <Card className="flex flex-wrap items-center gap-5 p-4">
      <div className="flex items-center gap-3">
        <Escudo color={data.colorLocal} label="AU" />
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
          VS
        </span>
        <Escudo color={data.colorVisitante} label="TF" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-bold text-slate-900">
          {data.local} vs {data.visitante}
        </h2>
        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={15} className="text-slate-400" />
            {formatFechaLarga(fecha)} • {formatHora(fecha)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={15} className="text-slate-400" />
            {data.lugar}
          </span>
        </div>
      </div>

      <Button variant="outline" className="shrink-0">
        <ArrowLeftRight size={16} />
        Cambiar evento
      </Button>
    </Card>
  )
}

function Escudo({ color, label }: { color: string; label: string }) {
  return (
    <svg viewBox="0 0 44 50" className="h-12 w-11 shrink-0 drop-shadow-sm">
      <path
        d="M22 2 L38 7 V24 C38 35 31 43 22 47 C13 43 6 35 6 24 V7 Z"
        fill={color}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1"
      />
      <path
        d="M22 6 L34 10 V24 C34 32 29 38 22 41 C15 38 10 32 10 24 V10 Z"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
      />
      <path d="M6 22 L38 22" stroke="rgba(255,255,255,0.45)" strokeWidth="3" />
      <circle cx="22" cy="27" r="10" fill="rgba(255,255,255,0.14)" />
      <text
        x="22"
        y="31"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="800"
        fontFamily="Inter, sans-serif"
      >
        {label}
      </text>
      <circle cx="22" cy="6.5" r="2.2" fill="white" />
    </svg>
  )
}
