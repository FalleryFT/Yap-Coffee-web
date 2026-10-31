import { formatNumber } from '@/lib/format'
import { compact } from '@/utils/revenue'
import type { RevenueChart } from '@/hooks/history/useRevenueChart'

export function RevenueBars({ chart }: { chart: RevenueChart }) {
  const { isAll, ticks, pctOf, hasData, average, points } = chart

  return (
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
  )
}
