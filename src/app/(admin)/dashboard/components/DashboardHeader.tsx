import { RefreshCw, ShieldCheck } from 'lucide-react'
import { shift } from '@/data/dummy'

interface Props {
  syncLabel: string
  onResync: () => void
}

export function DashboardHeader({ syncLabel, onResync }: Props) {
  return (
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
          onClick={onResync}
          className="text-bark hover:text-espresso"
          aria-label="Sinkronkan ulang"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  )
}
