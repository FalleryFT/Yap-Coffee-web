import { useEffect, useState } from 'react'
import { getOrderStats, ORDERS_CHANGED_EVENT } from '@/services/orderService'

const REFRESH_MS = 30_000

/**
 * Jumlah pesanan "Baru Masuk" dari server, untuk badge menu Orders di sidebar.
 * Disegarkan tiap 30 detik (saat tab terlihat), saat jendela kembali difokuskan,
 * dan seketika setelah status pesanan diubah. null = belum dimuat atau gagal dimuat.
 */
export function usePendingOrderCount(): number | null {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    function refresh() {
      // Badge hanya pelengkap; bila gagal, angka terakhir tetap tampil.
      getOrderStats()
        .then((stats) => active && setCount(stats.active.baruMasuk))
        .catch(() => {})
    }

    refresh()
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh()
    }, REFRESH_MS)
    window.addEventListener('focus', refresh)
    window.addEventListener(ORDERS_CHANGED_EVENT, refresh)

    return () => {
      active = false
      window.clearInterval(timer)
      window.removeEventListener('focus', refresh)
      window.removeEventListener(ORDERS_CHANGED_EVENT, refresh)
    }
  }, [])

  return count
}
