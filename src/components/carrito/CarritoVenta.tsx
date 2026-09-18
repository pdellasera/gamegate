import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Armchair, BadgeCheck, Trash2 } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useVenta } from '../../store/venta'
import { useConfirmarVenta, useImprimir } from '../../hooks/usePos'
import { formatPrecio } from '../../lib/format'
import { AccionesVenta } from './AccionesVenta'
import { CajaCambio } from './CajaCambio'
import { ItemCarrito } from './ItemCarrito'
import { MetodoPago } from './MetodoPago'
import { MontoRecibido } from './MontoRecibido'
import { ResumenTotales } from './ResumenTotales'

type Paso = 'carrito' | 'pago'

interface Mensaje {
  tipo: 'ok' | 'info'
  texto: string
}

export function CarritoVenta() {
  const venta = useVenta()
  const confirmar = useConfirmarVenta()
  const imprimir = useImprimir()
  const [paso, setPaso] = useState<Paso>('carrito')
  const [mensaje, setMensaje] = useState<Mensaje | null>(null)
  const [comprador, setComprador] = useState('')
  const [contacto, setContacto] = useState('')

  const onConfirmar = useCallback(() => {
    if (venta.items.length === 0 || confirmar.isPending) return
    confirmar.mutate(
      {
        items: venta.items,
        metodoPago: venta.metodoPago,
        montoRecibido: Number(venta.montoRecibido) || 0,
        total: venta.total,
        cambio: venta.cambio,
      },
      {
        onSuccess: (r) => {
          venta.vaciarCarrito()
          setComprador('')
          setContacto('')
          setPaso('carrito')
          setMensaje({ tipo: 'ok', texto: `Venta ${r.id} confirmada — ${formatPrecio(r.total)}` })
        },
      },
    )
  }, [venta, confirmar])

  const onImprimir = useCallback(() => {
    if (venta.items.length === 0 || imprimir.isPending) return
    imprimir.mutate(
      { items: venta.items, total: venta.total },
      { onSuccess: (r) => setMensaje({ tipo: 'info', texto: `Ticket ${r.id} enviado a impresora` }) },
    )
  }, [venta, imprimir])

  const handlersRef = useRef({ onConfirmar, onImprimir })
  handlersRef.current = { onConfirmar, onImprimir }

  useEffect(() => {
    if (paso !== 'pago') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault()
        handlersRef.current.onConfirmar()
      } else if (e.key === 'F9') {
        e.preventDefault()
        handlersRef.current.onImprimir()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paso])

  return (
    <Card className="flex h-full min-h-0 flex-col p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
          Carrito de venta
          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold leading-none text-white">
            {venta.items.length}
          </span>
        </h3>
        {paso === 'carrito' && venta.items.length > 0 ? (
          <button
            onClick={venta.vaciarCarrito}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 transition-colors hover:underline"
          >
            <Trash2 size={14} />
            Vaciar
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {mensaje ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-2 overflow-hidden rounded-lg px-3 py-2 text-sm font-medium ${
              mensaje.tipo === 'ok' ? 'bg-change-bg text-change-fg' : 'bg-total-bg text-total-fg'
            }`}
          >
            {mensaje.texto}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {paso === 'carrito' ? (
        <>
          <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
            <div className="flex justify-between border-b border-slate-100 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <span>Asientos</span>
              <span>Precio</span>
            </div>
            <div className="space-y-1.5 pt-1.5">
              <AnimatePresence initial={false}>
                {venta.items.map((item) => (
                  <motion.div
                    key={item.asientoId}
                    layout
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                  >
                    <ItemCarrito item={item} onRemove={venta.removerItem} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {venta.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-sm text-slate-400">
                <Armchair size={22} className="text-slate-300" />
                El carrito está vacío
              </div>
            ) : null}
          </div>

          <div className="shrink-0 space-y-3 pt-2">
            <ResumenTotales />
            <Button
              className="h-12 w-full text-base"
              disabled={venta.items.length === 0}
              onClick={() => setPaso('pago')}
            >
              <BadgeCheck size={18} />
              Confirmar compra
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-2 min-h-0 flex-1 space-y-4 overflow-y-auto">
          <button
            onClick={() => setPaso('carrito')}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            <ArrowLeft size={14} />
            Volver al carrito
          </button>

          <div className="flex items-center justify-between rounded-lg bg-total-bg px-3 py-2.5">
            <span className="font-semibold text-total-fg">Total a pagar</span>
            <span className="text-base font-bold text-total-fg">{formatPrecio(venta.total)}</span>
          </div>

          <MetodoPago />

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Comprador
            </p>
            <div className="space-y-2">
              <input
                value={comprador}
                onChange={(e) => setComprador(e.target.value)}
                placeholder="Nombre completo"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <input
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Documento o teléfono"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <MontoRecibido />
          <CajaCambio />

          <AccionesVenta
            onConfirmar={onConfirmar}
            onImprimir={onImprimir}
            confirmando={confirmar.isPending}
            imprimiendo={imprimir.isPending}
            deshabilitado={venta.items.length === 0}
          />
        </div>
      )}
    </Card>
  )
}
