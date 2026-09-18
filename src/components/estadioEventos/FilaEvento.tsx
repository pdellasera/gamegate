import { ArrowRight, Clock, MapPin } from 'lucide-react'
import type { CategoriaEvento, EventoResumen } from '../../types'
import { Escudo } from './Escudo'

const BADGES: Record<CategoriaEvento, { bg: string; label: string }> = {
  LPF: { bg: '#0b6bff', label: 'LPF' },
  Selección: { bg: '#7c5cfc', label: 'Selección' },
  Concierto: { bg: '#ec4899', label: 'Concierto' },
  Otros: { bg: '#64748b', label: 'Otros' },
}

export function FilaEvento({ evento }: { evento: EventoResumen }) {
  const badge = BADGES[evento.categoria]

  return (
    <div className="flex items-center gap-5 py-3.5">
      {/* Fecha */}
      <div className="w-[54px] shrink-0 text-center">
        <div className="text-[11px] font-bold uppercase leading-none tracking-wide text-[#0166fa]">
          {evento.mes}
        </div>
        <div className="mt-1.5 text-[22px] font-bold leading-none text-slate-900">{evento.dia}</div>
        <div className="mt-1.5 text-[11px] leading-none text-slate-400">{evento.anio}</div>
      </div>

      {/* Categoría + título + meta */}
      <div className="min-w-0 flex-1">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
          style={{ backgroundColor: badge.bg }}
        >
          {badge.label}
        </span>
        <h3 className="mt-1.5 truncate text-[16px] font-bold leading-tight text-slate-900">{evento.titulo}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[13.5px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            {evento.lugar}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            {evento.hora}
          </span>
        </div>
      </div>

      {/* Escudos / miniatura */}
      {evento.esConcierto ? (
        <div className="flex h-[52px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#5b1f6e] via-[#a0245e] to-[#e05a2f] px-2 text-center">
          <div className="leading-tight">
            <div className="text-[10px] font-bold uppercase text-white">Manuel Turizo</div>
            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/75">2000 Tour</div>
          </div>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-2.5">
          {evento.escudoLocal ? <Escudo spec={evento.escudoLocal} size={40} /> : null}
          <span className="text-[11px] font-bold text-slate-400">VS</span>
          {evento.escudoVisitante ? <Escudo spec={evento.escudoVisitante} size={40} /> : null}
        </div>
      )}

      {/* Botón */}
      <button className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] bg-[#0166fa] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0159e0]">
        Ver detalles
        <ArrowRight size={16} />
      </button>
    </div>
  )
}
