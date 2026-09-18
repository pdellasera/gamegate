import { BadgeCheck, Printer } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'

interface AccionesVentaProps {
  onConfirmar: () => void
  onImprimir: () => void
  confirmando: boolean
  imprimiendo: boolean
  deshabilitado: boolean
}

export function AccionesVenta({
  onConfirmar,
  onImprimir,
  confirmando,
  imprimiendo,
  deshabilitado,
}: AccionesVentaProps) {
  const [enviarCopia, setEnviarCopia] = useState(false)

  return (
    <div className="space-y-2.5 pt-1">
      <Button className="w-full" disabled={deshabilitado || confirmando} onClick={onConfirmar} kbd="F12">
        <BadgeCheck size={16} />
        {confirmando ? 'Confirmando...' : 'Confirmar venta'}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        disabled={deshabilitado || imprimiendo}
        onClick={onImprimir}
        kbd="F9"
      >
        <Printer size={16} />
        {imprimiendo ? 'Imprimiendo...' : 'Imprimir sin cobrar'}
      </Button>
      <Checkbox
        checked={enviarCopia}
        onChange={setEnviarCopia}
        label="Enviar copia al correo del cliente"
        className="pt-1"
      />
    </div>
  )
}
