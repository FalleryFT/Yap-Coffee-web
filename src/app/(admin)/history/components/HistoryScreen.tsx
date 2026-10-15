'use client'

import {
  Banknote,
  CheckCircle2,
  Coffee,
  Download,
  FileText,
  MessageSquare,
  Printer,
  QrCode,
  ReceiptText,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TrendingDown,
  XCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FilterDropdown } from './FilterDropdown'
import type { DropdownOption } from './FilterDropdown'
import { MonthYearPicker, formatMonthLabel } from './MonthYearPicker'
import { MonthlyRevenueCard } from './MonthlyRevenueCard'

// ─── Types ────────────────────────────────────────────────────────────────────
type HistoryStatus = 'selesai' | 'batal'
type StatusFilter = HistoryStatus | 'semua'

interface HistoryRow {
  id: string
  date: string // 'YYYY-MM-DD'
  time: string
  name: string
  ini: string
  tone: string
  ph: string
  item: string
  mod: string
  spot: string
  total: string
  pay: string
  status: HistoryStatus
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const rawRows: HistoryRow[] = [
  { id: '9024', date: '2024-10-24', time: '09:15', name: 'Siti Nurhaliza', ini: 'SN', tone: 'bg-peach text-mocha', ph: '0813-2299-4411', item: '2x Es Kopi Susu Tetangga Gula Aren', mod: 'Less Sugar 50%, Oatmilk Swap', spot: 'Bar Senopati 01', total: '52.000', pay: 'QRIS Instan', status: 'selesai' },
  { id: '9023', date: '2024-10-24', time: '09:02', name: 'Bramantyo Putro', ini: 'BP', tone: 'bg-honey text-mocha', ph: '0857-1900-8833', item: '1x Hot Americano Double Shot + Butter Croissant', mod: 'Extra Hot, Pastry Dihangatkan', spot: 'Drop Box Gazebo Tengah', total: '48.000', pay: 'Tunai Kasir', status: 'selesai' },
  { id: '9022', date: '2024-10-24', time: '08:58', name: 'Rizky Aditya', ini: 'RA', tone: 'bg-peach text-mocha', ph: '0856-7712-3300', item: '2x Iced Americano', mod: 'Less Ice', spot: 'Bar Senopati 01', total: '36.000', pay: 'QRIS Instan', status: 'batal' },
  { id: '9021', date: '2024-10-24', time: '08:44', name: 'Dian Lestari', ini: 'DL', tone: 'bg-[#e8ecd8] text-olive', ph: '0812-9901-2345', item: '1x Iced Matcha Latte Tetangga', mod: 'Normal Sweet, Extra Ice', spot: 'Drive-thru Tetangga Express', total: '28.000', pay: 'QRIS Instan', status: 'selesai' },
  { id: '9019', date: '2024-10-24', time: '08:32', name: 'Fajar Ramadhan', ini: 'FR', tone: 'bg-sand text-bark', ph: '0811-8822-7711', item: '3x Cold Brew Botol Tetangga (250ml)', mod: 'Paket Bundle Teman Kantor', spot: 'Bar Senopati 01', total: '85.000', pay: 'QRIS Instan', status: 'selesai' },
  { id: '9017', date: '2024-10-24', time: '08:20', name: 'Maya Kusuma', ini: 'MK', tone: 'bg-sand text-bark', ph: '0821-5566-1209', item: '1x Kopi Susu Pandan Wangi + Croissant Almond', mod: 'Stok croissant habis', spot: 'Drive-thru Tetangga Express', total: '46.000', pay: 'Tunai Kasir', status: 'batal' },
  { id: '9015', date: '2024-10-24', time: '08:12', name: 'Anisa Yuliani', ini: 'AY', tone: 'bg-peach text-mocha', ph: '0878-3344-9988', item: '1x Earl Grey Tea Artisan + Cinnamon Roll', mod: 'Hangat, Gula Terpisah', spot: 'Drop Box Gazebo Tengah', total: '42.000', pay: 'QRIS Instan', status: 'selesai' },
  { id: '9010', date: '2024-10-24', time: '07:50', name: 'Hendra Wijaya', ini: 'HW', tone: 'bg-honey text-mocha', ph: '0819-0128-4455', item: '2x Manual Brew V60 (Gayo Natural)', mod: 'Suhu 88°C, Notes Floral Peach', spot: 'Bar Senopati 01', total: '64.000', pay: 'Tunai Kasir', status: 'selesai' },
  { id: '9008', date: '2024-10-24', time: '07:35', name: 'Rina Marlina', ini: 'RM', tone: 'bg-[#e8ecd8] text-olive', ph: '0852-4411-9922', item: '1x Cafe Latte Panas (Soymilk Swap)', mod: 'No Sugar, Extra Foam', spot: 'Drive-thru Tetangga Express', total: '30.000', pay: 'QRIS Instan', status: 'selesai' },
  { id: '9003', date: '2024-10-24', time: '07:15', name: 'Agus Setiawan', ini: 'AS', tone: 'bg-sand text-bark', ph: '0813-7722-1100', item: '1x Kopi Tubruk Nusantara + Pisang Goreng Wijen', mod: 'Paling Awal Buka Warung', spot: 'Bar Senopati 01', total: '32.000', pay: 'Tunai Kasir', status: 'selesai' },
  { id: '8998', date: '2024-10-23', time: '16:40', name: 'Dewi Anggraini', ini: 'DA', tone: 'bg-honey text-mocha', ph: '0822-3300-1188', item: '1x Es Kopi Susu Gula Aren', mod: 'Normal Sweet', spot: 'Drop Box Gazebo Tengah', total: '20.000', pay: 'QRIS Instan', status: 'selesai' },
  { id: '8870', date: '2024-09-27', time: '09:10', name: 'Yoga Pratama', ini: 'YP', tone: 'bg-[#e8ecd8] text-olive', ph: '0815-4400-2211', item: '2x Pisang Goreng Madu Wijen', mod: 'Keju Parut', spot: 'Bar Senopati 01', total: '36.000', pay: 'QRIS Instan', status: 'selesai' },
  { id: '8861', date: '2024-09-26', time: '08:05', name: 'Laras Wati', ini: 'LW', tone: 'bg-peach text-mocha', ph: '0877-1200-9090', item: '1x V60 Gayo Winey Process', mod: 'Hot, Japanese Drip', spot: 'Bar Senopati 01', total: '30.000', pay: 'Tunai Kasir', status: 'batal' },
  { id: '8702', date: '2024-08-30', time: '07:55', name: 'Tegar Wicaksono', ini: 'TW', tone: 'bg-sand text-bark', ph: '0838-9911-4422', item: '1x Cold Brew Tetangga 250ml', mod: 'Dingin', spot: 'Drive-thru Tetangga Express', total: '35.000', pay: 'QRIS Instan', status: 'selesai' },
  { id: '8690', date: '2024-08-29', time: '12:20', name: 'Putri Ayu', ini: 'PA', tone: 'bg-honey text-mocha', ph: '0813-6677-0045', item: '1x Uji Matcha Latte', mod: 'Oat Milk', spot: 'Drop Box Gazebo Tengah', total: '31.000', pay: 'QRIS Instan', status: 'batal' },
  { id: '7410', date: '2023-12-20', time: '10:05', name: 'Bayu Setiadi', ini: 'BS', tone: 'bg-sand text-bark', ph: '0812-4455-6677', item: '2x Es Kopi Susu Gula Aren', mod: 'Less Sugar', spot: 'Bar Senopati 01', total: '40.000', pay: 'QRIS Instan', status: 'selesai' },
  { id: '7388', date: '2023-12-15', time: '08:30', name: 'Nadia Safitri', ini: 'NS', tone: 'bg-peach text-mocha', ph: '0857-2210-9981', item: '1x Cold Brew Tetangga 250ml', mod: 'Dingin', spot: 'Drive-thru Tetangga Express', total: '35.000', pay: 'Tunai Kasir', status: 'batal' },
]

// Terbaru di atas
const rows = [...rawRows].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

// ─── Konfigurasi filter ───────────────────────────────────────────────────────
const PAGE_SIZE = 8
const CURRENT_MONTH = '2024-10'
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const statusOptions: DropdownOption[] = [
  { value: 'semua', label: 'Semua Status' },
  { value: 'selesai', label: 'Selesai Diambil' },
  { value: 'batal', label: 'Dibatalkan' },
]

function shortDate(iso: string): string {
  const [y = '', m = '1', d = '1'] = iso.split('-')
  return `${Number(d)} ${MONTH_SHORT[Number(m) - 1]} ${y}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white shadow-card ${className}`}>{children}</div>
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-4 text-left text-[12px] font-bold uppercase tracking-wider text-bark ${className}`}>
      {children}
    </th>
  )
}

interface MiniStatProps {
  label: string
  icon: LucideIcon
  value: React.ReactNode
  footer: React.ReactNode
}

function MiniStat({ label, icon: Icon, value, footer }: MiniStatProps) {
  return (
    <Card className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-bark">{label}</span>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sand text-espresso">
            <Icon size={17} />
          </span>
        </div>
        <div className="whitespace-nowrap text-[26px] font-bold leading-tight text-ink">{value}</div>
      </div>
      <div className="flex items-center gap-2 bg-sand px-5 py-2.5 text-[12px] text-bark">{footer}</div>
    </Card>
  )
}

function StatusBadge({ status }: { status: HistoryStatus }) {
  if (status === 'batal') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-3 py-2 text-[12px] font-semibold text-danger">
        <XCircle size={13} />Dibatalkan
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8ecd8] px-3 py-2 text-[12px] font-semibold text-olive">
      <CheckCircle2 size={13} />Selesai Diambil
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function HistoryScreen() {
  const [q, setQ] = useState('')
  const [month, setMonth] = useState(CURRENT_MONTH) // 'YYYY-MM' | 'semua'
  const [status, setStatus] = useState<StatusFilter>('selesai')
  const [page, setPage] = useState(1)

  const shown = useMemo(() => {
    const keyword = q.toLowerCase()
    return rows.filter(
      (r) =>
        (month === 'semua' || r.date.startsWith(month)) &&
        (status === 'semua' || r.status === status) &&
        (r.id + r.name + r.item).toLowerCase().includes(keyword),
    )
  }, [q, month, status])

  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = shown.slice(start, start + PAGE_SIZE)

  const hasFilter = month !== 'semua' || status !== 'semua'
  const statusLabel = statusOptions.find((o) => o.value === status)?.label ?? ''

  const resetToDefault = () => {
    setQ('')
    setMonth(CURRENT_MONTH)
    setStatus('selesai')
    setPage(1)
  }

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Header ── */}
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

      {/* ── Grafik bulanan (kiri) + 3 kartu ringkasan (kanan) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <MonthlyRevenueCard selected={month} currentMonth={CURRENT_MONTH} />

        <div className="flex flex-col gap-4">
          <MiniStat
            label="Total Terselesaikan"
            icon={ReceiptText}
            value={
              <>
                148 <span className="text-[16px] font-semibold text-mocha">Pesanan</span>
              </>
            }
            footer={
              <>
                <TrendingDown size={14} className="text-danger" />
                <span>
                  <b className="text-danger">68</b> pesanan dibatalkan
                </span>
              </>
            }
          />
          <MiniStat
            label="Total Pesanan"
            icon={Coffee}
            value={
              <>
                216 <span className="text-[16px] font-semibold text-mocha">Pesanan</span>
              </>
            }
            footer={
              <>
                <Coffee size={14} />
                <span>Terlaris: Yap Latte (84 cup)</span>
              </>
            }
          />
          <MiniStat
            label="Pendapatan Bersih Perbulan"
            icon={Banknote}
            value={
              <span className="text-olive">
                <span className="mr-1 text-[14px] font-semibold text-mocha">Rp</span>
                100.000.000
              </span>
            }
            footer={<span>Pendapatan bersih bulan ini</span>}
          />
        </div>
      </div>

      {/* ── Tabel riwayat (tanpa overflow-hidden agar popover tidak terpotong) ── */}
      <Card>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 rounded-t-2xl bg-sand/60 p-4">
          <label className="flex h-12 min-w-64 flex-1 items-center gap-2 rounded-lg border-2 border-mocha/40 bg-white px-3 text-[14px] text-bark">
            <Search size={16} />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPage(1)
              }}
              placeholder="Cari nomor order #ORD, nama pelanggan, atau varian"
              className="w-full bg-transparent text-ink outline-none"
            />
          </label>

          <MonthYearPicker
            value={month}
            currentValue={CURRENT_MONTH}
            onChange={(v) => {
              setMonth(v)
              setPage(1)
            }}
          />

          <FilterDropdown
            icon={SlidersHorizontal}
            ariaLabel="Pilih status pesanan"
            value={status}
            options={statusOptions}
            onChange={(v) => {
              setStatus(v as StatusFilter)
              setPage(1)
            }}
            menuClassName="min-w-48"
          />

          <button
            aria-label="Muat ulang"
            onClick={resetToDefault}
            className="grid size-12 place-items-center rounded-lg bg-white text-espresso hover:bg-sand"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Filter aktif */}
        {hasFilter && (
          <div className="flex flex-wrap items-center gap-3 border-b border-line bg-sand/30 px-4 py-3 text-[12px] text-bark">
            Filter aktif:
            {month !== 'semua' && (
              <span className="rounded bg-sand px-3 py-1.5 text-ink">
                Bulan: {formatMonthLabel(month, CURRENT_MONTH)}
              </span>
            )}
            {status !== 'semua' && (
              <span className="rounded bg-sand px-3 py-1.5 text-ink">Status: {statusLabel}</span>
            )}
            <button
              onClick={() => {
                setMonth('semua')
                setStatus('semua')
                setPage(1)
              }}
              className="text-espresso underline"
            >
              Reset Filter
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-sand/70">
              <tr>
                <Th>No. Order &amp; Waktu</Th>
                <Th>Pelanggan Tetangga</Th>
                <Th>Detail Menu &amp; Catatan</Th>
                <Th>Titik Pengambilan</Th>
                <Th>Total &amp; Bayar</Th>
                <Th>Status</Th>
                <Th className="text-right">Aksi Nota</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pageRows.map((r) => (
                <tr key={r.id} className="align-middle">
                  <td className="px-3 py-6">
                    <div className="text-[14px] font-bold text-espresso">#ORD-{r.id}</div>
                    <div className="text-[12px] text-bark">
                      {shortDate(r.date)} • {r.time} WIB
                    </div>
                  </td>
                  <td className="px-3 py-6">
                    <div className="flex items-center gap-3">
                      <span className={`grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${r.tone}`}>
                        {r.ini}
                      </span>
                      <div>
                        <div className="text-[14px] font-semibold text-ink">{r.name}</div>
                        <div className="flex items-center gap-1 text-[12px] text-bark">
                          <MessageSquare size={11} />{r.ph}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-6 text-[14px]">
                    <div className="font-medium text-ink">{r.item}</div>
                    <span className="mt-2 inline-block rounded bg-sand px-2 py-1.5 text-[12px] text-bark">
                      {r.mod}
                    </span>
                  </td>
                  <td className="px-3 py-6 text-[14px]">
                    <div className="font-medium text-ink">{r.spot}</div>
                    <div className="text-[12px] text-mocha">Sesi Pagi (08:30 - 10:00)</div>
                  </td>
                  <td className="px-3 py-6">
                    <div
                      className={`text-[14px] font-bold ${r.status === 'batal' ? 'text-mist line-through' : 'text-espresso'}`}
                    >
                      Rp {r.total}
                    </div>
                    <div className="flex items-center gap-1 text-[12px] text-bark">
                      {r.pay === 'QRIS Instan' ? <QrCode size={12} /> : <Banknote size={12} />}
                      {r.pay}
                    </div>
                  </td>
                  <td className="px-3 py-6">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-3 py-6 text-right">
                    <button
                      disabled={r.status === 'batal'}
                      className="inline-flex items-center gap-1.5 rounded-md bg-sand px-3 py-2 text-[12px] font-semibold text-ink hover:bg-line disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-sand"
                    >
                      <FileText size={13} />Struk
                    </button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-bark">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-2xl border-t border-line bg-sand/50 px-6 py-4 text-[12px] text-bark">
          <span>
            {shown.length === 0
              ? 'Tidak ada riwayat pesanan'
              : `Menampilkan ${start + 1} - ${start + pageRows.length} dari ${shown.length} riwayat pesanan`}
          </span>
          <div className="flex items-center gap-2 text-[14px]">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="px-3 py-2 hover:text-espresso disabled:opacity-40"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={currentPage === p ? 'page' : undefined}
                className={`grid size-9 place-items-center rounded-lg ${currentPage === p ? 'bg-espresso font-semibold text-white' : 'hover:bg-sand'}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="rounded-lg px-3 py-2 hover:bg-sand disabled:opacity-40"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </Card>
    </main>
  )
}