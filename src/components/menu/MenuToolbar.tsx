import { ChevronDown, Search } from 'lucide-react'
import { stockFilterOptions } from '../../lib/menu'
import type { MenuCategory, StockStatus } from '../../types/admin'

export interface CategoryChip {
  value: MenuCategory | 'semua'
  label: string
  count: number
}

interface MenuToolbarProps {
  categories: CategoryChip[]
  category: MenuCategory | 'semua'
  onCategoryChange: (value: MenuCategory | 'semua') => void
  search: string
  onSearchChange: (value: string) => void
  stock: StockStatus | 'semua'
  onStockChange: (value: StockStatus | 'semua') => void
}

export function MenuToolbar({
  categories,
  category,
  onCategoryChange,
  search,
  onSearchChange,
  stock,
  onStockChange,
}: MenuToolbarProps) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-sand/60 p-3">
      {/* Chip kategori: bisa digeser kalau kepanjangan */}
      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1" role="tablist" aria-label="Kategori menu">
        {categories.map((chip) => {
          const active = chip.value === category
          return (
            <button
              key={chip.value}
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(chip.value)}
              className={[
                'h-10 shrink-0 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-colors',
                active
                  ? 'bg-espresso text-white'
                  : 'bg-white text-espresso hover:bg-espresso/5',
              ].join(' ')}
            >
              {chip.label} ({chip.count})
            </button>
          )
        })}
      </div>

      <label className="flex h-10 w-full items-center gap-2 rounded-lg bg-white px-3 text-sm sm:w-60">
        <Search size={16} className="shrink-0 text-bark" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama racikan..."
          aria-label="Cari nama racikan"
          className="w-full bg-transparent text-ink outline-none placeholder:text-mist"
        />
      </label>

      <div className="relative w-full sm:w-52">
        <select
          value={stock}
          onChange={(event) => onStockChange(event.target.value as StockStatus | 'semua')}
          aria-label="Filter status stok"
          className="h-10 w-full appearance-none rounded-lg bg-white pr-9 pl-3 text-sm font-medium text-espresso outline-none focus-visible:ring-2 focus-visible:ring-espresso/30"
        >
          {stockFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-bark"
        />
      </div>
    </section>
  )
}