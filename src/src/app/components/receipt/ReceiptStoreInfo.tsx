import type { ReceiptData } from '@/types/receipt'
import { formatTransactionTime, initials } from '@/utils/receipt'

export function ReceiptStoreInfo({ r }: { r: ReceiptData }) {
  return (
    <>
      {/* logo */}
      <div className="mx-auto h-[88px] w-[88px] overflow-hidden rounded-xl border border-[#e6e1d8] bg-white">
        {/* Taruh file logo di public/wokee-logo.png */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/wokee-logo.jpeg" alt="Wokee dana masuk boskyuh" className="h-full w-full object-cover" />
      </div>

      {/* identitas toko */}
      <div className="mt-5 text-center">
        <h2 className="text-[22px] font-bold text-[#4a2a10]">{r.store.name}</h2>
        <p className="mt-1.5 text-sm font-semibold">{r.store.branch}</p>
        <p className="mt-0.5 text-xs text-[#6f6559]">{r.store.address}</p>
        <p className="mt-0.5 text-xs text-[#8a8073]">WhatsApp Hotline: {r.store.whatsapp}</p>
      </div>

      <hr className="my-4 border-t border-dashed border-[#d9d3c8]" />

      {/* nomor struk & waktu */}
      <div className="flex items-start justify-between gap-3 rounded-xl bg-[#f3f1ea] px-4 py-3.5">
        <div>
          <p className="text-[11px] tracking-wide text-[#6f6559]">NO. STRUK RESMI</p>
          <p className="mt-1 text-sm font-bold text-[#4a2a10]">#{r.receiptNo}</p>
          <p className="mt-1.5 text-[11px] text-[#8a8073]">Pre-Order: #{r.preOrderNo}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] tracking-wide text-[#6f6559]">WAKTU TRANSAKSI</p>
          <p className="mt-1 text-sm font-semibold">{formatTransactionTime(r.transactionAt)}</p>
        </div>
      </div>

      {/* pelanggan */}
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#eeece6] px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ecd9c6] text-xs font-bold text-[#4a2a10]">
          {initials(r.customer.name)}
        </span>
        <div>
          <p className="text-sm font-semibold">{r.customer.name}</p>
          <p className="text-[11px] text-[#6f6559]">{r.customer.phone}</p>
        </div>
      </div>
    </>
  )
}
