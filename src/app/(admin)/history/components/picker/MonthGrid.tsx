import { MONTH_ABBR } from '@/constants/months'

interface Props {
  viewYear: number
  value: string
  currentValue: string
  onPick: (key: string) => void
}

export function MonthGrid({ viewYear, value, currentValue, onPick }: Props) {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {MONTH_ABBR.map((abbr, i) => {
        const key = `${viewYear}-${String(i + 1).padStart(2, '0')}`
        const active = key === value
        const isCurrent = key === currentValue
        return (
          <button
            key={key}
            type="button"
            onClick={() => onPick(key)}
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
  )
}
