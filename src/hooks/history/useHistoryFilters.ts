import { useMemo, useState } from 'react'
import { CURRENT_MONTH, PAGE_SIZE, statusOptions } from '@/constants/history'
import { rows } from '@/data/history'
import type { StatusFilter } from '@/types/history'

export function useHistoryFilters() {
  const [q, setQ] = useState('')
  const [month, setMonth] = useState(CURRENT_MONTH) // 'YYYY-MM' | 'semua'
  const [status, setStatus] = useState<StatusFilter>('selesai')
  const [page, setPage] = useState(1)

  const shown = useMemo(() => {
    const keyword = q.toLowerCase()
    return rows.filter(
      (r) =>
        (month === 'semua' || r.date.startsWith(month)) &&
        (status === 'semua' || r.status === status) &&
        (r.id + r.name + r.item).toLowerCase().includes(keyword),
    )
  }, [q, month, status])

  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = shown.slice(start, start + PAGE_SIZE)

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
  }

  return {
    q, month, status, shown, pageRows, start, totalPages, currentPage, hasFilter, statusLabel,
    setPage, changeQuery, changeMonth, changeStatus, clearFilters, resetToDefault,
  }
}
