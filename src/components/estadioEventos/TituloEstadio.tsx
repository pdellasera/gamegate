import { MapPin } from 'lucide-react'
import { useEstadio } from '../../hooks/useEstadio'

export function TituloEstadio() {
  const { data } = useEstadio()

  return (
    <div className="shrink-0">
      <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-slate-900">
        {data?.nombre ?? 'Estadio Rommel Fernández'}
      </h1>
      <div className="mt-2 flex items-center gap-1.5 text-[15px] text-slate-500">
        <MapPin size={16} className="text-[#0166fa]" />
        <span>
          {data?.ciudad}, {data?.pais}
        </span>
      </div>
    </div>
  )
}
