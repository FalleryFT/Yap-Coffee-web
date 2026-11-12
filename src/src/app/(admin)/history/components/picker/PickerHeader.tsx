import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  viewYear: number
  view: 'month' | 'year'
  minYear: number
  maxYear: number
  onPrev: () => void
  onNext: () => void
  onToggleView: () => void
}

export function PickerHeader({ viewYear, view, minYear, maxYear, onPrev, onNext, onToggleView }: Props) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        aria-label="Tahun sebelumnya"
        disabled={viewYear <= minYear}
        onClick={onPrev}
        className="grid size-8 place-items-center rounded-lg text-espresso hover:bg-sand disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        type="button"
        onClick={onToggleView}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[15px] font-bold text-espresso hover:bg-sand"
      >
        {viewYear}
        <ChevronDown size={14} className={`transition-transform ${view === 'year' ? 'rotate-180' : ''}`} />
      </button>

      <button
        type="button"
        aria-label="Tahun berikutnya"
        disabled={viewYear >= maxYear}
        onClick={onNext}
        className="grid size-8 place-items-center rounded-lg text-espresso hover:bg-sand disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
