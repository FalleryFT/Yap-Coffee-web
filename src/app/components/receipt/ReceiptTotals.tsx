import { QrCode } from 'lucide-react'
import type { ReceiptData } from '@/types/receipt'
import { rupiah } from '@/utils/receipt'

export function ReceiptTotals({ r }: { r: ReceiptData }) {
  return (
    <>
      {/* rincian biaya */}
      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-[#4f453a]">Subtotal Produk &amp; Modifikasi</dt>
          <dd className="font-bold">{rupiah(r.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#4f453a]">Kemasan Ramah Lingkungan (Paper Bag)</dt>
          <dd className="font-semibold text-[#6b7a3a]">
            {r.packagingFee === 0 ? 'Gratis (Rp 0)' : rupiah(r.packagingFee)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#4f453a]">PB1 UMKM &amp; Service Fee</dt>
          <dd className="font-semibold">{r.serviceFee === 0 ? 'Termasuk (Rp 0)' : rupiah(r.serviceFee)}</dd>
        </div>
      </dl>

      <hr className="my-4 border-t border-[#e6e1d8]" />

      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-[#4f453a]">TOTAL PEMBAYARAN</p>
          <p className="mt-0.5 text-[11px] font-semibold text-[#6b7a3a]">Status: {r.paymentStatus}</p>
        </div>
        <p className="text-3xl font-extrabold text-[#4a2a10]">{rupiah(r.total)}</p>
      </div>

      {/* info pembayaran */}
      <dl className="mt-5 space-y-2.5 rounded-xl bg-[#eeece6] px-4 py-4 text-[13px]">
        <div className="flex justify-between gap-3">
          <dt className="text-[#5c5247]">Kanal Pembayaran</dt>
          <dd className="flex items-center gap-1.5 font-bold">
            <QrCode size={14} />
            {r.payment.channel}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#5c5247]">Nomor Referensi (RRN)</dt>
          <dd className="font-mono text-xs">{r.payment.rrn}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#5c5247]">Lokasi &amp; Slot Ambil</dt>
          <dd className="font-bold">{r.payment.pickupSlot}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#5c5247]">Penyerahan Fisik</dt>
          <dd className="font-semibold text-[#6b7a3a]">{r.payment.handover}</dd>
        </div>
      </dl>
    </>
  )
}
