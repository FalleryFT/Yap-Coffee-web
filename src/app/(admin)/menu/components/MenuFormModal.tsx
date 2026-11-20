'use client'

import { useCallback } from 'react'
import { Modal } from '@/app/components/Modal'
import type { MenuItem } from '@/types/admin'
import { useMenuForm } from '@/hooks/menu/useMenuForm'
import type { MenuFormMode } from '@/types/menu'
import { AddCategoryStockPrice } from './form/AddFields'
import { AddonsEditor } from './form/AddonsEditor'
import { AvailabilityToggle } from './form/EditFields'
import { MenuFormFooter } from './form/MenuFormFooter'
import { MenuFormHeader } from './form/MenuFormHeader'
import { DescField, NameField } from './form/NameDescFields'
import { PhotoAdd } from './form/PhotoAdd'

interface MenuFormModalProps {
  mode: MenuFormMode
  /** item yang sedang di-edit (harus ada saat mode='edit') */
  item?: MenuItem
  onClose: () => void
  onSave: (data: Partial<MenuItem>) => Promise<void>
  /** Nama kategori yang bisa dipilih di form. */
  categories: string[]
}

export function MenuFormModal({ mode, item, onClose, onSave, categories }: MenuFormModalProps) {
  const stableClose = useCallback(() => onClose(), [onClose])
  const form = useMenuForm(mode, item, onSave, onClose, categories)
  const { isEdit } = form

  return (
    <Modal
      labelledBy={form.titleId}
      onClose={stableClose}
      widthClass="max-w-[760px]"
    >
      <MenuFormHeader titleId={form.titleId} isEdit={isEdit} skuLabel={form.skuLabel} onClose={onClose} />

      <div className="space-y-5">
        {/* Layout sama untuk Tambah & Edit: foto di kiri, nama + deskripsi di kanan */}
        <div className="flex flex-col gap-5 sm:flex-row">
          <PhotoAdd form={form} />
          <div className="min-w-0 flex-1 space-y-4">
            <NameField form={form} />
            <DescField form={form} />
          </div>
        </div>
        <AddCategoryStockPrice form={form} />

        {/* Pilihan Modifikasi & Varian: tampil di mode Tambah dan Edit dengan tata letak sama */}
        <AddonsEditor form={form} />

        <AvailabilityToggle form={form} />

        {/* Info perubahan menu: di bawah toggle Tersedia di Katalog Pre-Order */}
        {isEdit && (
          <div className="rounded-xl border border-peach bg-peach/60 px-4 py-3 text-[13px] text-mocha">
            ℹ Perubahan menu akan langsung diperbarui di portal pemesanan pelanggan untuk sesi pre-order
            berikutnya secara otomatis.
          </div>
        )}
      </div>

      {form.error && (
        <p role="alert" className="mt-4 rounded-lg bg-danger-soft px-4 py-3 text-[13px] text-danger">
          {form.error}
        </p>
      )}

      <MenuFormFooter isEdit={isEdit} canSave={Boolean(form.name) && Boolean(form.category) && form.price > 0 && !form.saving} onClose={onClose} onSave={form.handleSave} />
    </Modal>
  )
}