import type { EscudoSpec } from '../../types'

interface EscudoProps {
  spec: EscudoSpec
  size?: number
  className?: string
}

// Escudo SVG generado localmente (colores + iniciales + patrón). Sustituible por un
// <img> con el logo real en cuanto exista el asset.
export function Escudo({ spec, size = 40, className }: EscudoProps) {
  const h = Math.round((size * 50) / 44)
  const c1 = spec.color
  const c2 = spec.colorSecundario ?? spec.color
  const patron = spec.patron ?? 'solido'
  const uid = spec.iniciales.toLowerCase().replace(/[^a-z0-9]/g, '')
  const fontSize = spec.iniciales.length > 2 ? 9 : 11

  return (
    <svg viewBox="0 0 44 50" width={size} height={h} className={className} aria-hidden>
      <defs>
        <clipPath id={`clip-${uid}-${patron}`}>
          <path d="M22 2 L38 7 V24 C38 35 31 43 22 47 C13 43 6 35 6 24 V7 Z" />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${uid}-${patron})`}>
        <rect x="0" y="0" width="44" height="50" fill={c1} />
        {patron === 'mitades' ? <path d="M22 2 L38 7 V24 C38 35 31 43 22 47 Z" fill={c2} /> : null}
        {patron === 'franjas' ? (
          <g>
            <rect x="0" y="11" width="44" height="6" fill={c2} />
            <rect x="0" y="23" width="44" height="6" fill={c2} />
            <rect x="0" y="35" width="44" height="6" fill={c2} />
          </g>
        ) : null}
        {patron === 'anillo' ? <circle cx="22" cy="21" r="15" fill="none" stroke={c2} strokeWidth="6" /> : null}
        <circle cx="22" cy="25" r="12" fill="rgba(255,255,255,0.18)" />
        <text
          x="22"
          y="29"
          textAnchor="middle"
          fill="white"
          fontSize={fontSize}
          fontWeight="800"
          fontFamily="Inter, sans-serif"
        >
          {spec.iniciales}
        </text>
      </g>

      <path
        d="M22 2 L38 7 V24 C38 35 31 43 22 47 C13 43 6 35 6 24 V7 Z"
        fill="none"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1"
      />
      <path
        d="M22 5.5 L35 9.5 V24 C35 32.5 30 39 22 42.5 C14 39 9 32.5 9 24 V9.5 Z"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.2"
      />
      <circle cx="22" cy="5.5" r="1.8" fill="white" />
    </svg>
  )
}
