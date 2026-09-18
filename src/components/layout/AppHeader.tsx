import { useEffect, useRef } from 'react'
import { ChevronDown, Monitor, Search } from 'lucide-react'
import { Kbd } from '../ui/Kbd'
import { useSesion } from '../../store/sesion'

export function AppHeader() {
  const searchRef = useRef<HTMLInputElement>(null)
  const { sesion } = useSesion()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!sesion) return null

  return (
    <header className="flex h-16 shrink-0 items-center gap-5 border-b border-white/10 bg-ink-900 px-5">
      {/* Búsqueda */}
      <div className="relative mx-auto hidden w-full max-w-[500px] flex-1 md:block">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={17}
        />
        <input
          ref={searchRef}
          placeholder="Buscar evento, cliente o ticket..."
          className="h-11 w-full rounded-xl bg-ink-800 pl-11 pr-24 text-[15px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <Kbd className="border-white/10 bg-ink-700 text-slate-300">Ctrl + K</Kbd>
        </div>
      </div>

      {/* Derecha */}
      <div className="flex shrink-0 items-center gap-4">
        <div className="flex items-center gap-2 text-[15px] text-slate-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          Modo Online
        </div>
        <div className="h-6 w-px bg-white/10" />
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[15px] text-slate-300 transition-colors hover:bg-white/5">
          <Monitor size={17} className="text-slate-400" />
          {sesion.taquilla.nombre}
          <ChevronDown size={15} className="text-slate-500" />
        </button>
        <div className="h-6 w-px bg-white/10" />
        <button className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f7fa] text-sm font-bold text-slate-700">
            {sesion.usuario.iniciales}
          </span>
          <span className="hidden text-left leading-tight xl:block">
            <span className="block text-[15px] font-medium text-slate-200">{sesion.usuario.nombre}</span>
            <span className="block text-[11px] text-slate-400">{sesion.usuario.rol}</span>
          </span>
        </button>
      </div>
    </header>
  )
}
