import { useEffect, useState } from 'react'
import { getHistoryStats } from '@/services/historyService'
import type { HistoryStatsData } from '@/types/history'

/** Kartu ringkasan hanya pelengkap: bila gagal, angka lama tetap tampil. */
export function useHistoryStats(month: string) {
  const [stats, setStats] = useState<HistoryStatsData | null>(null)

  useEffect(() => {
    let active = true
    getHistoryStats(month)
      .then((result) => active && setStats(result))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [month])

  return stats
}
