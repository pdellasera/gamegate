export function formatNum(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value)
}

export function formatPrecio(value: number): string {
  return `B/.${value.toFixed(2)}`
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MESES_LARGOS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

export function formatFechaCorta(fecha: Date): string {
  return `${DIAS[fecha.getDay()]}, ${fecha.getDate()} ${MESES_CORTOS[fecha.getMonth()]} ${fecha.getFullYear()}`
}

export function formatFechaLarga(fecha: Date): string {
  return `${fecha.getDate()} de ${MESES_LARGOS[fecha.getMonth()]} de ${fecha.getFullYear()}`
}

export function formatHora(fecha: Date): string {
  let h = fecha.getHours()
  const m = fecha.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}
