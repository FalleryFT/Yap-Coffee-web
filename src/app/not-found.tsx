'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Padanan <Route path="*" element={<Navigate to="/dashboard" replace />} /> di App.tsx lama:
// path mana pun yang tidak cocok dengan rute manapun diarahkan ke /dashboard.
// Guard auth di app/(admin)/layout.tsx yang lalu memutuskan apakah pengguna
// sungguh berhak masuk, atau dilempar lagi ke /login.
export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard')
  }, [router])

  return null
}
