import { Component, lazy, Suspense, useMemo, useState, type ReactNode } from 'react'
import { useSector } from '../../hooks/usePos'
import { formatPrecio } from '../../lib/format'
import { SECCIONES, descripcionSeccion } from '../../data/secciones'
import { SECTOR_DEFECTO } from '../../mocks'
import estadioPng from '../../../assets/estadio-3d.webp'
import glbUrl from '../../../assets/mapa_estadio-opt.glb?url'
import { Card } from '../ui/Card'
import { EstadioMap } from './EstadioMap'
import { LeyendaSecciones } from './LeyendaSecciones'
import { SeatGrid } from './SeatGrid'
import { ZoomControls } from './ZoomControls'

const Estadio3D = lazy(() => import('./Estadio3D').then((m) => ({ default: m.Estadio3D })))

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function EstadioCard() {
  const [zoom, setZoom] = useState(1)
  const [imgError, setImgError] = useState(false)
  const [threeFailed, setThreeFailed] = useState(false)
  const [threeReady, setThreeReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedId, setSelectedId] = useState(SECTOR_DEFECTO)
  const { data: sector, isLoading } = useSector(selectedId)
  const seccionActiva = SECCIONES.find((s) => s.id === selectedId)

  const webgl = useMemo(() => {
    try {
      const c = document.createElement('canvas')
      return !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {
      return false
    }
  }, [])

  const use3D = webgl && !threeFailed

  return (
    <Card className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col gap-3 border-b border-slate-200 p-4 lg:border-b-0 lg:border-r">
        <div className="relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden rounded-xl bg-backdrop">
          {use3D ? (
            <>
              <Suspense fallback={null}>
                <Boundary onError={() => setThreeFailed(true)}>
                  <Estadio3D
                    url={glbUrl}
                    zoom={zoom}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onProgress={setProgress}
                    onReady={() => setThreeReady(true)}
                    onError={() => setThreeFailed(true)}
                  />
                </Boundary>
              </Suspense>
              {!threeReady ? <Cargando progress={progress} /> : null}
            </>
          ) : imgError ? (
            <EstadioMap zoom={zoom} />
          ) : (
            <img
              src={estadioPng}
              alt="Estadio"
              className="h-full w-full object-contain"
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}
              onError={() => setImgError(true)}
            />
          )}
          <ZoomControls zoom={zoom} onChange={setZoom} />
        </div>
        <div className="shrink-0">
          <LeyendaSecciones />
        </div>
      </div>

      <div className="flex min-h-0 w-full shrink-0 flex-col gap-4 p-4 lg:w-[46%]">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">{sector?.nombre ?? 'Selecciona una sección'}</h3>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {seccionActiva ? descripcionSeccion(seccionActiva) : '—'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Precio por asiento:{' '}
              <span className="font-semibold text-slate-700">{formatPrecio(sector?.precio ?? 0)}</span>
            </p>
          </div>
          {seccionActiva ? (
            <span
              className="mt-0.5 h-4 w-4 shrink-0 rounded-[4px] ring-1 ring-black/10"
              style={{ backgroundColor: seccionActiva.color }}
            />
          ) : null}
        </div>

        {isLoading ? (
          <div className="min-h-0 flex-1 animate-pulse rounded-lg bg-slate-100" />
        ) : sector && sector.asientos.length > 0 ? (
          <SeatGrid sector={sector} />
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 px-4 text-center text-sm text-slate-400">
            {sector ? 'Esta sección no tiene asientos' : 'Selecciona una sección en el mapa'}
          </div>
        )}
      </div>
    </Card>
  )
}

function Cargando({ progress }: { progress: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-backdrop/70">
      <span className="text-xs font-semibold text-white drop-shadow">
        {progress > 0 ? `Cargando estadio 3D… ${progress}%` : 'Cargando estadio 3D…'}
      </span>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/30">
        <div
          className="h-full rounded-full bg-white transition-[width]"
          style={{ width: `${progress > 0 ? progress : 10}%` }}
        />
      </div>
    </div>
  )
}

