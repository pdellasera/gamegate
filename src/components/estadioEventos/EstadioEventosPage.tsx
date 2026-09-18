import { useState } from 'react'
import { Card } from '../ui/Card'
import { CardEventosEstadio } from './CardEventosEstadio'
import { CardRenderEstadio } from './CardRenderEstadio'
import { DatosEstadio } from './DatosEstadio'
import { LeyendaEstadio } from './LeyendaEstadio'
import { TabsEstadio, type TabEstadioId } from './TabsEstadio'
import { TituloEstadio } from './TituloEstadio'

const TEXTO_TAB: Record<Exclude<TabEstadioId, 'eventos'>, string> = {
  informacion: 'Información del estadio',
  mapa: 'Mapa de asientos',
  servicios: 'Servicios del estadio',
  galeria: 'Galería',
}

function TabPlaceholder({ tab }: { tab: Exclude<TabEstadioId, 'eventos'> }) {
  return (
    <Card className="flex h-full min-h-0 items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-700">{TEXTO_TAB[tab]}</p>
        <p className="mt-1 text-sm text-slate-400">Módulo en construcción</p>
      </div>
    </Card>
  )
}

export function EstadioEventosPage() {
  const [tab, setTab] = useState<TabEstadioId>('eventos')

  return (
    <div className="h-full min-h-0 bg-white">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1520px] flex-col gap-4 p-4 xl:p-5">
        <TituloEstadio />
        <TabsEstadio value={tab} onChange={setTab} />

        {tab === 'eventos' ? (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,48fr)_minmax(0,52fr)]">
            <div className="flex min-h-0 min-w-0 flex-col gap-3">
              <CardRenderEstadio />
              <LeyendaEstadio />
              <DatosEstadio />
            </div>
            <div className="min-h-0 min-w-0">
              <CardEventosEstadio />
            </div>
          </div>
        ) : (
          <TabPlaceholder tab={tab} />
        )}
      </div>
    </div>
  )
}
