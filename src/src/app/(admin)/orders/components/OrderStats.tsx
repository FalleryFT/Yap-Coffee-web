import { ArrowDown, ArrowUp } from 'lucide-react'
import { dot, statCards } from '@/constants/orders'
import type { OrderStatsData } from '@/types/orders'
import { Card } from './ui'

interface Props {
  /** null selama statistik belum dimuat; angka tampil sebagai "–". */
  stats: OrderStatsData | null
}

const fmtPercent = (n: number) => n.toLocaleString('id-ID', { maximumFractionDigits: 1 })

export function OrderStats({ stats }: Props) {
  // Hanya dihitung setelah stats ada (setelah render pertama), jadi aman dari selisih server vs browser.
  const weekday = stats ? new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase() : ''
  const change = stats?.today.changePercent ?? null

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {/* Pesanan masuk hari ini */}
      <div className="rounded-2xl bg-sand p-5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase leading-tight tracking-wide text-espresso">
            Pesanan Masuk<br />Hari Ini
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-olive px-2.5 py-1 text-[12px] font-medium text-white">
            <span className="size-1.5 rounded-full bg-white" />
            Live
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[40px] font-bold leading-none text-espresso">{stats ? stats.today.count : '–'}</span>
          <span className="text-[14px] text-bark">Pre-Order aktif</span>
        </div>
        {stats && (
          <div className="mt-3 flex items-center gap-3 text-[12px]">
            {change === null ? (
              <span className="text-bark">Belum ada data {weekday} minggu lalu</span>
            ) : (
              <>
                <span className={`flex items-center gap-1 ${change < 0 ? 'text-danger' : 'text-olive'}`}>
                  {change < 0 ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                  {fmtPercent(Math.abs(change))}%
                </span>
                <span className="text-bark">vs {weekday} minggu lalu</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Baru masuk / Diproses / Siap Diambil */}
      {statCards.map(([title, key, sub]) => (
        <Card key={title} className="p-5">
          <div className="flex items-center justify-between text-[14px] text-bark">
            {title}
            <span className={`size-3 rounded-full ${dot[title]}`} />
          </div>
          <div className={`mt-3 text-[34px] font-bold leading-none ${title === 'Siap Diambil' ? 'text-olive' : 'text-espresso'}`}>
            {stats ? stats.active[key] : '–'}
          </div>
          <div className="mt-5 text-[12px] text-bark">{sub}</div>
        </Card>
      ))}
    </div>
  )
}
