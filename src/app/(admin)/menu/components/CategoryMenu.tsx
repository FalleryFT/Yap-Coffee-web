  'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Plus, Tag, Trash2, X } from 'lucide-react'
import { toApiError } from '@/lib/apiError'
import type { MenuCategory } from '@/types/admin'
import type { CategoryChip } from '@/types/menu'
import { CategoryDeleteModal } from './CategoryDeleteModal'

interface CategoryMenuProps {
  categories: CategoryChip[]
  category: MenuCategory | 'semua'
  onCategoryChange: (value: MenuCategory | 'semua') => void
  onAddCategory: () => void
  onDeleteCategory: (chip: CategoryChip, moveTo?: CategoryChip) => Promise<void>
}

export function CategoryMenu({
  categories,
  category,
  onCategoryChange,
  onAddCategory,
  onDeleteCategory,
}: CategoryMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmChip, setConfirmChip] = useState<CategoryChip | null>(null)

  // Tutup dropdown saat klik di luar atau tekan Escape.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function close() {
    setOpen(false)
    setDeleteMode(false)
    setError(null)
  }

  async function handleDelete(chip: CategoryChip) {
    if (deleting) return
    setDeleting(chip.value)
    setError(null)
    try {
      await onDeleteCategory(chip)
    } catch (err) {
      const apiError = toApiError(err)
      // Kategori masih dipakai menu → tampilkan popup konfirmasi pindah menu.
      if (apiError.status === 409) {
        setConfirmChip(chip)
        close()
      } else {
        setError(Object.values(apiError.fieldErrors)[0]?.[0] ?? apiError.message)
      }
    } finally {
      setDeleting(null)
    }
  }

  async function confirmDelete(moveTo: CategoryChip) {
    if (!confirmChip) return
    await onDeleteCategory(confirmChip, moveTo)
  }

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => (open ? close() : setOpen(true))}
          className="flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-5 text-sm font-semibold text-espresso shadow-card hover:bg-sand"
        >
          <Tag size={18} />
          Kategori
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-xl border border-line bg-white shadow-card"
          >
            <p className="px-4 pt-3 pb-2 text-xs font-semibold tracking-wide text-mocha uppercase">
              {deleteMode ? 'Pilih kategori yang dihapus' : 'Semua Kategori'}
            </p>

            <ul className="max-h-64 overflow-y-auto px-2 pb-2">
              {categories.map((chip) => {
                const active = chip.value === category
                const removable = chip.value !== 'semua'
                return (
                  <li key={chip.value}>
                    {deleteMode ? (
                      removable && (
                        <button
                          type="button"
                          role="menuitem"
                          disabled={deleting === chip.value}
                          onClick={() => void handleDelete(chip)}
                          className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-espresso hover:bg-danger-soft hover:text-danger disabled:opacity-50"
                        >
                          <span className="truncate">
                            {chip.label} ({chip.count})
                          </span>
                          <Trash2 size={16} className="shrink-0" />
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          onCategoryChange(chip.value)
                          close()
                        }}
                        className={[
                          'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm',
                          active
                            ? 'bg-espresso text-white'
                            : 'text-espresso hover:bg-sand',
                        ].join(' ')}
                      >
                        <span className="truncate">
                          {chip.label} ({chip.count})
                        </span>
                        {active && <Check size={16} className="shrink-0" />}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>

            {error && (
              <p role="alert" className="mx-3 mb-2 rounded-lg bg-danger-soft px-3 py-2 text-[13px] text-danger">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-1 border-t border-line p-2">
              {deleteMode ? (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteMode(false)
                    setError(null)
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-bark hover:bg-sand"
                >
                  <X size={16} />
                  Selesai
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      close()
                      onAddCategory()
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-mocha hover:bg-sand"
                  >
                    <Plus size={16} />
                    Tambah Kategori
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={categories.length <= 1}
                    onClick={() => setDeleteMode(true)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-danger-soft disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <Trash2 size={16} />
                    Hapus Kategori
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {confirmChip && (
        <CategoryDeleteModal
          chip={confirmChip}
          categories={categories}
          onClose={() => setConfirmChip(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  )
}