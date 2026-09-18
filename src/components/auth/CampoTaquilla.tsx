import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Ticket } from 'lucide-react'
import { cn } from '../../lib/cn'
import { TAQUILLAS } from '../../data/taquillas'

interface CampoTaquillaProps {
  id?: string
  value: string
  onChange: (id: string) => void
  className?: string
  error?: boolean
}

export function CampoTaquilla({ id, value, onChange, className, error }: CampoTaquillaProps) {
  const [abierto, setAbierto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const seleccionada = TAQUILLAS.find((t) => t.id === value) ?? null

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        id={id}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        className={cn(
          'flex h-[62px] w-full items-center rounded-xl border bg-white pl-[64px] pr-12 text-left text-[16px] focus:outline-none focus:ring-2',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
            : 'border-[#dce6f1] focus:border-brand-500 focus:ring-brand-500/20',
        )}
      >
        <Ticket
          size={24}
          strokeWidth={1.7}
          className="pointer-events-none absolute left-[27px] top-1/2 -translate-y-1/2 text-[#98a2b6]"
        />
        <span className={cn('truncate', seleccionada ? 'text-slate-900' : 'text-[#98a2b6]')}>
          {seleccionada ? seleccionada.nombre : 'Selecciona la taquilla'}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition-transform',
            abierto && 'rotate-180',
          )}
        />
      </button>

      {abierto ? (
        <ul
          role="listbox"
          aria-label="Taquillas"
          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-[#e3eaf3] bg-white py-1.5 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)]"
        >
          {TAQUILLAS.map((t) => {
            const activa = t.id === value
            return (
              <li key={t.id} role="option" aria-selected={activa}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(t.id)
                    setAbierto(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] transition-colors',
                    activa ? 'bg-brand-50' : 'hover:bg-slate-50',
                  )}
                >
                  <Ticket
                    size={18}
                    strokeWidth={1.8}
                    className={cn('shrink-0', activa ? 'text-brand-600' : 'text-slate-400')}
                  />
                  <span className={cn('flex-1 font-medium', activa ? 'text-brand-700' : 'text-slate-700')}>
                    {t.nombre}
                  </span>
                  {activa ? <Check size={16} className="shrink-0 text-brand-600" /> : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

