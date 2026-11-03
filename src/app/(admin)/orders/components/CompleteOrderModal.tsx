import { CheckCircle2, Lock } from 'lucide-react'
import { useId } from 'react'
import { Modal } from '@/app/components/Modal'
import type { Order } from '@/types/orders'
import { Btn } from './ui'

interface Props {
  order: Order
  submitting: boolean
  error: string | null
  onClose: () => void
  onConfirm: () => void
}

export function CompleteOrderModal({ order, submitting, error, onClose, onConfirm }: Props) {
  const titleId = useId()

  return (
    <Modal labelledBy={titleId} onClose={onClose} widthClass="max-w-[426px]">
      <div>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-[#e8ecd8] text-olive">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <h2 id={titleId} className="text-[20px] font-bold leading-tight text-espresso">
              Tandai Pesanan Selesai
            </h2>
            <div className="text-[12px] text-bark">{order.code} - {order.name}</div>
          </div>
        </div>

        <p className="mt-5 text-[14px] leading-relaxed text-ink">
          Pastikan pesanan sudah diambil pelanggan. Setelah ditandai selesai, status pesanan{' '}
          <b>tidak dapat diubah lagi</b>.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-[13px] text-danger">{error}</p>
        )}

        <div className="mt-5 flex justify-end gap-3 border-t border-line pt-5">
          <Btn variant="ghost" onClick={onClose} disabled={submitting}>Kembali</Btn>
          <Btn
            onClick={onConfirm}
            disabled={submitting}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Lock size={15} />{submitting ? 'Menyimpan…' : 'Ya, Tandai Selesai'}
          </Btn>
        </div>
      </div>
    </Modal>
  )
}
