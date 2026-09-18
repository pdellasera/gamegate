import { ShieldCheck } from 'lucide-react'

export function SelloSeguridad() {
  return (
    <div className="flex items-center gap-[18px] rounded-[14px] bg-[#f5f9fe] px-7 py-6">
      <ShieldCheck size={32} strokeWidth={1.7} className="shrink-0 text-[#0a46c9]" />
      <div className="leading-tight">
        <p className="text-[15px] font-semibold text-[#123a7a]">Sistema seguro y confiable</p>
        <p className="mt-1 text-[13px] text-[#64748b]">Tu información está protegida</p>
      </div>
    </div>
  )
}
