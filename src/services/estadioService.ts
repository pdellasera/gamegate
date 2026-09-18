import { ESTADIO_ROMMEL } from '../data/estadio'
import { eventosEstadio } from '../mocks/eventosEstadio'
import type { CategoriaEvento, EstadioInfo, EventoResumen } from '../types'

const delay = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getEstadio(): Promise<EstadioInfo> {
  await delay()
  return ESTADIO_ROMMEL
}

export async function getEventosEstadio(categoria: CategoriaEvento | 'Todos'): Promise<EventoResumen[]> {
  await delay()
  if (categoria === 'Todos') return eventosEstadio
  return eventosEstadio.filter((e) => e.categoria === categoria)
}
