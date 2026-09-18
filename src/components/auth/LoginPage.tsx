import { PanelMarca } from './PanelMarca'
import { TarjetaLogin } from './TarjetaLogin'

export function LoginPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f2f7fd_100%)]">
      <PanelMarca />
      <TarjetaLogin />
    </div>
  )
}

