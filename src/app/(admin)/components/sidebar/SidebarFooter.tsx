import { LogOut } from 'lucide-react'
import { outlet } from '@/data/dummy'

export function SidebarFooter({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between rounded-lg bg-espresso/5 px-3 py-2 text-xs text-bark">
        <span className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${outlet.isOpen ? 'bg-olive' : 'bg-danger'}`}
            aria-hidden="true"
          />
          {outlet.isOpen ? 'Outlet Terbuka' : 'Outlet Tutup'}
        </span>
        <span className="text-mist">{outlet.hours}</span>
      </div>
      <button
        onClick={onLogout}
        className="flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium text-bark hover:bg-espresso/5"
      >
        <LogOut size={18} strokeWidth={1.75} />
        Keluar
      </button>
    </div>
  )
}
