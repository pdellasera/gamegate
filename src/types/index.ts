export type EstadoAsiento = 'disponible' | 'ocupado' | 'bloqueado'
export type EstadoVisual = EstadoAsiento | 'seleccionado'

export interface Evento {
  id: string
  local: string
  visitante: string
  fechaISO: string
  lugar: string
  colorLocal: string
  colorVisitante: string
}

export interface Zona {
  id: string
  nombre: string
  color: string
  secciones: string[]
}

export interface Asiento {
  id: string
  fila: string
  numero: number
  precio: number
  estado: EstadoAsiento
}

export interface Sector {
  id: string
  nombre: string
  zona: string
  filas: string[]
  columnas: number
  precio: number
  asientos: Asiento[]
}

export interface ItemVenta {
  asientoId: string
  sector: string
  fila: string
  numero: number
  precio: number
}

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'otros'

export interface ResumenEvento {
  capacidadTotal: number
  vendidos: number
  disponibles: number
}

export interface Accesos {
  ingresosHoy: number
  ultimaActualizacion: string
}

export interface VentaResultado {
  id: string
  total: number
  cambio: number
  fecha: string
}

export type CategoriaEvento = 'LPF' | 'Selección' | 'Concierto' | 'Otros'

export interface EscudoSpec {
  color: string
  colorSecundario?: string
  iniciales: string
  patron?: 'solido' | 'mitades' | 'franjas' | 'anillo'
}

export interface EventoResumen {
  id: string
  categoria: CategoriaEvento
  titulo: string
  local: string
  visitante: string
  mes: string
  dia: string
  anio: string
  hora: string
  lugar: string
  escudoLocal?: EscudoSpec
  escudoVisitante?: EscudoSpec
  esConcierto?: boolean
}

export interface SeccionLeyenda {
  id: string
  nombre: string
  color: string
}

export interface EstadioInfo {
  id: string
  nombre: string
  ciudad: string
  pais: string
  capacidad: string
  dimensiones: string
  anio: string
  secciones: SeccionLeyenda[]
}

export interface Taquilla {
  id: string
  nombre: string
  sede: string
}

export interface Usuario {
  codigo: string
  nombre: string
  rol: string
  iniciales: string
}

export interface Sesion {
  usuario: Usuario
  taquilla: Taquilla
  iniciadaEn: string
}
