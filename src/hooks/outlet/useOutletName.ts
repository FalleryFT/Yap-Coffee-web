import { CACHE_KEYS } from '@/constants/cacheKeys'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { TTL } from '@/lib/cache'
import { getStoreSettings } from '@/services/outletService'

/**
 * Nama outlet untuk Topbar (diatur di halaman Outlet & Kontak Penjual); kosong selama belum termuat.
 * Berbagi cache dengan halaman Outlet, jadi perubahan di sana langsung tampil di sini.
 */
export function useOutletName(): string {
  // Gagal memuat: Topbar tetap tampil dengan tulisan "Outlet".
  const { data } = useCachedQuery(CACHE_KEYS.storeSettings, getStoreSettings, { ttl: TTL.long })
  return data?.outletName ?? ''
}