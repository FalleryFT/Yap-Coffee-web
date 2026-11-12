'use client'

import { Calendar, ChevronDown } from 'lucide-react'
import { useMonthYearPicker } from '@/hooks/history/useMonthYearPicker'
import { formatMonthLabel } from '@/utils/history'
import { MonthGrid } from './picker/MonthGrid'
import { PickerHeader } from './picker/PickerHeader'
import { YearGrid } from './picker/YearGrid'

export { MONTH_NAMES } from '@/constants/months'
export { formatMonthLabel } from '@/utils/history'

interface MonthYearPickerProps {
  value: string
  onChange: (value: string) => void
  currentValue: string // bulan berjalan, format 'YYYY-MM'
  minYear?: number
  maxYear?: number
}

export function MonthYearPicker({
  value,
  onChange,
  currentValue,
  minYear = 2022,
  maxYear = 2026,
}: MonthYearPickerProps) {
  const p = useMonthYearPicker(value, currentValue, onChange)
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)

  return (
    <div ref={p.ref} className="relative">
      <button
        type="button"
        aria-label="Pilih bulan dan tahun"
        aria-haspopup="dialog"
        aria-expanded={p.open}
        onClick={p.toggle}
        className={[
          'flex h-12 items-center gap-3 rounded-lg bg-white px-3 text-[14px] transition-colors hover:bg-sand',
          p.open ? 'ring-2 ring-mocha/40' : '',
        ].join(' ')}
      >
        <Calendar size={16} className="text-espresso" />
        <span className="flex items-center gap-6 rounded border border-line px-3 py-1.5 text-ink">
          {formatMonthLabel(value, currentValue)}
          <ChevronDown size={13} className={`transition-transform ${p.open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {p.open && (
        <div
          role="dialog"
          aria-label="Pilih bulan dan tahun"
          className="absolute left-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-white p-4 shadow-card"
        >
          <PickerHeader
            viewYear={p.viewYear}
            view={p.view}
            minYear={minYear}
            maxYear={maxYear}
            onPrev={() => p.setViewYear((y) => y - 1)}
            onNext={() => p.setViewYear((y) => y + 1)}
            onToggleView={p.toggleView}
          />

          {p.view === 'month' ? (
            <MonthGrid viewYear={p.viewYear} value={value} currentValue={currentValue} onPick={p.pick} />
          ) : (
            <YearGrid years={years} viewYear={p.viewYear} onPick={p.pickYear} />
          )}

          {/* Pintasan */}
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[13px]">
            <button
              type="button"
              onClick={() => p.pick('semua')}
              className="rounded-lg px-2.5 py-1.5 font-semibold text-bark hover:bg-sand"
            >
              Semua Bulan
            </button>
            <button
              type="button"
              onClick={() => p.pick(currentValue)}
              className="rounded-lg px-2.5 py-1.5 font-semibold text-espresso hover:bg-sand"
            >
              Bulan Ini
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
