import { useEffect, useState } from 'react'
import { getHistoryRevenue } from '@/services/historyService'
import type { RevenueData } from '@/types/history'

/** Data grafik untuk bulan terpilih ('YYYY-MM') atau semua tahun ('semua'). */
export function useRevenueData(selected: string) {
  const [data, setData] = useState<RevenueData | null>(null)

  useEffect(() => {
    let active = true
    getHistoryRevenue(selected)
      .then((result) => active && setData(result))
      .catch(() => active && setData(null))
    return () => {
      active = false
    }
  }, [selected])

  return data
}
