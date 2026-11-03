import { useCallback, useEffect, useState } from 'react'
import { ORDERS_PAGE_SIZE, tabs } from '@/constants/orders'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { toApiError } from '@/lib/apiError'
import {
  cancelOrder as cancelOrderApi,
  getOrders,
  getOrderStats,
  updateOrderStatus,
  type CancelOrderPayload,
} from '@/services/orderService'
import type { Order, OrderPage, OrderStatsData, OrderStatus } from '@/types/orders'

export function useOrders() {
  const [data, setData] = useState<OrderPage | null>(null)
  const [stats, setStats] = useState<OrderStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  // Tab dan dropdown status sama-sama menjadi satu filter `status` di API,
  // jadi memilih salah satunya mengembalikan yang lain ke "Semua".
  const [tab, setTabState] = useState('Semua')
  const [statusFilter, setStatusFilterState] = useState<OrderStatus | 'Semua'>('Semua')
  const [query, setQueryState] = useState('')
  const [page, setPage] = useState(1)

  const search = useDebouncedValue(query.trim())
  const status = statusFilter !== 'Semua' ? statusFilter : tabs.find((t) => t.label === tab)?.status

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(null)
    getOrders({ status, q: search || undefined, page, limit: ORDERS_PAGE_SIZE })
      .then((result) => {
        if (!active) return
        // Data berkurang sehingga halaman ini sudah tidak ada: pindah ke halaman terakhir.
        if (result.page > result.totalPages) setPage(result.totalPages)
        else setData(result)
      })
      .catch((err) => active && setLoadError(toApiError(err).message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [status, search, page, reloadKey])

  const refreshStats = useCallback(() => {
    // Kartu statistik hanya pelengkap; bila gagal, angka lama tetap tampil.
    getOrderStats().then(setStats).catch(() => {})
  }, [])

  useEffect(() => {
    refreshStats()
  }, [refreshStats, reloadKey])

  const setTab = useCallback((next: string) => {
    setTabState(next)
    setStatusFilterState('Semua')
    setPage(1)
  }, [])

  const setStatusFilter = useCallback((next: OrderStatus | 'Semua') => {
    setStatusFilterState(next)
    setTabState('Semua')
    setPage(1)
  }, [])

  const setQuery = useCallback((next: string) => {
    setQueryState(next)
    setPage(1)
  }, [])

  const reload = useCallback(() => {
    setActionError(null)
    setReloadKey((k) => k + 1)
  }, [])

  // Baris yang diubah diganti di tempat (tanpa memuat ulang daftar) supaya hasilnya langsung
  // terlihat; daftar mengikuti filter lagi pada pemuatan berikutnya.
  const replaceOrder = useCallback(
    (updated: Order) => {
      setData((d) => d && { ...d, items: d.items.map((o) => (o.id === updated.id ? updated : o)) })
      refreshStats()
    },
    [refreshStats],
  )

  const setStatus = useCallback(
    async (id: string, next: OrderStatus) => {
      setActionError(null)
      try {
        replaceOrder(await updateOrderStatus(id, next))
      } catch (err) {
        setActionError(toApiError(err).message)
      }
    },
    [replaceOrder],
  )

  // Galat sengaja dilempar ulang (sebagai ApiError) agar modal konfirmasi bisa menampilkannya.
  const completeOrder = useCallback(
    async (id: string) => {
      try {
        replaceOrder(await updateOrderStatus(id, 'Selesai'))
      } catch (err) {
        throw toApiError(err)
      }
    },
    [replaceOrder],
  )

  // Sama: dilempar ulang untuk modal batal.
  const cancelOrder = useCallback(
    async (id: string, payload: CancelOrderPayload) => {
      try {
        replaceOrder(await cancelOrderApi(id, payload))
      } catch (err) {
        throw toApiError(err)
      }
    },
    [replaceOrder],
  )

  return {
    shown: data?.items ?? [],
    page,
    totalPages: data?.totalPages ?? 1,
    total: data?.total ?? 0,
    stats,
    loading,
    loadError,
    actionError,
    dismissActionError: () => setActionError(null),
    tab, setTab,
    query, setQuery,
    statusFilter, setStatusFilter,
    setPage,
    setStatus,
    completeOrder,
    cancelOrder,
    reload,
  }
}
