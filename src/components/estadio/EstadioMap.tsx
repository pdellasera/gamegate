import { zonas } from '../../mocks'
import { arcPts, bandPath, line, polyline, project, rectPath, ringPath, type IsoCfg } from '../../lib/iso'

interface EstadioMapProps {
  zoom: number
}

const CFG: IsoCfg = { theta: -35, squash: 0.52, cx: 280, cy: 260 }

const R_RIM = 190
const R_SEAT_OUT = 174
const R_SEAT_IN = 100
const R_PISTA = 92
const PITCH_RX = 74
const PITCH_RY = 50

const RIM_Z = 60
const SEAT_TOP_Z = 56
const SEAT_BOT_Z = 30
const PISTA_Z = 22

const ROWS = 12
const ROW_H = (R_SEAT_OUT - R_SEAT_IN) / ROWS
const SEAT_MID = (R_SEAT_OUT + R_SEAT_IN) / 2

const FRONT_A1 = 35
const FRONT_A2 = 215

interface ZonaVisual {
  id: string
  start: number
  end: number
  from: string
  to: string
}

const ZONAS: ZonaVisual[] = [
  { id: 'oriental', start: 215, end: 305, from: '#3f9c46', to: '#2f7a35' },
  { id: 'norte', start: 305, end: 395, from: '#4b9df0', to: '#1b4a9e' },
  { id: 'sur', start: 35, end: 125, from: '#e94a43', to: '#c22f2a' },
  { id: 'occidental', start: 125, end: 215, from: '#f7a8d3', to: '#d6339b' },
]

function rad(deg: number) {
  return (deg * Math.PI) / 180
}

function Defs() {
  return (
    <defs>
      <linearGradient id="facadeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#d7dfe9" />
      </linearGradient>
      <linearGradient id="bowlShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#081522" stopOpacity="0" />
        <stop offset="0.5" stopColor="#081522" stopOpacity="0.02" />
        <stop offset="1" stopColor="#081522" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="towerGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b4becb" />
        <stop offset="1" stopColor="#7d8b9c" />
      </linearGradient>
      {ZONAS.map((zn) => {
        const p1 = project(SEAT_MID * Math.cos(rad(zn.start)), SEAT_MID * Math.sin(rad(zn.start)), SEAT_TOP_Z, CFG)
        const p2 = project(SEAT_MID * Math.cos(rad(zn.end)), SEAT_MID * Math.sin(rad(zn.end)), SEAT_TOP_Z, CFG)
        return (
          <linearGradient
            key={zn.id}
            id={`grad-${zn.id}`}
            gradientUnits="userSpaceOnUse"
            x1={p1.X}
            y1={p1.Y}
            x2={p2.X}
            y2={p2.Y}
          >
            <stop offset="0" stopColor={zn.from} />
            <stop offset="1" stopColor={zn.to} />
          </linearGradient>
        )
      })}
    </defs>
  )
}

function Gradas() {
  const facadeTop = arcPts(R_RIM, R_RIM, FRONT_A1, FRONT_A2, 72, CFG, RIM_Z)
  const facadeBot = arcPts(R_RIM, R_RIM, FRONT_A1, FRONT_A2, 72, CFG, 0).reverse()
  const facadeD = polyline([...facadeTop, ...facadeBot], true)

  const ribs: string[] = []
  for (let a = FRONT_A1; a <= FRONT_A2; a += 6) {
    const c = Math.cos(rad(a))
    const s = Math.sin(rad(a))
    const p1 = project(R_RIM * c, R_RIM * s, RIM_Z, CFG)
    const p2 = project(R_RIM * c, R_RIM * s, 0, CFG)
    ribs.push(`M${p1.X.toFixed(2)} ${p1.Y.toFixed(2)} L${p2.X.toFixed(2)} ${p2.Y.toFixed(2)}`)
  }

  const tris: string[] = []
  for (let a = 0; a < 360; a += 9) {
    const c = Math.cos(rad(a))
    const s = Math.sin(rad(a))
    const p1 = project(R_RIM * c, R_RIM * s, RIM_Z, CFG)
    const p2 = project(R_RIM * c, R_RIM * s, RIM_Z + 13, CFG)
    const p3 = project((R_RIM - 10) * c, (R_RIM - 10) * s, RIM_Z, CFG)
    tris.push(`M${p1.X.toFixed(2)} ${p1.Y.toFixed(2)} L${p2.X.toFixed(2)} ${p2.Y.toFixed(2)} L${p3.X.toFixed(2)} ${p3.Y.toFixed(2)} Z`)
  }

  return (
    <g>
      <path d={ringPath(R_RIM + 9, R_RIM + 9, R_RIM - 2, R_RIM - 2, CFG, -2, 140)} fill="rgba(10,42,66,0.10)" />

      <path d={facadeD} fill="url(#facadeGrad)" stroke="#dde4ec" strokeWidth="1" />
      <path d={ribs.join(' ')} fill="none" stroke="rgba(15,40,70,0.10)" strokeWidth="1.5" />

      <path d={ringPath(R_RIM, R_RIM, R_SEAT_OUT, R_SEAT_OUT, CFG, RIM_Z, 160)} fill="#f6f8fb" stroke="#dde4ec" strokeWidth="1" />
      <path d={tris.join(' ')} fill="#e8edf3" />

      {Array.from({ length: ROWS }, (_, i) => {
        const rO = R_SEAT_OUT - i * ROW_H
        const rI = rO - ROW_H
        const z = SEAT_TOP_Z - (i * (SEAT_TOP_Z - SEAT_BOT_Z)) / ROWS
        return ZONAS.map((zn) => (
          <path
            key={`${zn.id}-${i}`}
            d={bandPath(rO, rO, rI, rI, zn.start, zn.end, CFG, z, 26)}
            fill={`url(#grad-${zn.id})`}
          />
        ))
      })}

      <path d={ringPath(R_SEAT_OUT, R_SEAT_OUT, R_SEAT_IN, R_SEAT_IN, CFG, SEAT_TOP_Z, 160)} fill="url(#bowlShade)" />

      {ZONAS.map((zn) => {
        const secciones = zonas.find((z) => z.id === zn.id)?.secciones ?? []
        const n = secciones.length
        const span = zn.end - zn.start
        return secciones.map((s, i) => {
          const a = zn.start + span * (i / n)
          const c = Math.cos(rad(a))
          const si = Math.sin(rad(a))
          const p1 = project(R_SEAT_OUT * c, R_SEAT_OUT * si, SEAT_TOP_Z, CFG)
          const p2 = project(R_SEAT_IN * c, R_SEAT_IN * si, SEAT_BOT_Z, CFG)

          const mid = zn.start + span * ((i + 0.5) / n)
          const mc = Math.cos(rad(mid))
          const ms = Math.sin(rad(mid))
          const np = project(SEAT_MID * mc, SEAT_MID * ms, SEAT_TOP_Z + 3, CFG)

          return (
            <g key={`${zn.id}-${s}`}>
              <path d={`M${p1.X.toFixed(2)} ${p1.Y.toFixed(2)} L${p2.X.toFixed(2)} ${p2.Y.toFixed(2)}`} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
              <text
                x={np.X}
                y={np.Y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="800"
                stroke="rgba(20,25,45,0.30)"
                strokeWidth="0.75"
                paintOrder="stroke"
              >
                {s}
              </text>
            </g>
          )
        })
      })}
    </g>
  )
}

function Cancha() {
  const pitch = rectPath(-PITCH_RX, -PITCH_RY, PITCH_RX, PITCH_RY, CFG, 0)

  const stripes: string[] = []
  const STRIPES = 7
  for (let i = 0; i < STRIPES; i++) {
    const x0 = -PITCH_RX + (i * 2 * PITCH_RX) / STRIPES
    const x1 = x0 + (2 * PITCH_RX) / STRIPES
    if (i % 2 === 0) stripes.push(rectPath(x0, -PITCH_RY, x1, PITCH_RY, CFG, 0))
  }

  const centerCircle = polyline(arcPts(12, 12, 0, 360, 48, CFG, 0), true)
  const centro = project(0, 0, 0, CFG)

  return (
    <g>
      <path
        d={ringPath(R_SEAT_IN, R_SEAT_IN, R_PISTA, R_PISTA, CFG, PISTA_Z, 128)}
        fill="#ffffff"
        stroke="#e6ebf1"
        strokeWidth="1"
      />

      <path d={pitch} fill="#3c9440" />
      <path d={stripes.join(' ')} fill="#2f7c34" />
      <path d={pitch} fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />

      <path d={line(0, -PITCH_RY, 0, PITCH_RY, CFG, 0)} stroke="#ffffff" strokeWidth="1.8" />
      <path d={centerCircle} fill="none" stroke="#ffffff" strokeWidth="1.8" />
      <circle cx={centro.X} cy={centro.Y} r="2" fill="#ffffff" />

      <path d={rectPath(-PITCH_RX, -26, -PITCH_RX + 16, 26, CFG, 0)} fill="none" stroke="#ffffff" strokeWidth="1.8" />
      <path d={rectPath(PITCH_RX - 16, -26, PITCH_RX, 26, CFG, 0)} fill="none" stroke="#ffffff" strokeWidth="1.8" />
      <path d={rectPath(-PITCH_RX, -11, -PITCH_RX + 8, 11, CFG, 0)} fill="none" stroke="#ffffff" strokeWidth="1.6" />
      <path d={rectPath(PITCH_RX - 8, -11, PITCH_RX, 11, CFG, 0)} fill="none" stroke="#ffffff" strokeWidth="1.6" />
    </g>
  )
}

function Torres() {
  const H = 46
  const W = 20
  return (
    <g>
      {[260, 350].map((a) => {
        const c = Math.cos(rad(a))
        const s = Math.sin(rad(a))
        const base = project((R_RIM + 4) * c, (R_RIM + 4) * s, RIM_Z, CFG)
        return (
          <g key={a} transform={`translate(${base.X.toFixed(2)} ${base.Y.toFixed(2)})`}>
            <path d={`M${-W / 2} 0 L${-W / 2} ${-H} L${W / 2} ${-H} L${W / 2} 0 Z`} fill="url(#towerGrad)" />
            <path d={`M${-W / 2 - 3} ${-H} L0 ${-H - 12} L${W / 2 + 3} ${-H} Z`} fill="#8b97a6" />
          </g>
        )
      })}
    </g>
  )
}

export function EstadioMap({ zoom }: EstadioMapProps) {
  return (
    <svg
      viewBox="0 0 560 480"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
      role="img"
      aria-label="Mapa del estadio"
    >
      <Defs />
      <rect x="0" y="0" width="560" height="480" fill="#374151" />
      <Gradas />
      <Cancha />
      <Torres />
    </svg>
  )
}
