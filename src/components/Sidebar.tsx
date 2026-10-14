'use client'

import { Clock, History, LayoutDashboard, LogOut, Receipt, Utensils } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { adminJobTitle, outlet, pendingOrderCount } from '../data/dummy'
import { tokenStorage } from '../lib/tokenStorage'
import { getAdminProfile } from '../services/authService'
import type { AdminUser } from '../types/auth'
import { CupIcon } from './CupIcon'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pre-Order', href: '/pre-order', icon: Clock },
  { label: 'Menu', href: '/menu', icon: Utensils },
  { label: 'Orders', href: '/orders', icon: Receipt, badge: pendingOrderCount },
  { label: 'History', href: '/history', icon: History },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<AdminUser | null>(null)

  useEffect(() => {
    let active = true
    getAdminProfile()
      .then((user) => active && setProfile(user))
      .catch(() => {}) // gagal memuat: sidebar tetap tampil dengan placeholder
    return () => {
      active = false
    }
  }, [])

  function logout() {
    tokenStorage.clear()
    router.replace('/login')
  }

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <span className="flex size-10 items-center justify-center rounded-full border-2 border-espresso text-espresso">
          <CupIcon size={20} />
        </span>
        <div className="leading-tight">
          <p className="text-xl font-bold text-espresso">Yap Coffee</p>
          <p className="text-[11px] tracking-wide text-mocha">KOPI TETANGGA</p>
        </div>
      </div>

      {/* Profil admin */}
      <div className="mx-4 mb-4 flex items-center gap-3 border-b border-line px-2 pb-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-espresso text-sm font-semibold text-white">
          {profile ? profile.name.charAt(0).toUpperCase() : ''}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-espresso">
            {profile ? profile.name : 'Memuat...'}
          </p>
          <p className="truncate text-xs text-mocha">{adminJobTitle}</p>
        </div>
      </div>

      {/* Menu navigasi */}
      <nav className="flex flex-1 flex-col gap-1 px-4" aria-label="Menu utama">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium transition-colors',
                isActive ? 'bg-espresso text-white' : 'text-bark hover:bg-espresso/5',
              ].join(' ')}
            >
              <Icon size={18} strokeWidth={1.75} />
              <span className="flex-1">{label}</span>
              {badge ? (
                <span
                  className={[
                    'flex size-6 items-center justify-center rounded-full text-xs font-semibold',
                    isActive ? 'bg-white/20 text-white' : 'bg-mocha text-white',
                  ].join(' ')}
                >
                  {badge}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      {/* Status outlet + keluar */}
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
          onClick={logout}
          className="flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium text-bark hover:bg-espresso/5"
        >
          <LogOut size={18} strokeWidth={1.75} />
          Keluar
        </button>
      </div>
    </aside>
  )
}
