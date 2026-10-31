interface Props {
  years: number[]
  viewYear: number
  onPick: (year: number) => void
}

export function YearGrid({ years, viewYear, onPick }: Props) {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {years.map((y) => (
        <button
          key={y}
          type="button"
          onClick={() => onPick(y)}
          className={[
            'rounded-lg py-2.5 text-[14px] font-medium transition-colors',
            y === viewYear ? 'bg-espresso text-white' : 'text-ink hover:bg-sand',
          ].join(' ')}
        >
          {y}
        </button>
      ))}
    </div>
  )
}
