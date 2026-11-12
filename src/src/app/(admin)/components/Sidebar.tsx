'use client'

import { useRouter } from 'next/navigation'
import { tokenStorage } from '@/lib/tokenStorage'
import { useAdminProfile } from '@/hooks/admin/useAdminProfile'
import { useDrawerLock } from '@/hooks/admin/useDrawerLock'
import { SidebarBrand } from './sidebar/SidebarBrand'
import { SidebarFooter } from './sidebar/SidebarFooter'
import { SidebarNav } from './sidebar/SidebarNav'
import { SidebarProfile } from './sidebar/SidebarProfile'

interface SidebarProps {
  /** Hanya relevan di bawah breakpoint lg (lihat SidebarProps di AdminLayout). Di lg ke atas sidebar selalu tampil. */
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter()
  const profile = useAdminProfile()
  useDrawerLock(open, onClose)

  function logout() {
    tokenStorage.clear()
    router.replace('/login')
  }

  return (
    <>
      {/* Latar gelap di belakang drawer, hanya di layar sempit & saat terbuka */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        // role="dialog" HANYA saat benar-benar berfungsi sebagai overlay modal (drawer mobile
        // terbuka). Di layar lg ke atas (atau saat tertutup), ini cuma landmark navigasi biasa —
        // kalau role="dialog" dipasang permanen, elemen ini keliru ikut terhitung sebagai dialog
        // di mana pun, bentrok dengan modal lain yang sedang terbuka di halaman yang sama.
        role={open ? 'dialog' : undefined}
        aria-modal={open ? true : undefined}
        aria-label="Menu navigasi"
        className={[
          'fixed inset-y-0 left-0 z-40 flex h-dvh w-72 flex-col bg-sidebar shadow-2xl transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:sticky lg:top-0 lg:z-auto lg:w-64 lg:translate-x-0 lg:border-r lg:border-line lg:shadow-none',
        ].join(' ')}
      >
        <SidebarBrand onClose={onClose} />
        <SidebarProfile profile={profile} />
        <SidebarNav onClose={onClose} />
        <SidebarFooter onLogout={logout} />
      </aside>
    </>
  )
}
