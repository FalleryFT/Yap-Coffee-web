'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const [ready, setReady] = useState(false)

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
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
