import { LogOut } from 'lucide-react'

export function SidebarFooter({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex flex-col gap-2 p-4">
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