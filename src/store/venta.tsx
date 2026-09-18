import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Asiento, ItemVenta, MetodoPago, Sector } from '../types'

const TASA_SERVICIO = 0.1

interface VentaContextValue {
  items: ItemVenta[]
  toggleAsiento: (sector: Sector, asiento: Asiento) => void
  removerItem: (asientoId: string) => void
  limpiarAsientos: () => void
  vaciarCarrito: () => void
  metodoPago: MetodoPago
  setMetodoPago: (m: MetodoPago) => void
  montoRecibido: string
  setMontoRecibido: (v: string) => void
  subtotal: number
  cargoServicio: number
  total: number
  cambio: number
}

const VentaContext = createContext<VentaContextValue | null>(null)

const ITEMS_INICIALES: ItemVenta[] = [
  { asientoId: 'sur-inferior:F-5', sector: 'SUR INFERIOR', fila: 'F', numero: 5, precio: 16.8 },
  { asientoId: 'sur-inferior:F-6', sector: 'SUR INFERIOR', fila: 'F', numero: 6, precio: 16.8 },
]

export function VentaProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemVenta[]>(ITEMS_INICIALES)
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
  const [montoRecibido, setMontoRecibido] = useState('50')

  const toggleAsiento = useCallback((sector: Sector, asiento: Asiento) => {
    setItems((prev) => {
      const existe = prev.some((i) => i.asientoId === asiento.id)
      if (existe) return prev.filter((i) => i.asientoId !== asiento.id)
      return [
        ...prev,
        {
          asientoId: asiento.id,
          sector: sector.nombre,
          fila: asiento.fila,
          numero: asiento.numero,
          precio: asiento.precio,
        },
      ]
    })
  }, [])

  const removerItem = useCallback((asientoId: string) => {
    setItems((prev) => prev.filter((i) => i.asientoId !== asientoId))
  }, [])

  const limpiarAsientos = useCallback(() => setItems([]), [])

  const vaciarCarrito = useCallback(() => {
    setItems([])
    setMontoRecibido('')
  }, [])

  const subtotal = useMemo(() => items.reduce((acc, i) => acc + i.precio, 0), [items])
  const cargoServicio = useMemo(() => subtotal * TASA_SERVICIO, [subtotal])
  const total = subtotal + cargoServicio

  const cambio = useMemo(() => {
    const monto = Number(montoRecibido) || 0
    return Math.max(0, monto - total)
  }, [montoRecibido, total])

  const value = useMemo<VentaContextValue>(
    () => ({
      items,
      toggleAsiento,
      removerItem,
      limpiarAsientos,
      vaciarCarrito,
      metodoPago,
      setMetodoPago,
      montoRecibido,
      setMontoRecibido,
      subtotal,
      cargoServicio,
      total,
      cambio,
    }),
    [
      items,
      toggleAsiento,
      removerItem,
      limpiarAsientos,
      vaciarCarrito,
      metodoPago,
      montoRecibido,
      subtotal,
      cargoServicio,
      total,
      cambio,
    ],
  )

  return <VentaContext.Provider value={value}>{children}</VentaContext.Provider>
}

export function useVenta() {
  const ctx = useContext(VentaContext)
  if (!ctx) throw new Error('useVenta debe usarse dentro de un VentaProvider')
  return ctx
}
