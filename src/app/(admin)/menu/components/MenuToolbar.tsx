import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { ChevronDown, Plus, Search, X } from 'lucide-react'
import { stockFilterOptions } from '@/constants/menu'
import { toApiError } from '@/lib/apiError'
import type { MenuCategory, StockStatus } from '@/types/admin'
import type { CategoryChip } from '@/types/menu'
import { CategoryDeleteModal } from './CategoryDeleteModal'

interface MenuToolbarProps {
  categories: CategoryChip[]
  category: MenuCategory | 'semua'
  onCategoryChange: (value: MenuCategory | 'semua') => void
  onAddCategory: () => void
  onDeleteCategory: (chip: CategoryChip, moveTo?: CategoryChip) => Promise<void>
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
  onDeleteCategory,
  search,
  onSearchChange,
  stock,
  onStockChange,
}: MenuToolbarProps) {
  const dragState = useRef({ active: false, moved: false, startX: 0, startScrollLeft: 0, pointerId: -1 })
  const [dragging, setDragging] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmChip, setConfirmChip] = useState<CategoryChip | null>(null)

  // Selalu bersihkan jejak geseran sebelumnya, termasuk saat pointerdown dimulai di tombol hapus
  // (tombol itu menghentikan bubbling sehingga handler di bawah tidak jalan).
  function handlePointerDownCapture() {
    dragState.current.moved = false
  }

  // Klik-tahan-geser untuk mouse; sentuhan tetap pakai scroll native.
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    dragState.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      pointerId: event.pointerId,
    }
    // Capture baru dipasang saat geseran benar-benar dimulai; kalau dipasang di sini,
    // mouseup/click dialihkan ke container sehingga tombol chip tidak pernah menerima klik.
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragState.current
    if (!drag.active) return
    const delta = event.clientX - drag.startX
    if (!drag.moved) {
      if (Math.abs(delta) <= 4) return
      drag.moved = true
      setDragging(true)
      event.currentTarget.setPointerCapture(drag.pointerId)
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

  async function handleDeleteCategory(chip: CategoryChip) {
    if (deleting) return
    setDeleting(chip.value)
    setError(null)
    try {
      await onDeleteCategory(chip)
    } catch (err) {
      const apiError = toApiError(err)
      // Kategori masih dipakai menu → tampilkan popup konfirmasi, bukan pesan galat.
      if (apiError.status === 409) setConfirmChip(chip)
      else setError(Object.values(apiError.fieldErrors)[0]?.[0] ?? apiError.message)
    } finally {
      setDeleting(null)
    }
  }

  // Popup hanya memanggil ini kalau admin memilih "Ya, Hapus Kategori".
  async function confirmDeleteCategory(moveTo: CategoryChip) {
    if (!confirmChip) return
    await onDeleteCategory(confirmChip, moveTo)
  }

  return (
    <>
      <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-sand/60 p-3">
        {/* Chip kategori: bisa digeser kalau kepanjangan */}
        <div
          role="tablist"
          aria-label="Kategori menu"
          onPointerDownCapture={handlePointerDownCapture}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClickCapture={handleClickCapture}
          className={[
            'flex min-w-0 flex-1 gap-4 overflow-x-auto py-1 select-none',
            dragging ? 'cursor-grabbing' : 'cursor-grab',
          ].join(' ')}
        >
          {categories.map((chip) => {
            const active = chip.value === category
            const removable = chip.value !== 'semua'
            return (
              <div key={chip.value} className="relative shrink-0">
                <button
                  role="tab"
                  aria-selected={active}
                  onClick={() => onCategoryChange(chip.value)}
                  className={[
                    'h-10 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    removable ? 'pr-9 pl-5' : 'px-5',
                    active
                      ? 'bg-espresso text-white'
                      : 'bg-white text-espresso hover:bg-espresso/5',
                    dragging ? 'cursor-grabbing' : 'cursor-grab',
                  ].join(' ')}
                >
                  {chip.label} ({chip.count})
                </button>
                {removable && (
                  <button
                    type="button"
                    aria-label={`Hapus kategori ${chip.label}`}
                    title={`Hapus kategori ${chip.label}`}
                    disabled={deleting === chip.value}
                    // Jangan memulai drag dari tombol hapus.
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => void handleDeleteCategory(chip)}
                    className={[
                      'absolute top-1 right-1 grid size-5 cursor-pointer place-items-center rounded-full transition-colors disabled:opacity-50',
                      active
                        ? 'text-white/70 hover:bg-white/20 hover:text-white'
                        : 'text-bark/60 hover:bg-danger-soft hover:text-danger',
                    ].join(' ')}
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                )}
              </div>
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

        {error && (
          <p
            role="alert"
            className="w-full rounded-lg bg-danger-soft px-3 py-2 text-[13px] text-danger"
          >
            {error}
          </p>
        )}
      </section>

      {confirmChip && (
        <CategoryDeleteModal
          chip={confirmChip}
          categories={categories}
          onClose={() => setConfirmChip(null)}
          onConfirm={confirmDeleteCategory}
        />
      )}
    </>
  )
}
