import { CACHE_KEYS } from '@/constants/cacheKeys'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { TTL } from '@/lib/cache'
import { getAdminProfile } from '@/services/authService'
import type { AdminUser } from '@/types/auth'

/**
 * Profil admin untuk sidebar dan topbar. Berbagi cache dengan halaman Profile,
 * jadi nama yang diganti di sana langsung ikut berubah di sini.
 */
export function useAdminProfile(): AdminUser | null {
  // Gagal memuat: sidebar tetap tampil dengan placeholder.
  const { data } = useCachedQuery(CACHE_KEYS.adminProfile, getAdminProfile, { ttl: TTL.long })
  return data ?? null
}