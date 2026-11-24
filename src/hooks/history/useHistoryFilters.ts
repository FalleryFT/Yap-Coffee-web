import { useEffect, useState } from 'react'
import { CACHE_KEYS } from '@/constants/cacheKeys'
import { CURRENT_MONTH, PAGE_SIZE, statusOptions } from '@/constants/history'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { getHistory } from '@/services/historyService'
import type { StatusFilter } from '@/types/history'

export function useHistoryFilters() {
  const [q, setQ] = useState('')
  const [month, setMonth] = useState(CURRENT_MONTH) // 'YYYY-MM' | 'semua'
  const [status, setStatus] = useState<StatusFilter>('selesai')
  const [page, setPage] = useState(1)

  const search = useDebouncedValue(q.trim())

  const list = useCachedQuery(
    CACHE_KEYS.historyList(`${status}|${month}|${search}|${page}`),
    () => getHistory({ status, month, q: search || undefined, page, limit: PAGE_SIZE }),
    { keepPrevious: true },
  )
  const data = list.data ?? null
  const { reload } = list

  // Halaman ini sudah tidak ada (data berkurang): pindah ke halaman terakhir.
  useEffect(() => {
    if (data && data.page === page && data.page > data.totalPages) {
      setPage(Math.max(1, data.totalPages))
    }
  }, [data, page])

  const pageRows = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE

  const hasFilter = month !== 'semua' || status !== 'semua'
  const statusLabel = statusOptions.find((o) => o.value === status)?.label ?? ''

  const changeQuery = (v: string) => {
    setQ(v)
    setPage(1)
  }
  const changeMonth = (v: string) => {
    setMonth(v)
    setPage(1)
  }
  const changeStatus = (v: string) => {
    setStatus(v as StatusFilter)
    setPage(1)
  }
  const clearFilters = () => {
    setMonth('semua')
    setStatus('semua')
    setPage(1)
  }
  const resetToDefault = () => {
    setQ('')
    setMonth(CURRENT_MONTH)
    setStatus('selesai')
    setPage(1)
    reload() // tombol "Muat ulang" juga mengambil data terbaru
  }

  return {
    q, month, status, pageRows, total, start, totalPages, currentPage, hasFilter, statusLabel,
    loading: list.isLoading, loadError: list.error, reload,
    setPage, changeQuery, changeMonth, changeStatus, clearFilters, resetToDefault,
  }
}