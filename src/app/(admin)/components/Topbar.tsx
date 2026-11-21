'use client'

import { CalendarDays, Menu, Store } from 'lucide-react'
import { today } from '@/data/dummy'
import { useAdminProfile } from '@/hooks/admin/useAdminProfile'
import { useOutletName } from '@/hooks/settings/useOutletName'
import { TopbarProfileMenu } from './TopbarProfileMenu'

interface TopbarProps {
  onMenuClick: () => void
}

// Topbar sama di semua halaman admin (tanpa variasi per halaman).
export function Topbar({ onMenuClick }: TopbarProps) {
  const outletName = useOutletName()
  const profile = useAdminProfile()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-cream/90 px-4 backdrop-blur sm:px-6 lg:px-8">
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
            {outletName || 'Outlet'}
          </span>
        </span>
      </div>

      <TopbarProfileMenu profile={profile} />
    </header>
  )
}