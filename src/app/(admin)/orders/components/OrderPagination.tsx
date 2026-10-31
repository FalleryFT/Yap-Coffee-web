import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  shown: number
  page: number
  onPage: (page: number) => void
}

export function OrderPagination({ shown, page, onPage }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-sand/60 px-6 py-4 text-[14px] text-bark">
      <span>Menampilkan <b className="text-ink">{shown}</b> dari 33 pesanan aktif</span>
      <div className="flex items-center gap-2">
        <button
          aria-label="Sebelumnya"
          disabled={page === 1}
          onClick={() => onPage(1)}
          className="grid size-9 place-items-center rounded-lg disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {[1, 2].map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            aria-current={page === p ? 'page' : undefined}
            className={`grid size-9 place-items-center rounded-lg ${page === p ? 'bg-espresso text-white' : 'bg-white hover:bg-sand'}`}
          >
            {p}
          </button>
        ))}
        <button
          aria-label="Berikutnya"
          disabled={page === 2}
          onClick={() => onPage(2)}
          className="grid size-9 place-items-center rounded-lg bg-white disabled:opacity-40 hover:bg-sand"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
