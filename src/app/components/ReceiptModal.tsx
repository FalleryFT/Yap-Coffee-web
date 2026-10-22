'use client'

import { useEffect } from 'react'
import { NotebookPen, QrCode, X } from 'lucide-react'
import { formatNumber } from '@/lib/format'

/* ---------- Tipe data ---------- */

export type ReceiptLine = {
  label: string
  value: string
  extra?: number // biaya tambahan, mis. 8000
}

export type ReceiptItem = {
  qty: number
  name: string
  unitPrice: number
  lines: ReceiptLine[]
}

export type ReceiptData = {
  store: { name: string; branch: string; address: string; whatsapp: string }
  receiptNo: string
  preOrderNo: string
  transactionAt: string // "2024-10-24T09:15:00"
  customer: { name: string; phone: string }
  items: ReceiptItem[]
  baristaNote?: string
  subtotal: number
  packagingFee: number
  serviceFee: number
  total: number
  paymentStatus: string // "Lunas via QRIS"
  payment: {
    channel: string
    rrn: string
    pickupSlot: string
    handover: string
  }
}

/* ---------- Helper ---------- */

const rupiah = (value: number) => `Rp ${formatNumber(value)}`

function formatTransactionTime(iso: string): string {
  const d = new Date(iso)
  const date = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${date} • ${hh}:${mm}` 
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

/* ---------- Komponen ---------- */

type ReceiptModalProps = {
  receipt: ReceiptData | null
  onClose: () => void
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const open = receipt !== null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!receipt) return null

  const r = receipt

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1a0c]/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Struk ${r.receiptNo}`}
        className="relative max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-[20px] bg-white text-[#3b2a1c] shadow-[0_24px_60px_-12px_rgba(74,42,16,0.35)]"
      >
        {/* aksen atas */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#6b4a2e] to-[#ecd9c6]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup struk"
          className="absolute right-5 top-6 rounded-md p-1 text-[#4a3526] transition hover:bg-[#f3f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6b4a2e]"
        >
          <X size={18} />
        </button>

        <div className="px-6 pb-6 pt-5">
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

          {/* item */}
          <div className="mt-5 flex items-center justify-between border-b border-[#e6e1d8] pb-2 text-[11px] tracking-wide text-[#6f6559]">
            <span>ITEM &amp; KUSTOMISASI</span>
            <span>JUMLAH</span>
          </div>

          {r.items.map((item, i) => (
            <div key={i} className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold">
                  {item.qty}× <span className="ml-0.5 font-semibold">{item.name}</span>
                </p>
                <ul className="mt-1.5 space-y-1 text-xs text-[#5c5247]">
                  {item.lines.map((line, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#4a3526]" />
                      <span>
                        {line.label}: {line.value}
                        {line.extra ? <strong className="text-[#3b2a1c]"> +{rupiah(line.extra)}</strong> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-[#4a2a10]">{rupiah(item.qty * item.unitPrice)}</p>
                <p className="mt-0.5 text-[11px] text-[#8a8073]">@ {rupiah(item.unitPrice)}</p>
              </div>
            </div>
          ))}

          {/* catatan barista */}
          {r.baristaNote ? (
            <div className="mt-4 flex gap-2.5 rounded-xl bg-[#f3f1ea] px-3.5 py-3 text-xs leading-relaxed">
              <NotebookPen size={14} className="mt-0.5 shrink-0 text-[#6f6559]" />
              <p>
                <strong>Catatan Barista:</strong> <em>“{r.baristaNote}”</em>
              </p>
            </div>
          ) : null}

          <hr className="my-5 border-t border-dashed border-[#d9d3c8]" />

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
        </div>
      </div>
    </div>
  )
}
