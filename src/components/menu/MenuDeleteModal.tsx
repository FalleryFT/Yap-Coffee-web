import { AlertTriangle, Coffee, Cookie, Info, Trash2, X } from 'lucide-react'
import { useCallback, useId } from 'react'
import { Modal } from '../Modal'
import { formatNumber } from '../../lib/format'
import { getStockStatus } from '../../lib/menu'
import type { MenuItem } from '../../types/admin'

interface MenuDeleteModalProps {
  item: MenuItem
  onClose: () => void
  onConfirm: (item: MenuItem) => void
}

const stockLabel: Record<string, string> = {
  tersedia: 'Tersedia',
  menipis: 'Menipis',
  habis: 'Habis',
}

export function MenuDeleteModal({ item, onClose, onConfirm }: MenuDeleteModalProps) {
  const titleId = useId()
  const stableClose = useCallback(() => onClose(), [onClose])
  const status = getStockStatus(item.stock)
  const PlaceholderIcon = item.category === 'Makanan Ringan' ? Cookie : Coffee

  return (
    <Modal labelledBy={titleId} onClose={stableClose} widthClass="max-w-[440px]">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-peach text-danger">
            <AlertTriangle size={22} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-danger">
              Aksi Destruktif
            </p>
            <h2 id={titleId} className="text-[20px] font-bold leading-tight text-espresso">
              Hapus Menu Ini dari Katalog?
            </h2>
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

      {/* ── Body ── */}
      <div className="mt-5 space-y-4">
        <p className="text-[14px] leading-relaxed text-ink">
          Apakah Anda yakin ingin menghapus{' '}
          <strong className="text-espresso">"{item.name}"</strong>? Menu ini tidak akan lagi muncul
          di etalase katalog maupun sesi pre-order aktif mendatang. Tindakan ini{' '}
          <span className="font-semibold text-danger">tidak dapat dibatalkan.</span>
        </p>

        {/* Menu preview card */}
        <div className="flex items-center gap-4 rounded-xl border border-line bg-sand p-4">
          <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
            {item.image ? (
              <img src={item.image} alt={item.name} className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center text-mist">
                <PlaceholderIcon size={22} strokeWidth={1.5} />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[12px] text-bark">
              <span>{item.category}</span>
              <span>•</span>
              <span className="font-semibold text-espresso">Rp {formatNumber(item.price)}</span>
            </div>
            <p className="mt-0.5 truncate font-bold text-espresso">{item.name}</p>
            <div className="mt-1 flex items-center gap-1.5 text-[12px]">
              <span
                className={`size-2 rounded-full ${status === 'tersedia' ? 'bg-olive' : status === 'menipis' ? 'bg-mocha' : 'bg-danger'}`}
              />
              <span className="text-bark">
                {stockLabel[status]} • Sisa {item.stock} cup
              </span>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="flex gap-3 rounded-xl border border-line bg-sand px-4 py-3 text-[13px] text-bark">
          <Info size={16} className="mt-0.5 shrink-0 text-mocha" />
          <p>
            Pesanan aktif yang sudah dibayar oleh pelanggan sebelum jadwal penghapusan ini tetap
            wajib disiapkan dan diproses oleh barista.
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
        <button
          onClick={onClose}
          className="rounded-lg bg-sand px-6 py-2.5 text-[14px] font-medium text-ink hover:bg-line"
        >
          Batal
        </button>
        <button
          onClick={() => { onConfirm(item); onClose() }}
          className="flex items-center gap-2 rounded-lg bg-danger px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-red-800"
        >
          <Trash2 size={16} />
          Ya, Hapus Menu
        </button>
      </div>
    </Modal>
  )
}
