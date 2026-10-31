import { useEffect, useState } from 'react'
import { getAdminProfile } from '@/services/authService'
import type { AdminUser } from '@/types/auth'

export function useAdminProfile() {
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

  return profile
}
