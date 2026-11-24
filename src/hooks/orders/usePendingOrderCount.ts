import { useEffect } from 'react'
import { CACHE_KEYS } from '@/constants/cacheKeys'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { TTL } from '@/lib/cache'
import { getOrderStats, ORDERS_CHANGED_EVENT } from '@/services/orderService'

const REFRESH_MS = 30_000

/**
 * Jumlah pesanan "Baru Masuk" dari server, untuk badge menu Orders di sidebar.
 * Disegarkan tiap 30 detik (saat tab terlihat), saat jendela kembali difokuskan,
 * dan seketika setelah status pesanan diubah. null = belum dimuat atau gagal dimuat.
 * Memakai cache yang sama dengan kartu statistik halaman Orders, jadi hanya satu permintaan.
 */
export function usePendingOrderCount(): number | null {
  // Badge hanya pelengkap; bila gagal, angka terakhir tetap tampil.
  const { data, reload } = useCachedQuery(CACHE_KEYS.orderStats, getOrderStats, { ttl: TTL.short })

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') reload()
    }, REFRESH_MS)
    window.addEventListener('focus', reload)
    window.addEventListener(ORDERS_CHANGED_EVENT, reload)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', reload)
      window.removeEventListener(ORDERS_CHANGED_EVENT, reload)
    }
  }, [reload])

  return data?.active.baruMasuk ?? null
}