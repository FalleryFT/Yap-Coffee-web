import {
  Banknote,
  ChartColumn,
  CircleCheck,
  Receipt,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatNumber } from '@/lib/format'
import type { TodaySummaryData } from '@/types/dashboard'
import { formatTrend } from '@/utils/dashboard'

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

// Ditampilkan selama data pertama belum datang.
const EMPTY: TodaySummaryData = {
  totalOrders: 0,
  trendPercent: null,
  readyForPickup: 0,
  completed: 0,
  onTimePercent: null,
  revenue: 0,
  averagePerOrder: 0,
}

function TrendFooter({ percent }: { percent: number | null }) {
  if (percent === null) return <span>Belum ada pembanding kemarin</span>
  const { text, up } = formatTrend(percent)
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <>
      <Icon size={14} className={up ? 'text-olive' : 'text-danger'} />
      <span>{text} dibanding kemarin</span>
    </>
  )
}

export function TodaySummary({ summary }: { summary: TodaySummaryData | null }) {
  const s = summary ?? EMPTY

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
          footer={<TrendFooter percent={s.trendPercent} />}
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
            s.onTimePercent === null ? (
              <span>Belum ada pesanan selesai</span>
            ) : (
              <>
                <CircleCheck size={14} className="text-olive" />
                <span>{s.onTimePercent}% tepat waktu</span>
              </>
            )
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
