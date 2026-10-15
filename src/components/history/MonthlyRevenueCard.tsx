import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatNumber } from '../../lib/format'
import { MONTH_NAMES } from './MonthYearPicker'

interface MonthlyRevenueCardProps {
  selected: string // 'YYYY-MM' atau 'semua'
  currentMonth: string // bulan berjalan, 'YYYY-MM'
}

interface Point {
  key: string
  short: string
  tooltip: string
  revenue: number | null // null = belum ada data
  highlight: boolean
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const TICK_COUNT = 4

// Data dummy per tahun (12 bulan, dalam juta rupiah). Nanti diganti data dari API.
const jt = (...v: (number | null)[]) => v.map((x) => (x === null ? null : x * 1_000_000))
const REVENUE: Record<number, (number | null)[]> = {
  2022: jt(null, null, null, null, null, null, 18, 22, 25, 28, 31, 35),
  2023: jt(36, 38, 41, 40, 44, 47, 49, 52, 55, 53, 57, 60),
  2024: jt(62, 58, 71, 69, 78, 84, 81, 90, 94, 100, null, null),
}

const revenueOf = (year: number, monthIndex: number): number | null =>
  REVENUE[year]?.[monthIndex] ?? null

const sumOf = (values: (number | null)[]): number =>
  values.reduce<number>((sum, v) => sum + (v ?? 0), 0)

const yearTotal = (year: number): number | null => {
  const values = REVENUE[year]
  if (!values || values.every((v) => v === null)) return null
  return sumOf(values)
}

function compact(value: number): string {
  if (value === 0) return '0'
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`
  }
  return `${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
}

export function MonthlyRevenueCard({ selected, currentMonth }: MonthlyRevenueCardProps) {
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
    points = MONTH_SHORT.map((short, i) => ({
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

  return (
    <section className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-espresso">
              {isAll ? 'Grafik Pendapatan Tahunan' : 'Grafik Pendapatan Bulanan'}
            </h2>
            <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-bark">
              {isAll ? 'Semua Tahun' : sy}
            </span>
          </div>
          <p className="mt-2 text-xs">
            {isAll
              ? 'Total pendapatan bersih per tahun.'
              : `Pendapatan bersih per bulan sepanjang ${sy}.`}
          </p>
        </div>

        <div className="text-right leading-tight">
          <p className="text-xs">{headlineLabel}</p>
          {headlineValue === null ? (
            <p className="mt-1 text-lg font-semibold text-mist">Belum ada data</p>
          ) : (
            <p className="mt-1 text-2xl font-bold text-espresso">
              <span className="mr-1 text-sm font-semibold text-mocha">Rp</span>
              {formatNumber(headlineValue)}
            </p>
          )}
          {trend !== null && (
            <p
              className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                trendUp ? 'text-olive' : 'text-danger'
              }`}
            >
              {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trendUp ? '+' : ''}
              {trend.toFixed(1).replace('.', ',')}% {trendLabel}
            </p>
          )}
        </div>
      </header>

      <div
        className="mt-8 flex flex-1 gap-3"
        role="img"
        aria-label={isAll ? 'Grafik batang pendapatan per tahun' : 'Grafik batang pendapatan per bulan'}
      >
        {/* Label sumbu Y */}
        <div className="relative h-64 w-14 shrink-0">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 translate-y-1/2 text-[11px] text-mist"
              style={{ bottom: `${pctOf(tick)}%` }}
            >
              {compact(tick)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-64">
            {/* Garis grid */}
            {ticks.map((tick) => (
              <div
                key={tick}
                className="absolute inset-x-0 border-t border-line"
                style={{ bottom: `${pctOf(tick)}%` }}
              />
            ))}

            {/* Garis rata-rata */}
            {hasData && (
              <div
                className="absolute inset-x-0 z-0 border-t border-dashed border-olive/60"
                style={{ bottom: `${pctOf(average)}%` }}
              >
                <span className="absolute right-0 -top-5 rounded bg-white px-1.5 text-[11px] font-semibold text-olive">
                  Rata-rata {compact(average)}
                </span>
              </div>
            )}

            {!hasData && (
              <p className="absolute inset-0 z-0 grid place-items-center text-sm text-mist">
                Belum ada data pendapatan
              </p>
            )}

            {/* Batang */}
            <div className="absolute inset-0 z-10 flex items-end gap-1.5 sm:gap-3">
              {points.map((p) => {
                const pct = p.revenue === null ? 0 : pctOf(p.revenue)
                return (
                  <div
                    key={p.key}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end"
                  >
                    {p.revenue === null ? (
                      <div className="h-1 w-full max-w-9 rounded bg-sand" />
                    ) : (
                      <>
                        <div
                          className="pointer-events-none absolute z-20 hidden rounded-md bg-espresso px-2.5 py-1.5 text-center text-xs text-white shadow-card group-hover:block"
                          style={{ bottom: `calc(${pct}% + 8px)` }}
                        >
                          <p className="text-[10px] opacity-80">{p.tooltip}</p>
                          <p className="font-semibold whitespace-nowrap">
                            Rp {formatNumber(p.revenue)}
                          </p>
                        </div>
                        <div
                          className={[
                            'w-full max-w-9 rounded-t-lg transition-colors',
                            p.highlight ? 'bg-espresso' : 'bg-honey group-hover:bg-mocha',
                          ].join(' ')}
                          style={{ height: `${pct}%` }}
                        />
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Label sumbu X */}
          <div className="mt-2 flex gap-1.5 sm:gap-3">
            {points.map((p) => (
              <span
                key={p.key}
                className={[
                  'flex-1 text-center text-[11px] sm:text-xs',
                  p.highlight ? 'font-bold text-espresso' : '',
                ].join(' ')}
              >
                {p.short}
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs">
        <span>{footerLabel}</span>
        <span className="font-bold text-olive">{footerValue}</span>
      </footer>
    </section>
  )
}