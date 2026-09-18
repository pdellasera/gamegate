import { useQuery } from '@tanstack/react-query'
import { getEstadio, getEventosEstadio } from '../services/estadioService'
import type { CategoriaEvento } from '../types'

export function useEstadio() {
  return useQuery({ queryKey: ['estadio'], queryFn: getEstadio })
}

export function useEventosEstadio(categoria: CategoriaEvento | 'Todos') {
  return useQuery({
    queryKey: ['eventos-estadio', categoria],
    queryFn: () => getEventosEstadio(categoria),
  })
}
