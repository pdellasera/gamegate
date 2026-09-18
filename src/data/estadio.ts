import type { EstadioInfo, SeccionLeyenda } from '../types'

// Paleta y orden medidos con Pillow desde assets/Evento_sreen.png (leyenda "Secciones del estadio").
export const SECCIONES_LEYENDA: SeccionLeyenda[] = [
  { id: 'sur-superior', nombre: 'Sur Superior', color: '#970203' },
  { id: 'sur-inferior', nombre: 'Sur Inferior', color: '#ed0f16' },
  { id: 'balboa', nombre: 'Zona Balboa', color: '#fdacc6' },
  { id: 'estacionamientos', nombre: 'Estacionamientos', color: '#fe6dde' },
  { id: 'este-superior', nombre: 'Este Superior', color: '#01299d' },
  { id: 'este-inferior', nombre: 'Este Inferior', color: '#0264fc' },
  { id: 'oeste-superior', nombre: 'Oeste Superior', color: '#fdaccd' },
  { id: 'oeste-inferior', nombre: 'Oeste Inferior', color: '#fa049c' },
]

export const ESTADIO_ROMMEL: EstadioInfo = {
  id: 'rommel-fernandez',
  nombre: 'Estadio Rommel Fernández',
  ciudad: 'Panamá',
  pais: 'Panamá',
  capacidad: '32,000',
  dimensiones: '105 x 68 m',
  anio: '1970',
  secciones: SECCIONES_LEYENDA,
}
