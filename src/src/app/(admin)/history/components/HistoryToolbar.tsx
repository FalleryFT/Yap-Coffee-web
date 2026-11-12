import { RefreshCw, Search, SlidersHorizontal } from 'lucide-react'
import { CURRENT_MONTH, statusOptions } from '@/constants/history'
import { FilterDropdown } from './FilterDropdown'
import { MonthYearPicker } from './MonthYearPicker'

interface Props {
  q: string
  onQuery: (v: string) => void
  month: string
  onMonth: (v: string) => void
  status: string
  onStatus: (v: string) => void
  onReset: () => void
}

export function HistoryToolbar({ q, onQuery, month, onMonth, status, onStatus, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-t-2xl bg-sand/60 p-4">
      <label className="flex h-12 min-w-64 flex-1 items-center gap-2 rounded-lg border-2 border-mocha/40 bg-white px-3 text-[14px] text-bark">
        <Search size={16} />
        <input
          value={q}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Cari nomor order #ORD, nama pelanggan, atau varian"
          className="w-full bg-transparent text-ink outline-none"
        />
      </label>

      <MonthYearPicker value={month} currentValue={CURRENT_MONTH} onChange={onMonth} />

      <FilterDropdown
        icon={SlidersHorizontal}
        ariaLabel="Pilih status pesanan"
        value={status}
        options={statusOptions}
        onChange={onStatus}
        menuClassName="min-w-48"
      />

      <button
        aria-label="Muat ulang"
        onClick={onReset}
        className="grid size-12 place-items-center rounded-lg bg-white text-espresso hover:bg-sand"
      >
        <RefreshCw size={16} />
      </button>
    </div>
  )
}
