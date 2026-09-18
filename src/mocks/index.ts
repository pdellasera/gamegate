import { SECCIONES } from '../data/secciones'
import type { Accesos, Asiento, Evento, ResumenEvento, Sector, Zona } from '../types'

export const evento: Evento = {
  id: 'arabe-unido-vs-tauro',
  local: 'Árabe Unido FC',
  visitante: 'Tauro FC',
  fechaISO: '2026-10-15T19:30:00-05:00',
  lugar: 'Estadio Rommel Fernández',
  colorLocal: '#c8102e',
  colorVisitante: '#f5c518',
}

export const zonas: Zona[] = [
  { id: 'oriental', nombre: 'Oriental', color: '#16a34a', secciones: ['301', '302', '303', '304', '305', '306', '307'] },
  { id: 'norte', nombre: 'Norte', color: '#0b6bff', secciones: ['201', '202', '203', '204', '205', '206'] },
  { id: 'sur', nombre: 'Sur', color: '#e64244', secciones: ['401', '402', '403', '404', '405', '406'] },
  { id: 'occidental', nombre: 'Occidental', color: '#fbb61b', secciones: ['101', '102', '103', '104', '105', '106', '107', '108'] },
]

const FILAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const FILAS_BLOQUEADAS = new Set(['G', 'H', 'I', 'J'])

export const SECTOR_DEFECTO = 'sur-inferior'

function generarAsientos(seccionId: string, idx: number, precio: number): Asiento[] {
  const asientos: Asiento[] = []
  FILAS.forEach((fila, filaIdx) => {
    for (let n = 1; n <= 10; n++) {
      const estado = FILAS_BLOQUEADAS.has(fila)
        ? 'bloqueado'
        : (idx * 13 + filaIdx * 5 + n * 3) % 13 === 0
          ? 'ocupado'
          : 'disponible'
      asientos.push({ id: `${seccionId}:${fila}-${n}`, fila, numero: n, precio, estado })
    }
  })
  return asientos
}

export const sectores: Sector[] = SECCIONES.map((sec, idx) => ({
  id: sec.id,
  nombre: sec.nombre,
  zona: sec.lado,
  filas: FILAS,
  columnas: 10,
  precio: sec.precio,
  asientos: sec.lado === 'exterior' ? [] : generarAsientos(sec.id, idx, sec.precio),
}))

export const resumen: ResumenEvento = {
  capacidadTotal: 32000,
  vendidos: 28452,
  disponibles: 3548,
}

export const accesos: Accesos = {
  ingresosHoy: 12548,
  ultimaActualizacion: '6:24 PM',
}
