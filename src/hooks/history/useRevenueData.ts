import { CACHE_KEYS } from '@/constants/cacheKeys'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { getHistoryRevenue } from '@/services/historyService'
import type { RevenueData } from '@/types/history'

/** Data grafik untuk bulan terpilih ('YYYY-MM') atau semua tahun ('semua'). */
export function useRevenueData(selected: string): RevenueData | null {
  const { data } = useCachedQuery(CACHE_KEYS.historyRevenue(selected), () => getHistoryRevenue(selected), {
    keepPrevious: true,
  })
  return data ?? null
}