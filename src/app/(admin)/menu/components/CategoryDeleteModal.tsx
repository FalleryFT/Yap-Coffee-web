'use client'

import { AlertTriangle, Info, Trash2, X } from 'lucide-react'
import { useCallback, useId, useState } from 'react'
import { Modal } from '@/app/components/Modal'
import { labelCls } from '@/constants/menu'
import { toApiError } from '@/lib/apiError'
import type { CategoryChip } from '@/types/menu'

/** Tujuan khusus: menu dilepas dari kategori (tetap tampil di filter "Semua"). */
const SEMUA_CHIP: CategoryChip = { value: 'semua', label: 'Semua', count: 0 }

interface CategoryDeleteModalProps {
  chip: CategoryChip
  /** Semua chip kategori; dipakai sebagai pilihan tujuan pemindahan menu. */
  categories: CategoryChip[]
  onClose: () => void
  /** Dipanggil hanya saat admin memilih "Ya"; menu dipindahkan/dilepas, bukan dihapus. */
  onConfirm: (moveTo: CategoryChip) => Promise<void>
}

export function CategoryDeleteModal({
  chip,
  categories,
  onClose,
  onConfirm,
}: CategoryDeleteModalProps) {
  const titleId = useId()
  const selectId = useId()
  const stableClose = useCallback(() => onClose(), [onClose])
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Chip "Semua" bawaan tidak punya id, jadi otomatis tidak ikut jadi tujuan.
  const targets = categories.filter((c) => c.id !== undefined && c.id !== chip.id)
  const [targetValue, setTargetValue] = useState(() => targets[0]?.value ?? SEMUA_CHIP.value)
  const target =
    targetValue === SEMUA_CHIP.value
      ? SEMUA_CHIP
      : (targets.find((c) => c.value === targetValue) ?? null)

  async function confirm() {
    if (deleting || !target) return
    setDeleting(true)
    setError(null)
    try {
      await onConfirm(target)
      onClose()
    } catch (err) {
      const apiError = toApiError(err)
      setError(Object.values(apiError.fieldErrors)[0]?.[0] ?? apiError.message)
      setDeleting(false)
    }
  }

  return (
    <Modal labelledBy={titleId} onClose={stableClose} widthClass="max-w-[460px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-peach text-danger">
            <AlertTriangle size={22} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-danger">
              Kategori Masih Dipakai
            </p>
            <h2 id={titleId} className="text-[20px] font-bold leading-tight text-espresso">
              Hapus Kategori Ini?
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="grid size-8 place-items-center rounded-lg text-mist hover:bg-sand hover:text-espresso"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <p className="text-[14px] leading-relaxed text-ink">
          Kategori <strong className="text-espresso">"{chip.label}"</strong> masih dipakai{' '}
          {chip.count} menu. Apakah Anda yakin menghapus kategori ini?
        </p>

        <div className="flex gap-3 rounded-xl border border-line bg-sand px-4 py-3 text-[13px] text-bark">
          <Info size={16} className="mt-0.5 shrink-0 text-mocha" />
          <p>
            Menu <span className="font-semibold text-espresso">tidak ikut terhapus</span>.{' '}
            {targetValue === SEMUA_CHIP.value
              ? `${chip.count} menu akan dilepas dari kategori ini dan tetap tampil di filter Semua.`
              : `${chip.count} menu akan dipindahkan ke kategori ${target?.label ?? ''}.`}
          </p>
        </div>

        <div>
          <label htmlFor={selectId} className={labelCls}>
            Pindahkan menu ke
          </label>
          <select
            id={selectId}
            value={targetValue}
            onChange={(event) => setTargetValue(event.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-sand px-3 text-[14px] text-ink outline-none focus:ring-2 focus:ring-mocha/30"
          >
            {targets.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
            <option value={SEMUA_CHIP.value}>Semua (tanpa kategori)</option>
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-danger-soft px-4 py-3 text-[13px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          className="rounded-lg bg-sand px-6 py-2.5 text-[14px] font-medium text-ink hover:bg-line disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => void confirm()}
          disabled={deleting || !target}
          className="flex items-center gap-2 rounded-lg bg-danger px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-red-800 disabled:opacity-50"
        >
          <Trash2 size={16} />
          {deleting ? 'Menghapus…' : 'Ya, Hapus Kategori'}
        </button>
      </div>
    </Modal>
  )
}
