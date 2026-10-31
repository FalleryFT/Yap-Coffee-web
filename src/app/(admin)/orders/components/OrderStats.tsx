import { ArrowUp } from 'lucide-react'
import { dot, statCards } from '@/constants/orders'
import { Card } from './ui'

export function OrderStats() {
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
          <span className="text-[40px] font-bold leading-none text-espresso">42</span>
          <span className="text-[14px] text-bark">Pre-Order aktif</span>
        </div>
        <div className="mt-3 flex items-center gap-3 text-[12px]">
          <span className="flex items-center gap-1 text-olive"><ArrowUp size={13} />18.4%</span>
          <span className="text-bark">vs kamis minggu lalu</span>
        </div>
      </div>

      {/* Baru masuk / Diproses / Siap Diambil */}
      {statCards.map(([t, n, s]) => (
        <Card key={t} className="p-5">
          <div className="flex items-center justify-between text-[14px] text-bark">
            {t}
            <span className={`size-3 rounded-full ${dot[t]}`} />
          </div>
          <div className={`mt-3 text-[34px] font-bold leading-none ${t === 'Siap Diambil' ? 'text-olive' : 'text-espresso'}`}>
            {n}
          </div>
          <div className="mt-5 text-[12px] text-bark">{s}</div>
        </Card>
      ))}
    </div>
  )
}
