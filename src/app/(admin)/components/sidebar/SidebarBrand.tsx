import { X } from 'lucide-react'
import { CupIcon } from '@/app/components/CupIcon'

export function SidebarBrand({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 px-6 pt-6 pb-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-espresso text-espresso">
        <CupIcon size={20} />
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-xl font-bold text-espresso">Yap Coffee</p>
        <p className="text-[11px] tracking-wide text-mocha">KOPI TETANGGA</p>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 text-bark hover:bg-espresso/5 lg:hidden"
        aria-label="Tutup menu navigasi"
      >
        <X size={20} strokeWidth={1.75} />
      </button>
    </div>
  )
}
