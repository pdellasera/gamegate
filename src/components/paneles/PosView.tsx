import { useState } from 'react'
import { Breadcrumb } from '../layout/Breadcrumb'
import { EventoCard } from '../evento/EventoCard'
import { TabsZonas, type TabId } from '../evento/TabsZonas'
import { EstadioCard } from '../estadio/EstadioCard'
import { CarritoVenta } from '../carrito/CarritoVenta'
import { PanelCliente } from './PanelCliente'
import { ResumenEvento } from './ResumenEvento'
import { AccesosDelDia } from './AccesosDelDia'
import { EstadoSistema } from './EstadoSistema'
import { Reveal } from '../ui/Reveal'
import { Card } from '../ui/Card'

const TEXTOS_TAB: Record<Exclude<TabId, 'mapa'>, string> = {
  zonas: 'Lista de zonas',
  precios: 'Precios por zona',
  disponibilidad: 'Disponibilidad por sector',
}

function TabPlaceholder({ tab }: { tab: Exclude<TabId, 'mapa'> }) {
  return (
    <Card className="flex h-full min-h-0 items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-700">{TEXTOS_TAB[tab]}</p>
        <p className="mt-1 text-sm text-slate-400">Módulo en construcción</p>
      </div>
    </Card>
  )
}

export function PosView() {
  const [tab, setTab] = useState<TabId>('mapa')

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[1520px] flex-col gap-4 p-4 xl:p-5">
      <Reveal delay={0} className="shrink-0">
        <Breadcrumb />
      </Reveal>

      <div className="grid min-h-0 flex-1 items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_412px] xl:grid-rows-[minmax(0,1fr)]">
        <Reveal delay={0.05} className="flex min-h-0 min-w-0 flex-col gap-4">
          <div className="shrink-0">
            <EventoCard />
          </div>
          <div className="shrink-0">
            <TabsZonas value={tab} onChange={setTab} />
          </div>
          <div className="min-h-0 flex-1">
            {tab === 'mapa' ? <EstadioCard /> : <TabPlaceholder tab={tab} />}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="min-h-0 min-w-0">
          <CarritoVenta />
        </Reveal>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0.15}>
          <PanelCliente />
        </Reveal>
        <Reveal delay={0.2}>
          <ResumenEvento />
        </Reveal>
        <Reveal delay={0.25}>
          <AccesosDelDia />
        </Reveal>
        <Reveal delay={0.3}>
          <EstadoSistema />
        </Reveal>
      </div>
    </div>
  )
}
