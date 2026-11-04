import type { WeeklyRevenuePoint } from '@/types/admin'

export const TICK_COUNT = 4

export function compact(value: number): string {
  if (value === 0) return '0'
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} jt`
  }
  return `${Math.round(value / 1000)} rb`
}

/** Menghitung total, rata-rata, dan skala sumbu Y dari titik pendapatan yang datang dari API. */
export function useWeeklyRevenue(data: WeeklyRevenuePoint[]) {
  const filled = data.filter((d) => d.revenue !== null)
  const total = filled.reduce((sum, d) => sum + (d.revenue ?? 0), 0)
  const average = filled.length ? Math.round(total / filled.length) : 0

  const max = Math.max(...filled.map((d) => d.revenue ?? 0), 1)
  const unit = Math.ceil(max / TICK_COUNT / 100_000) * 100_000
  const niceMax = unit * TICK_COUNT
  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => i * unit)

  return { data, total, average, niceMax, ticks }
}

export type WeeklyRevenue = ReturnType<typeof useWeeklyRevenue>
