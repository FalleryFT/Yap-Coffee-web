import { formatNumber } from '@/lib/format'
import { MONTH_ABBR, MONTH_NAMES } from '@/constants/months'
import { REVENUE } from '@/data/revenue'
import { TICK_COUNT } from '@/constants/history'
import { revenueOf, sumOf, yearTotal } from '@/utils/revenue'
import type { Point } from '@/types/history'

// selected: 'YYYY-MM' atau 'semua'; currentMonth: bulan berjalan 'YYYY-MM'
export function useRevenueChart(selected: string, currentMonth: string) {
  const isAll = selected === 'semua'
  const [sy = 0, sm = 1] = selected.split('-').map(Number)
  const currentYear = Number(currentMonth.slice(0, 4))

  // ── Titik grafik ──
  let points: Point[]
  let headlineLabel: string
  let headlineValue: number | null
  let previousValue: number | null
  let trendLabel: string
  let footerLabel: string
  let footerValue: string

  if (isAll) {
    const years = Object.keys(REVENUE).map(Number).sort((a, b) => a - b)
    points = years.map((y) => ({
      key: String(y),
      short: String(y),
      tooltip: `Tahun ${y}`,
      revenue: yearTotal(y),
      highlight: y === currentYear,
    }))
    const totals = points.map((p) => p.revenue ?? 0)
    headlineLabel = 'Total Keseluruhan'
    headlineValue = sumOf(totals)
    previousValue = points.length > 1 ? (points[points.length - 2]?.revenue ?? null) : null
    trendLabel = 'tahun terakhir dibanding tahun lalu'
    footerLabel = 'Rata-rata per tahun'
    footerValue = `Rp ${formatNumber(Math.round(sumOf(totals) / Math.max(points.length, 1)))}`
  } else {
    points = MONTH_ABBR.map((short, i) => ({
      key: `${sy}-${i}`,
      short,
      tooltip: `${MONTH_NAMES[i]} ${sy}`,
      revenue: revenueOf(sy, i),
      highlight: i === sm - 1,
    }))
    headlineLabel = `Pendapatan ${MONTH_NAMES[sm - 1]} ${sy}`
    headlineValue = revenueOf(sy, sm - 1)
    previousValue = sm === 1 ? revenueOf(sy - 1, 11) : revenueOf(sy, sm - 2)
    trendLabel = 'dibanding bulan lalu'
    const total = yearTotal(sy)
    footerLabel = `Total Tahun ${sy}`
    footerValue = total === null ? '-' : `Rp ${formatNumber(total)}`
  }

  // Tren: untuk mode tahunan, bandingkan tahun terakhir yang ada datanya dengan tahun sebelumnya.
  let trend: number | null = null
  if (isAll) {
    const withData = points.filter((p) => p.revenue !== null)
    const last = withData[withData.length - 1]?.revenue ?? null
    const prev = withData[withData.length - 2]?.revenue ?? null
    if (last !== null && prev) trend = ((last - prev) / prev) * 100
  } else if (headlineValue !== null && previousValue) {
    trend = ((headlineValue - previousValue) / previousValue) * 100
  }
  const trendUp = (trend ?? 0) >= 0

  // ── Skala sumbu Y ──
  const filled = points.filter((p) => p.revenue !== null)
  const values = filled.map((p) => p.revenue ?? 0)
  const hasData = values.length > 0
  const max = hasData ? Math.max(...values) : 20_000_000
  const average = hasData ? sumOf(values) / values.length : 0
  const unit = Math.ceil((max * 1.1) / TICK_COUNT / 5_000_000) * 5_000_000
  const niceMax = unit * TICK_COUNT
  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => i * unit)
  const pctOf = (v: number) => (v / niceMax) * 100

  return {
    isAll, sy, points, headlineLabel, headlineValue, trendLabel, footerLabel, footerValue,
    trend, trendUp, hasData, average, ticks, pctOf,
  }
}

export type RevenueChart = ReturnType<typeof useRevenueChart>
