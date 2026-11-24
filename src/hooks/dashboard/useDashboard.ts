import { useCallback, useEffect, useState } from 'react'
import { CACHE_KEYS } from '@/constants/cacheKeys'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { TTL } from '@/lib/cache'
import { toApiError } from '@/lib/apiError'
import { getDashboard } from '@/services/dashboardService'
import { updateOrderStatus } from '@/services/orderService'
import type { OrderStatus } from '@/types/orders'

/** Dashboard memuat ulang sendiri tiap 30 detik selama tab terlihat. */
const REFRESH_MS = 30_000
/** Label "Update ... lalu" dihitung ulang tiap beberapa detik. */
const TICK_MS = 5_000

function syncText(lastSyncedAt: number | null, now: number, failed: boolean): string {
  if (lastSyncedAt === null) return failed ? 'Gagal menyinkronkan' : 'Menyinkronkan...'
  const seconds = Math.max(0, Math.floor((now - lastSyncedAt) / 1000))
  if (seconds < 5) return 'Update baru saja'
  if (seconds < 60) return `Update ${seconds} dtk lalu`
  return `Update ${Math.floor(seconds / 60)} mnt lalu`
}

export function useDashboard() {
  const [actionError, setActionError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [now, setNow] = useState(() => Date.now())

  const search = useDebouncedValue(query.trim())

  // Data lama tetap tampil saat memuat ulang (dari cache) supaya halaman tidak berkedip.
  const dashboard = useCachedQuery(
    CACHE_KEYS.dashboard(search),
    () => getDashboard({ q: search || undefined }),
    { ttl: TTL.short, keepPrevious: true },
  )
  const { reload } = dashboard

  useEffect(() => {
    const refresh = setInterval(() => {
      if (document.visibilityState === 'visible') reload()
    }, REFRESH_MS)
    const tick = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => {
      clearInterval(refresh)
      clearInterval(tick)
    }
  }, [reload])

  const resync = useCallback(() => {
    setActionError(null)
    reload()
  }, [reload])

  // Setelah status berubah, seluruh dashboard dimuat ulang karena banner dan ringkasan ikut berubah.
  const setStatus = useCallback(
    async (id: string, next: OrderStatus) => {
      setActionError(null)
      try {
        await updateOrderStatus(id, next)
        reload()
      } catch (err) {
        setActionError(toApiError(err).message)
      }
    },
    [reload],
  )

  return {
    data: dashboard.data ?? null,
    loading: dashboard.data === undefined && dashboard.isLoading,
    error: dashboard.error,
    actionError,
    dismissActionError: () => setActionError(null),
    query,
    setQuery,
    syncLabel: syncText(dashboard.updatedAt, now, dashboard.error !== null),
    resync,
    setStatus,
  }
}