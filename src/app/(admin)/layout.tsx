'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { tokenStorage } from '@/lib/tokenStorage'

// Pengganti <RequireAuth><AdminLayout/></RequireAuth> dari App.tsx versi React Router:
// grup rute (admin) ini membungkus /dashboard, /pre-order, /menu, /orders, /history.
//
// Token hanya ada di localStorage (browser), jadi pengecekan dilakukan di useEffect
// (bukan langsung saat render) supaya render pertama di server dan di klien sama persis
// sebelum hidrasi — baru sesudah itu redirect ke /login dijalankan bila tidak ada token.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  // Di bawah breakpoint lg, Sidebar dirender sebagai drawer yang bisa dibuka/tutup lewat
  // tombol hamburger di Topbar. Di lg ke atas, Sidebar mengabaikan state ini dan selalu tampil.
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Tutup drawer otomatis setiap kali berpindah halaman (mis. lewat tombol Back browser;
  // klik langsung pada link navigasi sudah menutupnya sendiri lewat onClick di Sidebar).
  // Pola resmi React untuk "menyesuaikan state saat sebuah prop berubah": setState kondisional
  // langsung di body komponen, BUKAN di useEffect — dijalankan sebelum commit ke DOM, jadi
  // tidak ada kedipan tambahan seperti https://react.dev/learn/you-might-not-need-an-effect
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setMobileNavOpen(false)
  }

  useEffect(() => {
    // Sengaja: effect ini SEDANG mensinkronkan dengan sistem eksternal (localStorage),
    // jadi setState di sini bukan anti-pattern meski linter menandainya.
    if (!tokenStorage.get()) {
      router.replace('/login')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return null

  return (
    <div className="flex min-h-dvh">
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
