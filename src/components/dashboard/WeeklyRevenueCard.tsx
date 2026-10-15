import { Banknote, TrendingUp } from 'lucide-react'
import { weeklyRevenue, weeklyRevenueTrendPercent } from '../../data/dummy'
import { formatNumber } from '../../lib/format'

const TICK_COUNT = 4

function compact(value: number): string {
  if (value === 0) return '0'
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} jt`
  }
  return `${Math.round(value / 1000)} rb`
}

export function WeeklyRevenueCard() {
  const data = weeklyRevenue
  const filled = data.filter((d) => d.revenue !== null)
  const total = filled.reduce((sum, d) => sum + (d.revenue ?? 0), 0)
  const average = filled.length ? Math.round(total / filled.length) : 0

  const max = Math.max(...filled.map((d) => d.revenue ?? 0), 1)
  const unit = Math.ceil(max / TICK_COUNT / 100_000) * 100_000
  const niceMax = unit * TICK_COUNT
  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => i * unit)

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
          <p className="mt-1 flex items-center justify-end gap-1 text-xs text-olive">
            <TrendingUp size={14} />+{weeklyRevenueTrendPercent}% dibanding pekan lalu
          </p>
        </div>
      </header>

      <div
        className="mt-6 flex gap-3"
        role="img"
        aria-label="Grafik batang pendapatan harian selama satu pekan"
      >
        {/* Label sumbu Y */}
        <div className="relative h-56 w-12 shrink-0">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 translate-y-1/2 text-[11px] text-mist"
              style={{ bottom: `${(tick / niceMax) * 100}%` }}
            >
              {compact(tick)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          {/* Area batang */}
          <div className="relative h-56">
            {ticks.map((tick) => (
              <div
                key={tick}
                className="absolute inset-x-0 border-t border-line"
                style={{ bottom: `${(tick / niceMax) * 100}%` }}
              />
            ))}

            <div className="absolute inset-0 flex items-end gap-2 sm:gap-4">
              {data.map((d) => {
                const pct = d.revenue === null ? 0 : (d.revenue / niceMax) * 100
                return (
                  <div
                    key={d.date}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end"
                  >
                    {d.revenue === null ? (
                      <div className="h-1 w-full max-w-10 rounded bg-sand" />
                    ) : (
                      <>
                        <div
                          className="absolute z-10 hidden -translate-y-0 whitespace-nowrap rounded-md bg-espresso px-2 py-1 text-xs font-semibold text-white group-hover:block"
                          style={{ bottom: `calc(${pct}% + 8px)` }}
                        >
                          Rp {formatNumber(d.revenue)}
                        </div>
                        <div
                          className={[
                            'w-full max-w-10 rounded-t-lg transition-colors',
                            d.isToday ? 'bg-espresso' : 'bg-honey group-hover:bg-mocha',
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

          {/* Label hari */}
          <div className="mt-2 flex gap-2 sm:gap-4">
            {data.map((d) => (
              <span
                key={d.date}
                className={[
                  'flex-1 text-center text-xs',
                  d.isToday ? 'font-bold text-espresso' : '',
                ].join(' ')}
              >
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </div>

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