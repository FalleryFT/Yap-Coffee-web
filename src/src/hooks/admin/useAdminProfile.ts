import { useEffect, useState } from 'react'
import { onSettingsChanged } from '@/lib/appEvents'
import { getAdminProfile } from '@/services/authService'
import type { AdminUser } from '@/types/auth'

export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminUser | null>(null)

  useEffect(() => {
    let active = true
    const load = () =>
      getAdminProfile()
        .then((user) => active && setProfile(user))
        .catch(() => {}) // gagal memuat: sidebar tetap tampil dengan placeholder
    load()
    // Nama admin diganti di halaman Pengaturan: muat ulang agar sidebar langsung ikut berubah.
    const stopListening = onSettingsChanged(load)
    return () => {
      active = false
      stopListening()
    }
  }, [])

  return profile
}
