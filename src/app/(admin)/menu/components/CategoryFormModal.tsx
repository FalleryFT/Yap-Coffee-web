'use client'

import { useCallback, useId, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Modal } from '@/app/components/Modal'
import { inputCls, labelCls } from '@/constants/menu'
import { toApiError } from '@/lib/apiError'

const NAME_MAX = 64

interface CategoryFormModalProps {
  /** Nama yang sudah ada, untuk pengecekan duplikat sebelum dikirim ke server. */
  existing: string[]
  onClose: () => void
  onSave: (name: string, hasOptions: boolean) => Promise<void>
}

export function CategoryFormModal({ existing, onClose, onSave }: CategoryFormModalProps) {
  const titleId = useId()
  const stableClose = useCallback(() => onClose(), [onClose])
  const [name, setName] = useState('')
  // Minuman: pelanggan memilih ukuran dan tingkat manis. Makanan: tanpa pilihan.
  const [hasOptions, setHasOptions] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmed = name.trim()

  async function handleSave() {
    if (!trimmed || saving) return
    if (existing.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError('Kategori ini sudah ada.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(trimmed, hasOptions)
      onClose()
    } catch (err) {
      const apiError = toApiError(err)
      setError(Object.values(apiError.fieldErrors)[0]?.[0] ?? apiError.message)
      setSaving(false)
    }
  }

  return (
    <Modal labelledBy={titleId} onClose={stableClose} widthClass="max-w-[420px]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-xl font-bold text-espresso">
            Tambah Kategori
          </h2>
          <p className="mt-1 text-[13px] text-bark">
            Kategori baru langsung muncul sebagai filter dan pilihan saat menambah menu.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-bark hover:bg-sand"
        >
          <X size={18} />
        </button>
      </div>

      <div>
        <label htmlFor={`${titleId}-name`} className={labelCls}>
          Nama Kategori <span className="text-danger">*</span>
        </label>
        <input
          id={`${titleId}-name`}
          autoFocus
          value={name}
          maxLength={NAME_MAX}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleSave()
          }}
          placeholder="Contoh: Roti & Pastry"
          className={inputCls}
        />
        <p className="mt-1.5 text-right text-[12px] text-bark">
          {name.length} / {NAME_MAX} karakter
        </p>
      </div>

      <fieldset className="mt-4">
        <legend className={labelCls}>Jenis Kategori</legend>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: true, title: 'Minuman', hint: 'Pelanggan memilih ukuran dan tingkat manis' },
            { value: false, title: 'Makanan', hint: 'Tanpa pilihan ukuran dan manis' },
          ].map((option) => (
            <label
              key={option.title}
              className={`flex cursor-pointer flex-col gap-0.5 rounded-lg border px-3 py-2.5 ${
                hasOptions === option.value ? 'border-espresso bg-peach/40' : 'border-line bg-white hover:bg-sand'
              }`}
            >
              <span className="flex items-center gap-2 text-[14px] font-semibold text-espresso">
                <input
                  type="radio"
                  name={`${titleId}-type`}
                  checked={hasOptions === option.value}
                  onChange={() => setHasOptions(option.value)}
                />
                {option.title}
              </span>
              <span className="text-[12px] text-bark">{option.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-danger-soft px-4 py-3 text-[13px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-sand px-5 py-2.5 text-[14px] font-medium text-ink hover:bg-line"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={!trimmed || saving}
          className="flex items-center gap-2 rounded-lg bg-espresso px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-espresso/90 disabled:opacity-50"
        >
          <Check size={16} />
          {saving ? 'Menyimpan…' : 'Simpan Kategori'}
        </button>
      </div>
    </Modal>
  )
}
