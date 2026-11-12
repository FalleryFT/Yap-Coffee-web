import { Banknote, TrendingDown, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/lib/format'
import { useWeeklyRevenue } from '@/hooks/dashboard/useWeeklyRevenue'
import type { WeeklyRevenueData } from '@/types/dashboard'
import { formatTrend } from '@/utils/dashboard'
import { WeeklyRevenueBars } from './WeeklyRevenueBars'

export function WeeklyRevenueCard({ weekly }: { weekly: WeeklyRevenueData | null }) {
  const { data, total, average, niceMax, ticks } = useWeeklyRevenue(weekly?.points ?? [])
  const trend = weekly?.trendPercent != null ? formatTrend(weekly.trendPercent) : null
  const TrendIcon = trend?.up === false ? TrendingDown : TrendingUp

  return (
    <section className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-espresso">Grafik Pendapatan Mingguan</h2>
            <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-bark">
              Pekan Ini
            </span>
          </div>
          <p className="mt-2 text-xs">Total pendapatan harian Senin sampai Minggu.</p>
        </div>

        <div className="text-right leading-tight">
          <p className="text-xs">Total Pekan Ini</p>
          <p className="mt-1 text-2xl font-bold text-espresso">
            <span className="mr-1 text-sm font-semibold text-mocha">Rp</span>
            {formatNumber(total)}
          </p>
          {trend && (
            <p
              className={`mt-1 flex items-center justify-end gap-1 text-xs ${trend.up ? 'text-olive' : 'text-danger'}`}
            >
              <TrendIcon size={14} />
              {trend.text} dibanding pekan lalu
            </p>
          )}
        </div>
      </header>

      <WeeklyRevenueBars data={data} niceMax={niceMax} ticks={ticks} />

      <footer className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs">
        <span className="flex items-center gap-1.5">
          <Banknote size={14} className="text-mocha" />
          Rata-rata harian
        </span>
        <span className="font-bold text-olive">Rp {formatNumber(average)}</span>
      </footer>
    </section>
  )
}
