import { FormularioLogin } from './FormularioLogin'
import { SelloSeguridad } from './SelloSeguridad'

export function TarjetaLogin() {
  return (
    <div className="absolute left-[54.43%] top-0 z-10 w-[45.57%] px-8 pt-[110px]">
      <div className="mx-auto w-full max-w-[560px] rounded-[20px] border border-[#eef3fb] bg-white shadow-[0_18px_40px_-12px_rgba(15,23,42,0.20)]">
        <div className="flex flex-col p-11">
          <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.01em] text-[#0b1220]">
            Iniciar sesión
          </h1>
          <p className="mt-[18px] text-[16px] leading-[20px] text-[#4a5878]">
            Ingresa para continuar con la venta de entradas
          </p>

          <FormularioLogin />

          <div className="mt-[52px]">
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-[#e6ecf5]" />
              <span className="text-[13px] font-medium text-[#7a869d]">LPF – GameGate</span>
              <span className="h-px flex-1 bg-[#e6ecf5]" />
            </div>
            <p className="mt-[12px] text-center text-[13px] text-[#7a869d]">Boletín oficial</p>
          </div>

          <div className="mt-[39px]">
            <SelloSeguridad />
          </div>
        </div>
      </div>
    </div>
  )
}

