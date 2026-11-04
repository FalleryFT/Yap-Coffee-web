import { useCallback, useEffect, useState } from 'react'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { toApiError } from '@/lib/apiError'
import { getDashboard } from '@/services/dashboardService'
import { updateOrderStatus } from '@/services/orderService'
import type { DashboardData } from '@/types/dashboard'
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
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  // Waktu terima di sisi klien (bukan jam server) supaya label tidak terpengaruh selisih jam.
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const search = useDebouncedValue(query.trim())

  // `loading` hanya true pada pemuatan pertama; muat ulang berikutnya diam-diam
  // (data lama tetap tampil) supaya halaman tidak berkedip setiap 30 detik.
  useEffect(() => {
    let active = true
    getDashboard({ q: search || undefined })
      .then((result) => {
        if (!active) return
        setData(result)
        setError(null)
        setLastSyncedAt(Date.now())
      })
      .catch((err) => active && setError(toApiError(err).message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [search, reloadKey])

  useEffect(() => {
    const refresh = setInterval(() => {
      if (document.visibilityState === 'visible') setReloadKey((k) => k + 1)
    }, REFRESH_MS)
    const tick = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => {
      clearInterval(refresh)
      clearInterval(tick)
    }
  }, [])

  const resync = useCallback(() => {
    setActionError(null)
    setReloadKey((k) => k + 1)
  }, [])

  // Setelah status berubah, seluruh dashboard dimuat ulang karena banner dan ringkasan ikut berubah.
  const setStatus = useCallback(async (id: string, next: OrderStatus) => {
    setActionError(null)
    try {
      await updateOrderStatus(id, next)
      setReloadKey((k) => k + 1)
    } catch (err) {
      setActionError(toApiError(err).message)
    }
  }, [])

  return {
    data,
    loading,
    error,
    actionError,
    dismissActionError: () => setActionError(null),
    query,
    setQuery,
    syncLabel: syncText(lastSyncedAt, now, error !== null),
    resync,
    setStatus,
  }
}
