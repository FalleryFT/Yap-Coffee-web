import { CACHE_KEYS } from '@/constants/cacheKeys'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { getHistoryStats } from '@/services/historyService'
import type { HistoryStatsData } from '@/types/history'

/** Kartu ringkasan hanya pelengkap: bila gagal, angka lama tetap tampil. */
export function useHistoryStats(month: string): HistoryStatsData | null {
  const { data } = useCachedQuery(CACHE_KEYS.historyStats(month), () => getHistoryStats(month), {
    keepPrevious: true,
  })
  return data ?? null
}