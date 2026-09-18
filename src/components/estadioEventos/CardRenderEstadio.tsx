import { useState } from 'react'
import estadioImg from '../../../assets/estadio-3d.webp'
import { Card } from '../ui/Card'

export function CardRenderEstadio() {
  const [error, setError] = useState(false)

  return (
    <Card className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
      {error ? (
        <p className="text-sm text-slate-400">Vista previa del estadio</p>
      ) : (
        <img
          src={estadioImg}
          alt="Render del Estadio Rommel Fernández"
          className="h-full w-full object-contain"
          onError={() => setError(true)}
        />
      )}
    </Card>
  )
}
