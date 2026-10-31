import { Coffee, X } from 'lucide-react'

interface Props {
  titleId: string
  isEdit: boolean
  skuLabel: string
  onClose: () => void
}

export function MenuFormHeader({ titleId, isEdit, skuLabel, onClose }: Props) {
  return (
    <div className="flex items-start justify-between pb-5">
      <div className="flex items-start gap-3">
        {isEdit && (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand text-espresso">
            <Coffee size={20} />
          </span>
        )}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-mocha">
            {isEdit ? 'Edit Menu Racikan' : 'Formulir Produk'}
          </p>
          <h2 id={titleId} className="mt-0.5 text-[22px] font-bold text-espresso">
            {isEdit ? (
              <span className="flex items-center gap-2">
                Edit Menu Racikan
                <span className="rounded bg-peach px-2 py-0.5 text-[12px] font-semibold text-mocha">
                  {skuLabel}
                </span>
              </span>
            ) : (
              'Tambah Menu Baru'
            )}
          </h2>
          {isEdit && (
            <p className="mt-1 text-[12px] text-bark">
              Perbarui informasi resep, harga jual, foto produk, dan stok harian katalog.
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className="grid size-8 place-items-center rounded-lg text-mist hover:bg-sand hover:text-espresso"
        aria-label="Tutup"
      >
        <X size={18} />
      </button>
    </div>
  )
}
