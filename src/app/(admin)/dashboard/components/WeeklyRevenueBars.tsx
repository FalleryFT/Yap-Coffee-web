import { formatNumber } from '@/lib/format'
import { compact } from '@/hooks/dashboard/useWeeklyRevenue'
import type { WeeklyRevenue } from '@/hooks/dashboard/useWeeklyRevenue'

export function WeeklyRevenueBars({ data, niceMax, ticks }: Pick<WeeklyRevenue, 'data' | 'niceMax' | 'ticks'>) {
  return (
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
  )
}
