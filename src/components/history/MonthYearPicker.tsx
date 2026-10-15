'use client'

import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

// value: 'YYYY-MM' atau 'semua'
export function formatMonthLabel(value: string, currentValue: string): string {
  if (value === 'semua') return 'Semua Bulan'
  const [year = '', month = '1'] = value.split('-')
  const label = `${MONTH_NAMES[Number(month) - 1]} ${year}`
  return value === currentValue ? `Bulan Ini - ${label}` : label
}

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
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'month' | 'year'>('month')
  const [viewYear, setViewYear] = useState(() => Number(currentValue.slice(0, 4)))
  const ref = useRef<HTMLDivElement>(null)

  // Tutup saat klik di luar atau tekan Escape.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = () => {
    if (!open) {
      const base = value === 'semua' ? currentValue : value
      setViewYear(Number(base.slice(0, 4)))
      setView('month')
    }
    setOpen((o) => !o)
  }

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Pilih bulan dan tahun"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className={[
          'flex h-12 items-center gap-3 rounded-lg bg-white px-3 text-[14px] transition-colors hover:bg-sand',
          open ? 'ring-2 ring-mocha/40' : '',
        ].join(' ')}
      >
        <Calendar size={16} className="text-espresso" />
        <span className="flex items-center gap-6 rounded border border-line px-3 py-1.5 text-ink">
          {formatMonthLabel(value, currentValue)}
          <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Pilih bulan dan tahun"
          className="absolute left-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-white p-4 shadow-card"
        >
          {/* Header tahun */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Tahun sebelumnya"
              disabled={viewYear <= minYear}
              onClick={() => setViewYear((y) => y - 1)}
              className="grid size-8 place-items-center rounded-lg text-espresso hover:bg-sand disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => setView((v) => (v === 'month' ? 'year' : 'month'))}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[15px] font-bold text-espresso hover:bg-sand"
            >
              {viewYear}
              <ChevronDown
                size={14}
                className={`transition-transform ${view === 'year' ? 'rotate-180' : ''}`}
              />
            </button>

            <button
              type="button"
              aria-label="Tahun berikutnya"
              disabled={viewYear >= maxYear}
              onClick={() => setViewYear((y) => y + 1)}
              className="grid size-8 place-items-center rounded-lg text-espresso hover:bg-sand disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Grid bulan / grid tahun */}
          {view === 'month' ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {MONTH_ABBR.map((abbr, i) => {
                const key = `${viewYear}-${String(i + 1).padStart(2, '0')}`
                const active = key === value
                const isCurrent = key === currentValue
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => pick(key)}
                    className={[
                      'relative rounded-lg py-2.5 text-[14px] font-medium transition-colors',
                      active ? 'bg-espresso text-white' : 'text-ink hover:bg-sand',
                    ].join(' ')}
                  >
                    {abbr}
                    {isCurrent && (
                      <span
                        className={`absolute right-1.5 top-1.5 size-1.5 rounded-full ${active ? 'bg-white' : 'bg-olive'}`}
                        aria-label="Bulan ini"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    setViewYear(y)
                    setView('month')
                  }}
                  className={[
                    'rounded-lg py-2.5 text-[14px] font-medium transition-colors',
                    y === viewYear ? 'bg-espresso text-white' : 'text-ink hover:bg-sand',
                  ].join(' ')}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {/* Pintasan */}
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[13px]">
            <button
              type="button"
              onClick={() => pick('semua')}
              className="rounded-lg px-2.5 py-1.5 font-semibold text-bark hover:bg-sand"
            >
              Semua Bulan
            </button>
            <button
              type="button"
              onClick={() => pick(currentValue)}
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