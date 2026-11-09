import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { stockFilterOptions } from '@/constants/menu'
import type { MenuCategory, StockStatus } from '@/types/admin'
import type { CategoryChip } from '@/types/menu'

interface MenuToolbarProps {
  categories: CategoryChip[]
  category: MenuCategory | 'semua'
  onCategoryChange: (value: MenuCategory | 'semua') => void
  onAddCategory: () => void
  search: string
  onSearchChange: (value: string) => void
  stock: StockStatus | 'semua'
  onStockChange: (value: StockStatus | 'semua') => void
}

export function MenuToolbar({
  categories,
  category,
  onCategoryChange,
  onAddCategory,
  search,
  onSearchChange,
  stock,
  onStockChange,
}: MenuToolbarProps) {
  const dragState = useRef({ active: false, moved: false, startX: 0, startScrollLeft: 0, pointerId: -1 })
  const [dragging, setDragging] = useState(false)

  // Klik-tahan-geser untuk mouse; sentuhan tetap pakai scroll native.
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const el = event.currentTarget
    dragState.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      pointerId: event.pointerId,
    }
    el.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragState.current
    if (!drag.active) return
    const delta = event.clientX - drag.startX
    if (!drag.moved && Math.abs(delta) <= 4) return
    if (!drag.moved) {
      drag.moved = true
      setDragging(true)
    }
    event.currentTarget.scrollLeft = drag.startScrollLeft - delta
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    const drag = dragState.current
    if (!drag.active) return
    drag.active = false
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(drag.pointerId)) {
      event.currentTarget.releasePointerCapture(drag.pointerId)
    }
  }

  // Geseran tidak boleh ikut memilih kategori.
  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!dragState.current.moved) return
    dragState.current.moved = false
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-sand/60 p-3">
      {/* Chip kategori: bisa digeser kalau kepanjangan */}
      <div
        role="tablist"
        aria-label="Kategori menu"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
        className={[
          'flex min-w-0 flex-1 gap-4 overflow-x-auto py-1 select-none [&_button]:cursor-inherit',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        ].join(' ')}
      >
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

      <button
        type="button"
        onClick={onAddCategory}
        className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-mocha/50 bg-transparent px-4 text-sm font-medium whitespace-nowrap text-mocha transition-colors hover:bg-white"
      >
        <Plus size={16} />
        Tambah Kategori
      </button>

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
