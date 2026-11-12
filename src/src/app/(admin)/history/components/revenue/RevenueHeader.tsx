import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/lib/format'
import type { RevenueChart } from '@/hooks/history/useRevenueChart'

export function RevenueHeader({ chart }: { chart: RevenueChart }) {
  const { isAll, sy, headlineLabel, headlineValue, trend, trendUp, trendLabel } = chart

  return (
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
  )
}
