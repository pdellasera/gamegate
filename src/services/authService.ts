import { TAQUILLAS } from '../data/taquillas'
import { USUARIOS } from '../mocks/usuarios'
import type { Sesion } from '../types'

const delay = (ms = 450) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export interface LoginInput {
  codigo: string
  taquillaId: string
}

export async function login({ codigo, taquillaId }: LoginInput): Promise<Sesion> {
  await delay()

  const usuario = USUARIOS.find((u) => u.codigo.toLowerCase() === codigo.trim().toLowerCase())
  if (!usuario) {
    throw new Error('El código de usuario no es válido.')
  }

  const taquilla = TAQUILLAS.find((t) => t.id === taquillaId) ?? TAQUILLAS[0]

  return {
    usuario,
    taquilla,
    iniciadaEn: new Date().toISOString(),
  }
}
