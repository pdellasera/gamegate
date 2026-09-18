import { accesos, evento, resumen, sectores, zonas } from '../mocks'
import type { Accesos, Evento, ItemVenta, MetodoPago, ResumenEvento, Sector, VentaResultado, Zona } from '../types'

const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getEvento(): Promise<Evento> {
  await delay()
  return evento
}

export async function getZonas(): Promise<Zona[]> {
  await delay()
  return zonas
}

export async function getSector(id: string): Promise<Sector> {
  await delay()
  return sectores.find((s) => s.id === id) ?? sectores[0]
}

export async function getResumen(): Promise<ResumenEvento> {
  await delay()
  return resumen
}

export async function getAccesos(): Promise<Accesos> {
  await delay()
  return accesos
}

export interface ConfirmarVentaInput {
  items: ItemVenta[]
  metodoPago: MetodoPago
  montoRecibido: number
  total: number
  cambio: number
}

export async function confirmarVenta(input: ConfirmarVentaInput): Promise<VentaResultado> {
  await delay(600)
  return {
    id: `V-${Date.now().toString().slice(-6)}`,
    total: input.total,
    cambio: input.cambio,
    fecha: new Date().toISOString(),
  }
}

export async function imprimirSinCobrar(_input: { items: ItemVenta[]; total: number }): Promise<{ id: string }> {
  await delay(400)
  return { id: `I-${Date.now().toString().slice(-6)}` }
}
