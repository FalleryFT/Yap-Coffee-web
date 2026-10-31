import { AlertTriangle, ChevronDown, XCircle } from 'lucide-react'
import { useId } from 'react'
import { Modal } from '@/app/components/Modal'
import { reasons } from '@/constants/orders'
import type { Order } from '@/types/orders'
import { Btn } from './ui'

interface Props {
  order: Order
  reason: string
  onReason: (reason: string) => void
  extra: string
  onExtra: (extra: string) => void
  onClose: () => void
  onConfirm: () => void
}

export function CancelOrderModal({ order, reason, onReason, extra, onExtra, onClose, onConfirm }: Props) {
  const titleId = useId()

  return (
    <Modal labelledBy={titleId} onClose={onClose} widthClass="max-w-[426px]">
      <div>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-peach text-danger">
            <AlertTriangle size={20} />
          </span>
          <div>
            <h2 id={titleId} className="text-[20px] font-bold leading-tight text-danger">
              Batalkan Pesanan
            </h2>
            <div className="text-[12px] text-bark">{order.code} - {order.name}</div>
          </div>
        </div>

        <p className="mt-5 text-[14px] leading-relaxed text-ink">
          Tindakan ini akan membatalkan status pre-order pelanggan. Dana QRIS akan otomatis diajukan
          pengembalian (Auto-Refund) ke sumber dompet pelanggan.
        </p>

        <div className="mt-5">
          <div className="mb-2 text-[14px] font-medium text-ink">Alasan Pembatalan:</div>
          <div className="relative">
            <select
              value={reason}
              onChange={(e) => onReason(e.target.value)}
              className="h-12 w-full appearance-none rounded-lg bg-sand px-4 text-[14px] outline-none"
            >
              {reasons.map((r) => <option key={r}>{r}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-4 top-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-[12px] text-bark">Catatan Tambahan untuk Kasir/Pelanggan:</div>
          <input
            value={extra}
            onChange={(e) => onExtra(e.target.value)}
            placeholder="Contoh: Stok Oatmilk habis, pelanggan setuju cancel"
            className="h-12 w-full rounded-lg bg-sand px-4 text-[14px] outline-none placeholder:text-mist"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3 border-t border-line pt-5">
          <Btn variant="ghost" onClick={onClose}>Kembali</Btn>
          <Btn variant="danger" onClick={onConfirm}>
            <XCircle size={15} />Ya, Batalkan &amp; Refund
          </Btn>
        </div>
      </div>
    </Modal>
  )
}
