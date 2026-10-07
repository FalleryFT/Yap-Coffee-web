import {
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Coffee,
  Download,
  FileText,
  MessageSquare,
  Printer,
  QrCode,
  ReceiptText,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  TrendingDown,
} from 'lucide-react'
import { useMemo, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface HistoryRow {
  id: string
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
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const rows: HistoryRow[] = [
  { id: '9024', time: '09:15', name: 'Siti Nurhaliza', ini: 'SN', tone: 'bg-peach text-mocha', ph: '0813-2299-4411', item: '2x Es Kopi Susu Tetangga Gula Aren', mod: 'Less Sugar 50%, Oatmilk Swap', spot: 'Bar Senopati 01', total: '52.000', pay: 'QRIS Instan' },
  { id: '9023', time: '09:02', name: 'Bramantyo Putro', ini: 'BP', tone: 'bg-honey text-mocha', ph: '0857-1900-8833', item: '1x Hot Americano Double Shot + Butter Croissant', mod: 'Extra Hot, Pastry Dihangatkan', spot: 'Drop Box Gazebo Tengah', total: '48.000', pay: 'Tunai Kasir' },
  { id: '9021', time: '08:44', name: 'Dian Lestari', ini: 'DL', tone: 'bg-[#e8ecd8] text-olive', ph: '0812-9901-2345', item: '1x Iced Matcha Latte Tetangga', mod: 'Normal Sweet, Extra Ice', spot: 'Drive-thru Tetangga Express', total: '28.000', pay: 'QRIS Instan' },
  { id: '9019', time: '08:32', name: 'Fajar Ramadhan', ini: 'FR', tone: 'bg-sand text-bark', ph: '0811-8822-7711', item: '3x Cold Brew Botol Tetangga (250ml)', mod: 'Paket Bundle Teman Kantor', spot: 'Bar Senopati 01', total: '85.000', pay: 'QRIS Instan' },
  { id: '9015', time: '08:12', name: 'Anisa Yuliani', ini: 'AY', tone: 'bg-peach text-mocha', ph: '0878-3344-9988', item: '1x Earl Grey Tea Artisan + Cinnamon Roll', mod: 'Hangat, Gula Terpisah', spot: 'Drop Box Gazebo Tengah', total: '42.000', pay: 'QRIS Instan' },
  { id: '9010', time: '07:50', name: 'Hendra Wijaya', ini: 'HW', tone: 'bg-honey text-mocha', ph: '0819-0128-4455', item: '2x Manual Brew V60 (Gayo Natural)', mod: 'Suhu 88°C, Notes Floral Peach', spot: 'Bar Senopati 01', total: '64.000', pay: 'Tunai Kasir' },
  { id: '9008', time: '07:35', name: 'Rina Marlina', ini: 'RM', tone: 'bg-[#e8ecd8] text-olive', ph: '0852-4411-9922', item: '1x Cafe Latte Panas (Soymilk Swap)', mod: 'No Sugar, Extra Foam', spot: 'Drive-thru Tetangga Express', total: '30.000', pay: 'QRIS Instan' },
  { id: '9003', time: '07:15', name: 'Agus Setiawan', ini: 'AS', tone: 'bg-sand text-bark', ph: '0813-7722-1100', item: '1x Kopi Tubruk Nusantara + Pisang Goreng Wijen', mod: 'Paling Awal Buka Warung', spot: 'Bar Senopati 01', total: '32.000', pay: 'Tunai Kasir' },
]

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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState(true)
  const [page, setPage] = useState(1)

  const shown = useMemo(
    () => rows.filter((r) => (r.id + r.name + r.item).toLowerCase().includes(q.toLowerCase())),
    [q],
  )

  return (
    <main className="flex flex-col gap-6 px-8 py-6">
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

      {/* ── Stat cards ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col overflow-hidden">
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between text-[12px] font-semibold uppercase tracking-wide text-bark">
              Total Terselesaikan
              <span className="grid size-10 place-items-center rounded-lg bg-sand text-espresso">
                <ReceiptText size={18} />
              </span>
            </div>
            <div className="mt-1 text-[34px] font-bold leading-tight text-ink">
              148 <span className="text-[22px] font-semibold text-mocha">Pesanan</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-sand px-5 py-4 text-[14px] text-bark">
            <TrendingDown size={15} className="text-danger" />
            <b className="text-danger">68</b> pesanan dibatalkan
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between text-[12px] font-semibold uppercase tracking-wide text-bark">
              Total Pesanan
              <span className="grid size-10 place-items-center rounded-lg bg-sand text-espresso">
                <Coffee size={18} />
              </span>
            </div>
            <div className="mt-1 text-[34px] font-bold leading-tight text-ink">
              216 <span className="text-[22px] font-semibold text-mocha">Pesanan</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-sand px-5 py-4 text-[14px] text-bark">
            <Coffee size={15} />Terlaris: Yap Latte (84 cup)
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between text-[12px] font-semibold uppercase tracking-wide text-bark">
              Pendapatan Bersih Perbulan
              <span className="grid size-10 place-items-center rounded-lg bg-sand text-espresso">
                <Settings size={18} />
              </span>
            </div>
            <div className="mt-1 whitespace-nowrap text-[32px] font-bold leading-tight tracking-tight text-olive">
              RP 100.000.000
            </div>
          </div>
          <div className="bg-sand px-5 py-4 text-[14px] text-bark">pendapatan bersih</div>
        </Card>
      </div>

      {/* ── Tabel riwayat ── */}
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 bg-sand/60 p-4">
          <label className="flex h-12 min-w-64 flex-1 items-center gap-2 rounded-lg border-2 border-mocha/40 bg-white px-3 text-[14px] text-bark">
            <Search size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nomor order #ORD, nama pelanggan, atau varian"
              className="w-full bg-transparent text-ink outline-none"
            />
          </label>
          <div className="flex h-12 items-center gap-3 rounded-lg bg-white px-3 text-[14px]">
            <Calendar size={16} className="text-espresso" />
            <span className="flex items-center gap-8 rounded border border-line px-3 py-1.5">
              Bulan Ini - Oktober 2024
              <ChevronDown size={13} />
            </span>
          </div>
          <div className="flex h-12 items-center gap-3 rounded-lg bg-white px-3 text-[14px]">
            <SlidersHorizontal size={16} className="text-espresso" />
            <span className="rounded border border-line px-3 py-1.5">Selesai Diambil</span>
          </div>
          <button
            aria-label="Muat ulang"
            onClick={() => { setQ(''); setFilter(true) }}
            className="grid size-12 place-items-center rounded-lg bg-white text-espresso hover:bg-sand"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Filter active chip */}
        {filter && (
          <div className="flex items-center gap-3 border-b border-line bg-sand/30 px-4 py-3 text-[12px] text-bark">
            Filter aktif:
            <span className="rounded bg-sand px-3 py-1.5 text-ink">Status: Selesai Diambil</span>
            <button onClick={() => setFilter(false)} className="text-espresso underline">
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
              {shown.map((r) => (
                <tr key={r.id} className="align-middle">
                  <td className="px-3 py-6">
                    <div className="text-[14px] font-bold text-espresso">#ORD-{r.id}</div>
                    <div className="text-[12px] text-bark">24 Okt • {r.time} WIB</div>
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
                    <div className="text-[14px] font-bold text-espresso">Rp {r.total}</div>
                    <div className="flex items-center gap-1 text-[12px] text-bark">
                      {r.pay === 'QRIS Instan' ? <QrCode size={12} /> : <Banknote size={12} />}
                      {r.pay}
                    </div>
                  </td>
                  <td className="px-3 py-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8ecd8] px-3 py-2 text-[12px] font-semibold text-olive">
                      <CheckCircle2 size={13} />Selesai Diambil
                    </span>
                  </td>
                  <td className="px-3 py-6 text-right">
                    <button className="inline-flex items-center gap-1.5 rounded-md bg-sand px-3 py-2 text-[12px] font-semibold text-ink hover:bg-line">
                      <FileText size={13} />Struk
                    </button>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-sand/50 px-6 py-4 text-[12px] text-bark">
          <span>Menampilkan 1 - {shown.length} dari 148 riwayat pesanan</span>
          <div className="flex items-center gap-2 text-[14px]">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-2 disabled:opacity-40 hover:text-espresso"
            >
              Sebelumnya
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={page === p ? 'page' : undefined}
                className={`grid size-9 place-items-center rounded-lg ${page === p ? 'bg-espresso font-semibold text-white' : 'hover:bg-sand'}`}
              >
                {p}
              </button>
            ))}
            <span>...</span>
            <button
              onClick={() => setPage(19)}
              className={`grid size-9 place-items-center rounded-lg ${page === 19 ? 'bg-espresso text-white' : 'hover:bg-sand'}`}
            >
              19
            </button>
            <button
              disabled={page === 19}
              onClick={() => setPage(page + 1)}
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
