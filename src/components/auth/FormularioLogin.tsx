import { useState } from 'react'
import type { FormEvent } from 'react'
import { login } from '../../services/authService'
import { useSesion } from '../../store/sesion'
import { BotonIngresar } from './BotonIngresar'
import { CampoCodigo } from './CampoCodigo'
import { CampoTaquilla } from './CampoTaquilla'

export function FormularioLogin() {
  const { iniciarSesion } = useSesion()
  const [codigo, setCodigo] = useState('')
  const [taquillaId, setTaquillaId] = useState('')
  const [pendiente, setPendiente] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCampo, setErrorCampo] = useState<'codigo' | 'taquilla' | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pendiente) return
    setError(null)
    setErrorCampo(null)

    if (!codigo.trim()) {
      setError('Ingresa tu código de usuario.')
      setErrorCampo('codigo')
      return
    }
    if (!taquillaId) {
      setError('Selecciona una taquilla.')
      setErrorCampo('taquilla')
      return
    }

    setPendiente(true)
    try {
      const sesion = await login({ codigo, taquillaId })
      iniciarSesion(sesion)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
      setErrorCampo('codigo')
    } finally {
      setPendiente(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label
        htmlFor="codigo"
        className="mt-[52px] block text-[15px] font-semibold leading-[18px] text-[#0f172a]"
      >
        Código de usuario
      </label>
      <CampoCodigo
        id="codigo"
        className="mt-[9px]"
        autoComplete="username"
        inputMode="numeric"
        placeholder="Ingresa tu código de usuario"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
        error={errorCampo === 'codigo'}
      />

      <p className="mt-2 text-[12px] leading-[16px] text-[#8a94a7]">
        Código demo: <span className="font-semibold text-brand-600">1001</span>
      </p>

      <label
        htmlFor="taquilla"
        className="mt-[14px] block text-[15px] font-semibold leading-[18px] text-[#0f172a]"
      >
        Taquilla
      </label>
      <CampoTaquilla
        id="taquilla"
        className="mt-[9px]"
        value={taquillaId}
        onChange={setTaquillaId}
        error={errorCampo === 'taquilla'}
      />

      <div className="relative mt-[33px]">
        <BotonIngresar type="submit" pendiente={pendiente}>
          Ingresar
        </BotonIngresar>
        {error ? (
          <p
            role="alert"
            className="absolute left-0 top-full mt-2 text-[13px] font-medium text-red-500"
          >
            {error}
          </p>
        ) : null}
      </div>
    </form>
  )
}
