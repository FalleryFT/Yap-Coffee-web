import { Receipt, Search, SlidersHorizontal } from 'lucide-react'

interface Props {
  query: string
  onQuery: (q: string) => void
}

export function QueueHeader({ query, onQuery }: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 px-6 pt-6 pb-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-espresso">
          <Receipt size={20} />
          Lihat Orders: Pesanan Masuk &amp; Antrean Bar
        </h2>
        <p className="mt-1 text-sm">Daftar pesanan live dan antrean pickup dari tetangga sekitar</p>
      </div>
      <div className="flex items-center gap-2">
        <label className="flex h-11 w-72 items-center gap-2 rounded-lg border border-line bg-cream px-3">
          <Search size={16} className="text-mist" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Cari nama atau #Order ID..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-mist"
          />
        </label>
        <button
          className="flex size-11 items-center justify-center rounded-lg border border-line bg-cream text-bark hover:bg-sand"
          aria-label="Filter"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </header>
  )
}
