import { CURRENT_MONTH } from '@/constants/history'
import { formatMonthLabel } from './MonthYearPicker'

interface Props {
  month: string
  status: string
  statusLabel: string
  onClear: () => void
}

export function ActiveFilters({ month, status, statusLabel, onClear }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line bg-sand/30 px-4 py-3 text-[12px] text-bark">
      Filter aktif:
      {month !== 'semua' && (
        <span className="rounded bg-sand px-3 py-1.5 text-ink">
          Bulan: {formatMonthLabel(month, CURRENT_MONTH)}
        </span>
      )}
      {status !== 'semua' && (
        <span className="rounded bg-sand px-3 py-1.5 text-ink">Status: {statusLabel}</span>
      )}
      <button onClick={onClear} className="text-espresso underline">
        Reset Filter
      </button>
    </div>
  )
}
