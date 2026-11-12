import { ChevronLeft, ChevronRight } from 'lucide-react'
import { pageNumbers } from '@/utils/orders'

interface Props {
  /** Jumlah baris di halaman ini. */
  shown: number
  /** Jumlah seluruh pesanan yang cocok dengan filter. */
  total: number
  page: number
  totalPages: number
  onPage: (page: number) => void
}

export function OrderPagination({ shown, total, page, totalPages, onPage }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-sand/60 px-6 py-4 text-[14px] text-bark">
      <span>Menampilkan <b className="text-ink">{shown}</b> dari {total} pesanan</span>
      <div className="flex items-center gap-2">
        <button
          aria-label="Sebelumnya"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="grid size-9 place-items-center rounded-lg bg-white hover:bg-sand disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pageNumbers(page, totalPages).map((p) => (
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
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="grid size-9 place-items-center rounded-lg bg-white hover:bg-sand disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
