interface Props {
  total: number
  start: number
  count: number
  currentPage: number
  totalPages: number
  onPage: (page: number) => void
}

export function HistoryPagination({ total, start, count, currentPage, totalPages, onPage }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-2xl border-t border-line bg-sand/50 px-6 py-4 text-[12px] text-bark">
      <span>
        {total === 0
          ? 'Tidak ada riwayat pesanan'
          : `Menampilkan ${start + 1} - ${start + count} dari ${total} riwayat pesanan`}
      </span>
      <div className="flex items-center gap-2 text-[14px]">
        <button
          disabled={currentPage === 1}
          onClick={() => onPage(currentPage - 1)}
          className="px-3 py-2 hover:text-espresso disabled:opacity-40"
        >
          Sebelumnya
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            aria-current={currentPage === p ? 'page' : undefined}
            className={`grid size-9 place-items-center rounded-lg ${currentPage === p ? 'bg-espresso font-semibold text-white' : 'hover:bg-sand'}`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPage(currentPage + 1)}
          className="rounded-lg px-3 py-2 hover:bg-sand disabled:opacity-40"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  )
}
