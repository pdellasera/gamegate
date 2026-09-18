export interface IsoCfg {
  theta: number
  squash: number
  cx: number
  cy: number
}

export interface Pt {
  X: number
  Y: number
}

/** Proyección isométrica: rota la planta un ángulo y aplana el eje Y, luego resta la altura z. */
export function project(x: number, y: number, z: number, cfg: IsoCfg): Pt {
  const rad = (cfg.theta * Math.PI) / 180
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  const rx = x * c - y * s
  const ry = x * s + y * c
  return { X: cfg.cx + rx, Y: cfg.cy + ry * cfg.squash - z }
}

export function arcPts(
  rx: number,
  ry: number,
  a1: number,
  a2: number,
  steps: number,
  cfg: IsoCfg,
  z = 0,
): Pt[] {
  const pts: Pt[] = []
  const span = a2 - a1
  for (let i = 0; i <= steps; i++) {
    const a = (a1 + span * (i / steps)) * (Math.PI / 180)
    pts.push(project(rx * Math.cos(a), ry * Math.sin(a), z, cfg))
  }
  return pts
}

export function polyline(pts: Pt[], close = false): string {
  if (pts.length === 0) return ''
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.X.toFixed(2)} ${p.Y.toFixed(2)}`).join(' ')
  return close ? `${d} Z` : d
}

/** Anillo completo (superficie) entre dos elipses concéntricas. */
export function ringPath(rxO: number, ryO: number, rxI: number, ryI: number, cfg: IsoCfg, z = 0, steps = 128): string {
  const outer = arcPts(rxO, ryO, 0, 360, steps, cfg, z)
  const inner = arcPts(rxI, ryI, 0, 360, steps, cfg, z).reverse()
  return polyline([...outer, ...inner], true)
}

/** Banda anular (segmento de anillo) entre dos radios y un arco angular [a1, a2]. */
export function bandPath(
  rxO: number,
  ryO: number,
  rxI: number,
  ryI: number,
  a1: number,
  a2: number,
  cfg: IsoCfg,
  z = 0,
  steps = 32,
): string {
  const outer = arcPts(rxO, ryO, a1, a2, steps, cfg, z)
  const inner = arcPts(rxI, ryI, a1, a2, steps, cfg, z).reverse()
  return polyline([...outer, ...inner], true)
}

/** Rectángulo alineado en planta, proyectado (paralelogramo). */
export function rectPath(x0: number, y0: number, x1: number, y1: number, cfg: IsoCfg, z = 0): string {
  const pts = [
    project(x0, y0, z, cfg),
    project(x1, y0, z, cfg),
    project(x1, y1, z, cfg),
    project(x0, y1, z, cfg),
  ]
  return polyline(pts, true)
}

export function line(x1: number, y1: number, x2: number, y2: number, cfg: IsoCfg, z = 0): string {
  const a = project(x1, y1, z, cfg)
  const b = project(x2, y2, z, cfg)
  return `M${a.X.toFixed(2)} ${a.Y.toFixed(2)} L${b.X.toFixed(2)} ${b.Y.toFixed(2)}`
}
