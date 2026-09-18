import { Headset, ShieldCheck, Ticket } from 'lucide-react'
import backgroundLogin from '../../../assets/background_login.png'
import logoWhite from '../../../assets/logo_white.webp'
import { IndicadorCarrusel } from './IndicadorCarrusel'

const FEATURES = [
  { icon: Ticket, label: 'Acceso rápido' },
  { icon: ShieldCheck, label: 'Transacciones seguras' },
  { icon: Headset, label: 'Soporte 24/7' },
]

export function PanelMarca() {
  return (
    <section
      className="absolute inset-0 z-0 overflow-hidden bg-ink-950"
      style={{
        clipPath: 'polygon(0% 0%, 61.26% 0%, 57.94% 14.45%, 53.91% 86.72%, 53.19% 100%, 0% 100%)',
      }}
    >
      <img
        src={backgroundLogin}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full select-none object-cover object-center"
      />

      {/* Scrim navy para legibilidad del texto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(3,20,48,0.62) 0%, rgba(3,20,48,0.28) 35%, rgba(2,12,30,0.55) 75%, rgba(2,10,26,0.82) 100%)',
        }}
      />
      {/* Glow azul superior derecho */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(60% 45% at 88% -6%, rgba(0,132,248,0.55) 0%, rgba(0,132,248,0) 62%)',
        }}
      />

      <div className="relative flex h-full w-[54.43%] flex-col items-center px-6 text-center">
        <img
          src={logoWhite}
          alt="GameGate — Boletería oficial LPF"
          className="mt-[96px] w-[570px] max-w-[68%] select-none"
        />

        <h1 className="mt-[76px] text-[48px] font-extrabold uppercase leading-[1.2] tracking-[-0.01em] text-white">
          <span className="block">El fútbol</span>
          <span className="block text-[#0084f8]">nos une</span>
        </h1>

        <p className="mt-[20px] max-w-[330px] text-[19px] leading-[1.5] text-white">
          Vive grandes momentos, nosotros te acercamos a ellos.
        </p>

        <div className="mt-auto flex w-full flex-col items-center pb-[73px]">
          <div className="flex w-[540px] max-w-full items-start justify-between">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <Icon size={40} strokeWidth={1.5} className="text-[#a6d3fc]" />
                <span className="mt-[12px] text-[15px] font-medium leading-snug text-white">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-[33px]">
            <IndicadorCarrusel />
          </div>
        </div>
      </div>
    </section>
  )
}
