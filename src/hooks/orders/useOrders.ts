import { useCallback, useEffect, useState } from 'react'
import { CACHE_KEYS } from '@/constants/cacheKeys'
import { ORDERS_PAGE_SIZE, tabs } from '@/constants/orders'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { TTL } from '@/lib/cache'
import { toApiError } from '@/lib/apiError'
import {
  cancelOrder as cancelOrderApi,
  getOrders,
  getOrderStats,
  updateOrderStatus,
  type CancelOrderPayload,
} from '@/services/orderService'
import type { Order, OrderStatus } from '@/types/orders'

export function useOrders() {
  const [actionError, setActionError] = useState<string | null>(null)

  // Tab dan dropdown status sama-sama menjadi satu filter `status` di API,
  // jadi memilih salah satunya mengembalikan yang lain ke "Semua".
  const [tab, setTabState] = useState('Semua')
  const [statusFilter, setStatusFilterState] = useState<OrderStatus | 'Semua'>('Semua')
  const [query, setQueryState] = useState('')
  const [page, setPage] = useState(1)

  const search = useDebouncedValue(query.trim())
  const status = statusFilter !== 'Semua' ? statusFilter : tabs.find((t) => t.label === tab)?.status

  const list = useCachedQuery(
    CACHE_KEYS.ordersList(`${status ?? ''}|${search}|${page}`),
    () => getOrders({ status, q: search || undefined, page, limit: ORDERS_PAGE_SIZE }),
    { ttl: TTL.short, keepPrevious: true },
  )
  // Kartu statistik hanya pelengkap; bila gagal, angka lama tetap tampil.
  const statsQuery = useCachedQuery(CACHE_KEYS.orderStats, getOrderStats, { ttl: TTL.short })

  const data = list.data ?? null
  const { reload: reloadList, mutate: mutateList } = list
  const { reload: reloadStats } = statsQuery

  // Data berkurang sehingga halaman ini sudah tidak ada: pindah ke halaman terakhir.
  useEffect(() => {
    if (data && data.page === page && data.page > data.totalPages) {
      setPage(Math.max(1, data.totalPages))
    }
  }, [data, page])

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
    reloadList()
    reloadStats()
  }, [reloadList, reloadStats])

  // Baris yang diubah diganti di tempat (tanpa memuat ulang daftar) supaya hasilnya langsung
  // terlihat; daftar mengikuti filter lagi pada pemuatan berikutnya.
  const replaceOrder = useCallback(
    (updated: Order) => {
      mutateList((d) => ({ ...d, items: d.items.map((o) => (o.id === updated.id ? updated : o)) }))
      reloadStats()
    },
    [mutateList, reloadStats],
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
    stats: statsQuery.data ?? null,
    loading: list.isLoading,
    loadError: list.error,
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