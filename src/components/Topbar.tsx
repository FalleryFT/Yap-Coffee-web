import { Bell, CalendarDays, Store, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { outlet, today } from '../data/dummy'

export function Topbar() {
  // Desain halaman Pre-Order memakai penanda "Sistem Online", halaman lain memakai lonceng + profil.
  const showOnlinePill = useLocation().pathname === '/pre-order'

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-cream/90 px-8 backdrop-blur">
      <div className="flex items-center gap-3 text-sm font-medium text-espresso">
        <span className="flex items-center gap-2">
          <CalendarDays size={16} strokeWidth={1.75} />
          {today}
        </span>
        <span className="size-1 rounded-full bg-mist" aria-hidden="true" />
        <span className="flex items-center gap-2">
          <Store size={16} strokeWidth={1.75} />
          {outlet.name}
        </span>
      </div>

      {showOnlinePill ? (
        <span className="flex items-center gap-2 rounded-full bg-[#e8ecd8] px-3 py-1 text-xs font-medium text-olive">
          <span className="size-2 rounded-full bg-olive" aria-hidden="true" />
          Sistem Online
        </span>
      ) : (
        <div className="flex items-center gap-4">
          <button className="relative text-bark hover:text-espresso" aria-label="Notifikasi">
            <Bell size={20} strokeWidth={1.75} />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-danger" />
          </button>
          <span className="h-6 w-px bg-line" aria-hidden="true" />
          <button
            className="flex size-9 items-center justify-center rounded-full bg-espresso text-white"
            aria-label="Profil"
          >
            <User size={18} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </header>
  )
}