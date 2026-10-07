import {
  Banknote,
  ChartColumn,
  CircleCheck,
  Receipt,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { todaySummary } from '../../data/dummy'
import { formatNumber } from '../../lib/format'

interface StatCardProps {
  label: string
  icon: LucideIcon
  iconClass: string
  value: ReactNode
  valueClass?: string
  footer: ReactNode
}

function StatCard({ label, icon: Icon, iconClass, value, valueClass, footer }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-line bg-white p-4">
      <div className="flex items-start justify-between">
        <span className="text-xs">{label}</span>
        <span className={`flex size-9 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={18} strokeWidth={1.75} />
        </span>
      </div>
      <p className={`text-3xl font-bold ${valueClass ?? 'text-espresso'}`}>{value}</p>
      <p className="flex items-center gap-1.5 text-xs">{footer}</p>
    </div>
  )
}

export function TodaySummary() {
  const s = todaySummary

  return (
    <section>
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-espresso">
          <ChartColumn size={20} />
          Ringkasan Pesanan Hari Ini
        </h2>
        <span className="text-xs">Update otomatis via POS Lokal</span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Pesanan"
          icon={Receipt}
          iconClass="bg-sand text-bark"
          value={s.totalOrders}
          footer={
            <>
              <TrendingUp size={14} className="text-olive" />
              <span>+{s.trendPercent}% dibanding kemarin</span>
            </>
          }
        />
        <StatCard
          label="Siap Ambil (Pickup)"
          icon={ShoppingBag}
          iconClass="bg-peach text-mocha"
          value={s.readyForPickup}
          valueClass="text-mocha"
          footer={
            <>
              <span className="size-2 rounded-full bg-olive" />
              <span>Di rak penyimpanan bar</span>
            </>
          }
        />
        <StatCard
          label="Selesai Diambil"
          icon={CircleCheck}
          iconClass="bg-sand text-olive"
          value={s.completed}
          valueClass="text-olive"
          footer={
            <>
              <CircleCheck size={14} className="text-olive" />
              <span>{s.onTimePercent}% tepat waktu</span>
            </>
          }
        />
        <StatCard
          label="Total Pendapatan"
          icon={Banknote}
          iconClass="bg-sand text-bark"
          value={
            <>
              <span className="mr-1 text-sm font-semibold text-mocha">Rp</span>
              {formatNumber(s.revenue)}
            </>
          }
          footer={<span>Rata-rata: Rp {formatNumber(s.averagePerOrder)} / pesanan</span>}
        />
      </div>
    </section>
  )
}