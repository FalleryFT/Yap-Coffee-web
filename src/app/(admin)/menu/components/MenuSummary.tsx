import { Archive, Coffee } from 'lucide-react'

interface MenuSummaryProps {
  activeCount: number
  soldOutCount: number
}

export function MenuSummary({ activeCount, soldOutCount }: MenuSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
        <span className="flex size-12 items-center justify-center rounded-xl bg-sand text-bark">
          <Coffee size={22} strokeWidth={1.75} />
        </span>
        <div className="leading-tight">
          <p className="text-xs">Total Menu Aktif</p>
          <p className="mt-1 text-2xl font-bold text-espresso">{activeCount} Menu</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
        <span className="flex size-12 items-center justify-center rounded-xl bg-danger-soft text-danger">
          <Archive size={22} strokeWidth={1.75} />
        </span>
        <div className="leading-tight">
          <p className="text-xs">Menu Habis Terjual</p>
          <p className={`mt-1 text-2xl font-bold ${soldOutCount > 0 ? 'text-danger' : 'text-espresso'}`}>
            {soldOutCount} Menu{soldOutCount > 0 && ' (Perlu Restok)'}
          </p>
        </div>
      </div>
    </div>
  )
}