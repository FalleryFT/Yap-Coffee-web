'use client'

import { Bell, CalendarDays, Menu, Store, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { outlet, today } from '../data/dummy'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  // Desain halaman Pre-Order memakai penanda "Sistem Online", halaman lain memakai lonceng + profil.
  const showOnlinePill = usePathname() === '/pre-order'

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-line bg-cream/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-espresso sm:gap-3">
        <button
          onClick={onMenuClick}
          className="-ml-1.5 shrink-0 rounded-lg p-2 text-bark hover:bg-espresso/5 lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>

        <span className="flex shrink-0 items-center gap-2">
          <CalendarDays size={16} strokeWidth={1.75} />
          {today}
        </span>

        {/* Nama outlet disembunyikan di layar paling sempit supaya tidak berdesakan dengan ikon kanan. */}
        <span className="hidden shrink-0 items-center gap-3 sm:flex">
          <span className="size-1 rounded-full bg-mist" aria-hidden="true" />
          <span className="flex items-center gap-2">
            <Store size={16} strokeWidth={1.75} />
            {outlet.name}
          </span>
        </span>
      </div>

      {showOnlinePill ? (
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-[#e8ecd8] px-3 py-1 text-xs font-medium text-olive">
          <span className="size-2 rounded-full bg-olive" aria-hidden="true" />
          <span className="hidden sm:inline">Sistem Online</span>
        </span>
      ) : (
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <button className="relative text-bark hover:text-espresso" aria-label="Notifikasi">
            <Bell size={20} strokeWidth={1.75} />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-danger" />
          </button>
          <span className="hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
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
