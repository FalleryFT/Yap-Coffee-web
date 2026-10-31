'use client'

import { useCallback } from 'react'
import { Modal } from '@/app/components/Modal'
import type { MenuItem } from '@/types/admin'
import { useMenuForm } from '@/hooks/menu/useMenuForm'
import type { MenuFormMode } from '@/types/menu'
import { AddCategoryStock, AddPrice } from './form/AddFields'
import { AddonsEditor } from './form/AddonsEditor'
import { AvailabilityToggle, EditPriceStock } from './form/EditFields'
import { MenuFormFooter } from './form/MenuFormFooter'
import { MenuFormHeader } from './form/MenuFormHeader'
import { DescField, NameField } from './form/NameDescFields'
import { PhotoAdd } from './form/PhotoAdd'
import { PhotoEdit } from './form/PhotoEdit'

interface MenuFormModalProps {
  mode: MenuFormMode
  /** item yang sedang di-edit (harus ada saat mode='edit') */
  item?: MenuItem
  onClose: () => void
  onSave: (data: Partial<MenuItem>) => void
}

export function MenuFormModal({ mode, item, onClose, onSave }: MenuFormModalProps) {
  const stableClose = useCallback(() => onClose(), [onClose])
  const form = useMenuForm(mode, item, onSave, onClose)
  const { isEdit } = form

  return (
    <Modal
      labelledBy={form.titleId}
      onClose={stableClose}
      widthClass={isEdit ? 'max-w-[560px]' : 'max-w-[480px]'}
    >
      <MenuFormHeader titleId={form.titleId} isEdit={isEdit} skuLabel={form.skuLabel} onClose={onClose} />

      <div className="space-y-5">
        {isEdit ? <PhotoEdit form={form} /> : <PhotoAdd form={form} />}
        <NameField form={form} />
        <DescField form={form} />

        {!isEdit && <AddCategoryStock form={form} />}
        {isEdit ? <EditPriceStock form={form} /> : <AddPrice form={form} />}

        {isEdit && <AvailabilityToggle form={form} />}
        {isEdit && <AddonsEditor form={form} />}

        {isEdit && (
          <div className="rounded-xl border border-peach bg-peach/60 px-4 py-3 text-[13px] text-mocha">
            ℹ Perubahan menu akan langsung diperbarui di portal pemesanan pelanggan untuk sesi pre-order
            berikutnya secara otomatis.
          </div>
        )}
      </div>

      <MenuFormFooter isEdit={isEdit} canSave={Boolean(form.name)} onClose={onClose} onSave={form.handleSave} />
    </Modal>
  )
}
