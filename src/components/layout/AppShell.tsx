import { useState } from 'react'
import { AppHeader } from './AppHeader'
import { Sidebar } from './Sidebar'
import { PosView } from '../paneles/PosView'
import { EstadioEventosPage } from '../estadioEventos/EstadioEventosPage'
import { LoginPage } from '../auth/LoginPage'
import { useSesion } from '../../store/sesion'

type Vista = 'venta' | 'eventos'

export function AppShell() {
  const [vista, setVista] = useState<Vista>('venta')
  const { sesion, cerrarSesion } = useSesion()

  if (!sesion) {
    return <LoginPage />
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-page text-slate-900">
      <Sidebar
        activeId={vista}
        onNavigate={(id) => setVista(id === 'eventos' ? 'eventos' : 'venta')}
        onSalir={cerrarSesion}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="min-h-0 flex-1 overflow-y-auto">
          {vista === 'eventos' ? <EstadioEventosPage /> : <PosView />}
        </main>
      </div>
    </div>
  )
}

