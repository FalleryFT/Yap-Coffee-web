import { useCallback, useEffect, useState } from 'react'
import { CURRENT_MONTH, PAGE_SIZE, statusOptions } from '@/constants/history'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { toApiError } from '@/lib/apiError'
import { getHistory } from '@/services/historyService'
import type { HistoryPage, StatusFilter } from '@/types/history'

export function useHistoryFilters() {
  const [q, setQ] = useState('')
  const [month, setMonth] = useState(CURRENT_MONTH) // 'YYYY-MM' | 'semua'
  const [status, setStatus] = useState<StatusFilter>('selesai')
  const [page, setPage] = useState(1)

  const [data, setData] = useState<HistoryPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const search = useDebouncedValue(q.trim())

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(null)
    getHistory({ status, month, q: search || undefined, page, limit: PAGE_SIZE })
      .then((result) => {
        if (!active) return
        // Halaman ini sudah tidak ada (data berkurang): pindah ke halaman terakhir.
        if (result.page > result.totalPages) setPage(result.totalPages)
        else setData(result)
      })
      .catch((err) => active && setLoadError(toApiError(err).message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [status, month, search, page, reloadKey])

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
    setReloadKey((k) => k + 1) // tombol "Muat ulang" juga mengambil data terbaru
  }
  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  return {
    q, month, status, pageRows, total, start, totalPages, currentPage, hasFilter, statusLabel,
    loading, loadError, reload,
    setPage, changeQuery, changeMonth, changeStatus, clearFilters, resetToDefault,
  }
}
