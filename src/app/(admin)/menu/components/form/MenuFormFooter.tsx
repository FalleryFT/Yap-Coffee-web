import { Check } from 'lucide-react'

interface Props {
  isEdit: boolean
  canSave: boolean
  onClose: () => void
  onSave: () => void
}

export function MenuFormFooter({ isEdit, canSave, onClose, onSave }: Props) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
      {isEdit ? <p className="text-[12px] text-olive">● Mode Admin Aktif</p> : <div />}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-sand px-5 py-2.5 text-[14px] font-medium text-ink hover:bg-line"
        >
          Batal
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="flex items-center gap-2 rounded-lg bg-espresso px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-espresso/90 disabled:opacity-50"
        >
          <Check size={16} />
          {isEdit ? 'Simpan Perubahan' : 'Simpan Racikan'}
        </button>
      </div>
    </div>
  )
}
