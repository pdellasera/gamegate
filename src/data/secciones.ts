export interface SeccionZona {
  id: string
  nombre: string
  color: string
  precio: number
  lado: 'este' | 'oeste' | 'sur' | 'balboa' | 'exterior'
  nivel: 'superior' | 'inferior' | null
  angulo: number
  radio: number
  span: number
}

// Distribución real (assets/Distribucion.png) — colores muestreados con Pillow.
// angulo: grados en el plano X-Z del modelo (ESTE=+X, SUR=+Z, OESTE=-X).
export const SECCIONES: SeccionZona[] = [
  { id: 'sur-superior', nombre: 'SUR SUPERIOR', color: '#9b0214', precio: 11.2, lado: 'sur', nivel: 'superior', angulo: 90, radio: 0.955, span: 70 },
  { id: 'sur-inferior', nombre: 'SUR INFERIOR', color: '#d60d20', precio: 16.8, lado: 'sur', nivel: 'inferior', angulo: 90, radio: 0.85, span: 70 },
  { id: 'este-superior', nombre: 'ESTE SUPERIOR', color: '#002786', precio: 16.8, lado: 'este', nivel: 'superior', angulo: 0, radio: 0.955, span: 70 },
  { id: 'este-inferior', nombre: 'ESTE INFERIOR', color: '#0054d8', precio: 28.2, lado: 'este', nivel: 'inferior', angulo: 0, radio: 0.85, span: 70 },
  { id: 'oeste-superior', nombre: 'OESTE SUPERIOR', color: '#ff81ec', precio: 22.4, lado: 'oeste', nivel: 'superior', angulo: 180, radio: 0.955, span: 70 },
  { id: 'oeste-inferior', nombre: 'OESTE INFERIOR', color: '#dc0ca0', precio: 39.2, lado: 'oeste', nivel: 'inferior', angulo: 180, radio: 0.85, span: 70 },
  { id: 'balboa', nombre: 'ZONA BALBOA', color: '#e4a5b0', precio: 11.2, lado: 'balboa', nivel: 'inferior', angulo: 135, radio: 0.85, span: 20 },
  { id: 'estacionamientos', nombre: 'ESTACIONAMIENTOS', color: '#cbd5e1', precio: 16.8, lado: 'exterior', nivel: null, angulo: 270, radio: 1.25, span: 0 },
]

export function descripcionSeccion(sec: SeccionZona): string {
  if (sec.lado === 'balboa') return 'Zona Balboa'
  if (sec.lado === 'exterior') return 'Exterior'
  const lados: Record<string, string> = { sur: 'Lado Sur', este: 'Lado Este', oeste: 'Lado Oeste' }
  const nivel = sec.nivel === 'superior' ? 'Tribuna superior' : 'Tribuna inferior'
  return `${lados[sec.lado] ?? 'Lado'} · ${nivel}`
}


