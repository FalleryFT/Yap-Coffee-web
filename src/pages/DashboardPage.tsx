import { RefreshCw, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { NewOrderBanner } from '../components/dashboard/NewOrderBanner'
import { OrderQueueTable } from '../components/dashboard/OrderQueueTable'
import { PreOrderScheduleCard } from '../components/dashboard/PreOrderScheduleCard'
import { TodaySummary } from '../components/dashboard/TodaySummary'
import { TopMenuCard } from '../components/dashboard/TopMenuCard'
import { posSyncLabel, shift } from '../data/dummy'

export default function DashboardPage() {
  const [syncLabel, setSyncLabel] = useState(posSyncLabel)

  return (
    <main className="flex flex-col gap-6 px-8 py-6">
      {/* Judul + status sinkron POS */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-olive uppercase">
            <ShieldCheck size={14} />
            Sistem Operasional Aktif
            <span className="text-mist">•</span>
            <span className="text-bark normal-case">
              {shift.label} ({shift.hours})
            </span>
          </p>
          <h1 className="mt-2 text-4xl font-bold text-espresso">Selamat Datang, Admin Yap Coffee</h1>
          <p className="mt-2 max-w-xl text-sm">
            Pantau sesi pre-order aktif, konfirmasi pesanan masuk dari tetangga, dan kelola antrean
            seduhan.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-line bg-white/70 px-4 py-3">
          <span className="size-2 rounded-full bg-olive" aria-hidden="true" />
          <div className="text-xs leading-tight">
            <p className="font-semibold text-espresso">Live POS Sinkron</p>
            <p>{syncLabel}</p>
          </div>
          <button
            onClick={() => setSyncLabel('Update baru saja')}
            className="text-bark hover:text-espresso"
            aria-label="Sinkronkan ulang"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      <NewOrderBanner />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <PreOrderScheduleCard />
        <TopMenuCard />
      </div>

      <TodaySummary />
      <OrderQueueTable />
    </main>
  )
}