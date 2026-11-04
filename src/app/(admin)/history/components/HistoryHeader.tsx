'use client'

import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2, Printer } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toApiError } from '@/lib/apiError'
import { downloadHistoryExport, type ExportFormat } from '@/services/historyService'
import type { StatusFilter } from '@/types/history'

interface Props {
  // Filter yang sedang aktif di tabel; laporan berisi semua baris yang cocok, bukan satu halaman.
  status: StatusFilter
  month: string
  q: string
}

const formats: { value: ExportFormat; label: string; hint: string; icon: typeof FileText }[] = [
  { value: 'xlsx', label: 'Excel (.xlsx)', hint: 'Lembar kerja dengan filter kolom', icon: FileSpreadsheet },
  { value: 'csv', label: 'CSV (.csv)', hint: 'Teks, pemisah titik koma', icon: FileText },
]

export function HistoryHeader({ status, month, q }: Props) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Tutup menu saat klik di luar atau menekan Esc.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function download(format: ExportFormat) {
    setOpen(false)
    setBusy(true)
    setError(null)
    try {
      const blob = await downloadHistoryExport({ status, month, q: q.trim() || undefined, format })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `riwayat-transaksi-${month}-${status}.${format}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(toApiError(err).message)
    } finally {
      setBusy(false)
    }
  }

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

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              disabled={busy}
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl bg-sand px-5 py-3 text-[14px] font-semibold text-ink hover:bg-line disabled:cursor-wait disabled:opacity-70"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {busy ? 'Menyiapkan laporan...' : 'Unduh Laporan CSV / Excel'}
              <ChevronDown size={14} />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-card"
              >
                {formats.map(({ value, label, hint, icon: Icon }) => (
                  <button
                    key={value}
                    role="menuitem"
                    type="button"
                    onClick={() => download(value)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-sand"
                  >
                    <Icon size={18} className="mt-0.5 shrink-0 text-bark" />
                    <span>
                      <span className="block text-[14px] font-semibold text-ink">{label}</span>
                      <span className="block text-[12px] text-bark">{hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            aria-label="Cetak"
            onClick={() => window.print()}
            className="grid size-12 place-items-center rounded-xl bg-sand text-espresso hover:bg-line"
          >
            <Printer size={18} />
          </button>
        </div>

        {error && (
          <p role="alert" className="max-w-[320px] text-right text-[12px] text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
