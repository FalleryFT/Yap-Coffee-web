import { Download, Printer } from 'lucide-react'

export function HistoryHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[32px] font-bold leading-tight text-espresso">
          Riwayat Pembelian &amp; Laporan Transaksi
        </h1>
        <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-bark">
          Arsip lengkap seluruh transaksi pre-order yang telah selesai diseduh dan diambil oleh tetangga
          serta pelanggan setia Warung Senopati.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 rounded-xl bg-sand px-5 py-3 text-[14px] font-semibold text-ink hover:bg-line">
          <Download size={16} />Unduh Laporan CSV / Excel
        </button>
        <button
          aria-label="Cetak"
          onClick={() => window.print()}
          className="grid size-12 place-items-center rounded-xl bg-sand text-espresso hover:bg-line"
        >
          <Printer size={18} />
        </button>
      </div>
    </div>
  )
}
