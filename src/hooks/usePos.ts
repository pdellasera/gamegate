import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  confirmarVenta,
  getAccesos,
  getEvento,
  getResumen,
  getSector,
  getZonas,
  imprimirSinCobrar,
} from '../services/posService'

export function useEvento() {
  return useQuery({ queryKey: ['evento'], queryFn: getEvento })
}

export function useZonas() {
  return useQuery({ queryKey: ['zonas'], queryFn: getZonas })
}

export function useSector(id: string) {
  return useQuery({ queryKey: ['sector', id], queryFn: () => getSector(id), enabled: Boolean(id) })
}

export function useResumen() {
  return useQuery({ queryKey: ['resumen'], queryFn: getResumen })
}

export function useAccesos() {
  return useQuery({ queryKey: ['accesos'], queryFn: getAccesos })
}

export function useConfirmarVenta() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: confirmarVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumen'] })
      queryClient.invalidateQueries({ queryKey: ['accesos'] })
    },
  })
}

export function useImprimir() {
  return useMutation({ mutationFn: imprimirSinCobrar })
}
