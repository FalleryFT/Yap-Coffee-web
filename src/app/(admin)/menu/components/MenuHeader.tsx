import { CirclePlus } from 'lucide-react'

export function MenuHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-mocha uppercase">
          Katalog &amp; Manajemen Stok
          <span className="text-mist">•</span>
          <span className="font-medium text-bark normal-case">Update Otomatis Kasir POS</span>
        </p>
        <h1 className="mt-2 text-4xl font-bold text-espresso">Daftar Menu &amp; Stok Harian</h1>
      </div>
      <button
        onClick={onAdd}
        className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white shadow-card hover:bg-espresso/90"
      >
        <CirclePlus size={18} />
        Tambah Menu Baru
      </button>
    </header>
  )
}
