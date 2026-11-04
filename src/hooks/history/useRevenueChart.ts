import { formatNumber } from '@/lib/format'
import { MONTH_ABBR, MONTH_NAMES } from '@/constants/months'
import { TICK_COUNT } from '@/constants/history'
import { sumOf } from '@/utils/revenue'
import type { Point, RevenueData } from '@/types/history'

// selected: 'YYYY-MM' atau 'semua'; currentMonth: bulan berjalan 'YYYY-MM';
// data: respons GET /admin/history/revenue (null selagi memuat atau bila gagal).
export function useRevenueChart(selected: string, currentMonth: string, data: RevenueData | null) {
  const isAll = selected === 'semua'
  const [sy = 0, sm = 1] = selected.split('-').map(Number)
  const currentYear = Number(currentMonth.slice(0, 4))

  // Abaikan data yang bukan untuk pilihan saat ini (respons lama yang belum terganti).
  const monthly = !isAll && data?.mode === 'monthly' && data.year === sy ? data : null
  const yearly = isAll && data?.mode === 'yearly' ? data : null
  const monthRevenue = (i: number) => monthly?.points[i]?.revenue ?? null

  // ── Titik grafik ──
  let points: Point[]
  let headlineLabel: string
  let headlineValue: number | null
  let previousValue: number | null
  let trendLabel: string
  let footerLabel: string
  let footerValue: string

  if (isAll) {
    points = (yearly?.points ?? []).map((p) => ({
      key: p.key,
      short: p.key,
      tooltip: `Tahun ${p.year}`,
      revenue: p.revenue,
      highlight: p.year === currentYear,
    }))
    const totals = points.map((p) => p.revenue ?? 0)
    headlineLabel = 'Total Keseluruhan'
    headlineValue = points.length > 0 ? sumOf(totals) : null
    previousValue = points.length > 1 ? (points[points.length - 2]?.revenue ?? null) : null
    trendLabel = 'tahun terakhir dibanding tahun lalu'
    footerLabel = 'Rata-rata per tahun'
    footerValue =
      points.length > 0 ? `Rp ${formatNumber(Math.round(sumOf(totals) / points.length))}` : '-'
  } else {
    points = MONTH_ABBR.map((short, i) => ({
      key: `${sy}-${i}`,
      short,
      tooltip: `${MONTH_NAMES[i]} ${sy}`,
      revenue: monthRevenue(i),
      highlight: i === sm - 1,
    }))
    headlineLabel = `Pendapatan ${MONTH_NAMES[sm - 1]} ${sy}`
    headlineValue = monthRevenue(sm - 1)
    previousValue = sm === 1 ? (monthly?.previousDecember ?? null) : monthRevenue(sm - 2)
    trendLabel = 'dibanding bulan lalu'
    const values = points.map((p) => p.revenue)
    const total = values.every((v) => v === null) ? null : sumOf(values)
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
