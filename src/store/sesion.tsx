import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Sesion } from '../types'

const STORAGE_KEY = 'ticketera.sesion'

interface SesionContextValue {
  sesion: Sesion | null
  iniciarSesion: (sesion: Sesion) => void
  cerrarSesion: () => void
}

const SesionContext = createContext<SesionContextValue | null>(null)

function leerSesion(): Sesion | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Sesion
    if (!parsed?.usuario?.codigo || !parsed?.taquilla?.id) return null
    return parsed
  } catch {
    return null
  }
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(() => leerSesion())

  useEffect(() => {
    try {
      if (sesion) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // localStorage no disponible (p. ej. modo privado): la sesión vive solo en memoria.
    }
  }, [sesion])

  const iniciarSesion = useCallback((nueva: Sesion) => setSesion(nueva), [])
  const cerrarSesion = useCallback(() => setSesion(null), [])

  const value = useMemo<SesionContextValue>(
    () => ({ sesion, iniciarSesion, cerrarSesion }),
    [sesion, iniciarSesion, cerrarSesion],
  )

  return <SesionContext.Provider value={value}>{children}</SesionContext.Provider>
}

export function useSesion() {
  const ctx = useContext(SesionContext)
  if (!ctx) throw new Error('useSesion debe usarse dentro de un SesionProvider')
  return ctx
}
