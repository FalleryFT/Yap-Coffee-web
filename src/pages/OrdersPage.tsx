import {
  AlertTriangle,
  ArrowUp,
  Bike,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  NotebookPen,
  RefreshCw,
  Search,
  Tag,
  User,
  X,
  XCircle,
} from 'lucide-react'
import { useCallback, useId, useMemo, useState } from 'react'
import { Modal } from '../components/Modal'

// ─── Types ───────────────────────────────────────────────────────────────────
type OrderStatus = 'Menunggu' | 'Diproses' | 'Siap Ambil' | 'Selesai' | 'Dibatalkan'

interface OrderItem {
  qty: number
  name: string
  price: number
  mods: string[]
}

interface Order {
  id: string
  code: string
  time: string
  name: string
  phone: string
  tag: string
  items: OrderItem[]
  note?: string
  window: string
  eta: string
  place: string
  total: number
  pay: string
  payLink: string
  status: OrderStatus
  sub: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

const flow: OrderStatus[] = ['Menunggu', 'Diproses', 'Siap Ambil', 'Selesai']

const pill: Record<OrderStatus, string> = {
  Menunggu: 'bg-peach text-mocha',
  Diproses: 'bg-honey text-mocha',
  'Siap Ambil': 'bg-[#e8ecd8] text-olive',
  Selesai: 'bg-sand text-bark',
  Dibatalkan: 'bg-sand text-mist',
}

const reasons = [
  'Bahan baku habis (Kopi Susu / Oatmilk)',
  'Pelanggan minta cancel',
  'Stok menu habis terjual',
  'Kesalahan input pesanan',
  'Lainnya',
]

// ─── Seed data ────────────────────────────────────────────────────────────────
const seed: Order[] = [
  {
    id: '1042',
    code: '#ORD-1042',
    time: '12:10 WIB',
    name: 'Dimas Aryasatya',
    phone: '+62 812-8921-9921',
    tag: 'Tetangga Setia (Tier 3)',
    items: [
      { qty: 2, name: 'Es Kopi Susu Tetangga', price: 48000, mods: ['+ Oatmilk Sub (x2)', 'Less Sweet (50%)'] },
      { qty: 1, name: 'Cinnamon Roll', price: 20000, mods: [] },
    ],
    note: 'Tolong hangatkan 30 dtk',
    window: '12:30 - 12:45',
    eta: 'Tiba dlm ~15 mnt',
    place: 'Counter Meja 01',
    total: 68000,
    pay: 'Pembayaran: QRIS Lunas',
    payLink: 'Bukti Pembayaran',
    status: 'Siap Ambil',
    sub: 'Siap diserahkan',
  },
  {
    id: '1043',
    code: '#ORD-1043',
    time: '12:15 WIB',
    name: 'Nadia Saraswati',
    phone: '+62 878-1120-4491',
    tag: 'Ambil Sendiri',
    items: [
      { qty: 1, name: 'Pandan Latte Dingin', price: 28000, mods: ['+ Double Shot (+Rp 6k)', 'Normal Sweet'] },
      { qty: 1, name: 'Butter Croissant', price: 20000, mods: [] },
    ],
    window: '12:45 - 13:00',
    eta: 'Tiba dlm ~30 mnt',
    place: 'Bar Espresso',
    total: 54000,
    pay: 'Pembayaran: QRIS Lunas',
    payLink: 'Detail Resep',
    status: 'Diproses',
    sub: 'Stasiun Espresso',
  },
  {
    id: '1044',
    code: '#ORD-1044',
    time: '12:22 WIB',
    name: 'Fahri Alamsyah',
    phone: '+62 856-7819-2039',
    tag: 'Driver Ojol',
    items: [
      { qty: 4, name: 'Es Kopi Susu Tetangga', price: 80000, mods: ['Regular Creamer', 'Normal 100% Sugar'] },
      { qty: 2, name: 'Risoles Rogout', price: 32000, mods: [] },
    ],
    window: '13:00 - 13:15',
    eta: 'Sesi Istirahat Siang',
    place: 'Siap dijemput',
    total: 112000,
    pay: 'Pembayaran: QRIS Lunas',
    payLink: 'Cek Nota & QR',
    status: 'Menunggu',
    sub: 'Menunggu Mulai',
  },
  {
    id: '1041',
    code: '#ORD-1041',
    time: '11:45 WIB',
    name: 'Siti Rahma',
    phone: '+62 813-9002-1822',
    tag: 'Selesai Ambil',
    items: [{ qty: 1, name: 'Cold Brew Classic 250ml', price: 35000, mods: ['Cold Bottled'] }],
    window: '12:00 - 12:15',
    eta: 'Selesai 12:08 WIB',
    place: '',
    total: 35000,
    pay: 'Pembayaran: Tunai Terbayar',
    payLink: 'Lihat Arsip',
    status: 'Selesai',
    sub: 'Sudah Diambil',
  },
]

const filters: [string, string][] = [
  ['Semua', '33'],
  ['Baru Masuk', '6'],
  ['Diproses', '9'],
  ['Siap Diambil', '14'],
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white shadow-card ${className}`}>{children}</div>
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-4 text-left text-[12px] font-bold uppercase tracking-wider text-bark ${className}`}>
      {children}
    </th>
  )
}

function Btn({
  variant = 'primary',
  className = '',
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'soft'
}) {
  const v = {
    primary: 'bg-espresso text-white hover:bg-espresso/90 shadow-sm',
    ghost: 'bg-sand text-ink hover:bg-line',
    danger: 'bg-danger text-white hover:bg-red-800',
    soft: 'bg-sand text-ink hover:bg-line',
  }[variant]
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors ${v} ${className}`}
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [list, setList] = useState<Order[]>(seed)
  const [f, setF] = useState('Semua')
  const [q, setQ] = useState('')
  const [cancel, setCancel] = useState<Order | null>(null)
  const [reason, setReason] = useState(reasons[0])
  const [extra, setExtra] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'Semua'>('Semua')

  const cancelTitleId = useId()
  const stableCloseCancel = useCallback(() => setCancel(null), [])

  const shown = useMemo(
    () =>
      list.filter(
        (o) =>
          (f === 'Semua' ||
            (f === 'Baru Masuk' && o.status === 'Menunggu') ||
            (f === 'Diproses' && o.status === 'Diproses') ||
            (f === 'Siap Diambil' && o.status === 'Siap Ambil')) &&
          (statusFilter === 'Semua' || o.status === statusFilter) &&
          (o.name + o.code).toLowerCase().includes(q.toLowerCase()),
      ),
    [list, f, q, statusFilter],
  )

  const setStatus = (id: string, status: OrderStatus) =>
    setList((l) => l.map((o) => (o.id === id ? { ...o, status } : o)))

  return (
    <main className="flex flex-col gap-6 px-8 py-6">
      {/* ── Stat cards ── */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Pesanan masuk hari ini */}
        <div className="rounded-2xl bg-sand p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase leading-tight tracking-wide text-espresso">
              Pesanan Masuk<br />Hari Ini
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-olive px-2.5 py-1 text-[12px] font-medium text-white">
              <span className="size-1.5 rounded-full bg-white" />
              Live
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[40px] font-bold leading-none text-espresso">42</span>
            <span className="text-[14px] text-bark">Pre-Order aktif</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-[12px]">
            <span className="flex items-center gap-1 text-olive"><ArrowUp size={13} />18.4%</span>
            <span className="text-bark">vs kamis minggu lalu</span>
          </div>
        </div>

        {/* Baru masuk / Diproses / Siap Diambil */}
        {([
          ['Baru Masuk', '6', 'Perlu konfirmasi barista', 'bg-mocha'],
          ['Sedang Diproses', '9', 'Di bar espresso & manual', 'bg-mocha'],
          ['Siap Diambil', '14', 'Di pick-up counter meja 1', 'bg-olive'],
        ] as const).map(([t, n, s, dot]) => (
          <Card key={t} className="p-5">
            <div className="flex items-center justify-between text-[14px] text-bark">
              {t}
              <span className={`size-2.5 rounded-full ${dot}`} />
            </div>
            <div className={`mt-3 text-[34px] font-bold leading-none ${t === 'Siap Diambil' ? 'text-olive' : 'text-espresso'}`}>
              {n}
            </div>
            <div className="mt-5 text-[12px] text-bark">{s}</div>
          </Card>
        ))}
      </div>

      {/* ── Toolbar: filter tabs + search + sesi jam ── */}
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto" role="tablist">
          {filters.map(([n, c]) => (
            <button
              key={n}
              role="tab"
              aria-selected={f === n}
              onClick={() => setF(n)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${
                f === n ? 'bg-espresso text-white' : 'bg-sand text-ink hover:bg-line'
              }`}
            >
              {n} ({c})
            </button>
          ))}
        </div>
        <label className="flex h-11 w-72 items-center gap-2 rounded-lg bg-sand px-3 text-[14px] text-bark">
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari Pelanggan atau #ORD ID..."
            className="w-full bg-transparent outline-none placeholder:text-mist"
          />
        </label>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'Semua')}
            className="h-11 appearance-none rounded-lg bg-sand pl-4 pr-10 text-[14px] font-medium text-ink outline-none"
          >
            <option value="Semua">Semua Status</option>
            {flow.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-4 top-4 text-ink" />
        </div>
        <button
          aria-label="Muat ulang"
          onClick={() => setList(seed)}
          className="grid size-11 place-items-center rounded-lg bg-sand text-espresso hover:bg-line"
        >
          <RefreshCw size={16} />
        </button>
      </Card>

      {/* ── Tabel pesanan ── */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1160px]">
            <thead className="bg-sand/70">
              <tr>
                <Th>ID Pesanan</Th>
                <Th>Pelanggan</Th>
                <Th>Detail Pesanan</Th>
                <Th>Sesi Pickup</Th>
                <Th>Informasi Pembayaran</Th>
                <Th>Status Pesanan</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shown.map((o) => {
                const done = o.status === 'Selesai' || o.status === 'Dibatalkan'

                return (
                  <tr key={o.id} className={`align-top ${done ? 'text-mist' : ''}`}>
                    {/* ID */}
                    <td className="px-4 py-6">
                      <div className="text-[18px] font-bold leading-tight text-espresso">{o.code}</div>
                      <div className="mt-1.5 flex items-center gap-1 text-[12px] text-bark">
                        <Clock size={12} />{o.time}
                      </div>
                      <div className="mt-2 text-[12px] text-bark">24 Okt 2024</div>
                    </td>

                    {/* Pelanggan */}
                    <td className="px-4 py-6">
                      <div className="text-[14px] font-semibold text-ink">{o.name}</div>
                      <div className="text-[12px] text-bark">{o.phone}</div>
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded bg-peach px-2 py-1.5 text-[12px] text-mocha">
                        {o.tag.includes('Tier') ? <Tag size={12} />
                          : o.tag === 'Driver Ojol' ? <Bike size={12} />
                          : o.tag.startsWith('Selesai') ? <Check size={12} />
                          : <User size={12} />}
                        {o.tag}
                      </span>
                    </td>

                    {/* Detail pesanan */}
                    <td className="min-w-[250px] px-4 py-6">
                      <div className="space-y-3">
                        {o.items.map((it) => (
                          <div key={it.name}>
                            <div className="flex justify-between gap-6 text-[14px] font-medium">
                              <span>{it.qty}x {it.name}</span>
                              <span className="font-normal text-bark">{rp(it.price)}</span>
                            </div>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {it.mods.map((m) => (
                                <span key={m} className="rounded bg-sand px-2 py-1 text-[12px] font-medium text-espresso">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                        {o.note && (
                          <div className="flex gap-1.5 rounded bg-peach px-2 py-1.5 text-[12px] italic text-mocha">
                            <NotebookPen size={13} className="mt-0.5 shrink-0" />
                            Catatan: "{o.note}"
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Sesi pickup */}
                    <td className="px-4 py-6">
                      <div className={`inline-block rounded-lg bg-sand px-3 py-2 text-center text-[14px] font-bold leading-tight ${done ? 'text-bark' : 'text-ink'}`}>
                        {o.window.split(' - ')[0]}<br />
                        <span className="text-[14px]">-</span><br />
                        {o.window.split(' - ')[1]}
                      </div>
                      <div className={`mt-2 text-[12px] ${o.eta.startsWith('Tiba') ? 'text-mocha' : 'text-bark'}`}>
                        {o.eta}
                      </div>
                      {o.place && <div className="text-[12px] text-bark">{o.place}</div>}
                    </td>

                    {/* Pembayaran */}
                    <td className="px-4 py-6">
                      <div className="text-[11px] uppercase tracking-wide text-bark">Total Pembayaran</div>
                      <div className="text-[22px] font-bold leading-tight text-espresso">{rp(o.total)}</div>
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-[12px] text-espresso">
                        <CheckCircle2 size={13} />{o.pay}
                      </span>
                      <div className="mt-2">
                        <a href="#" className="text-[12px] text-espresso underline underline-offset-2">
                          {o.payLink}
                        </a>
                      </div>
                    </td>

                    {/* Status (dropdown pill) */}
                    <td className="px-4 py-6">
                      <div className="relative inline-block">
                        <select
                          aria-label={`Status ${o.code}`}
                          value={o.status}
                          onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                          disabled={o.status === 'Dibatalkan'}
                          className={`h-10 appearance-none rounded-full pl-5 pr-10 text-[14px] font-semibold outline-none ${pill[o.status]}`}
                        >
                          {[...flow, 'Dibatalkan' as OrderStatus].map((s) => (
                            <option key={s} className="bg-white text-ink">{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-4 top-3.5" />
                      </div>
                      <div className="mt-2 text-[12px] text-bark">
                        {o.status === 'Dibatalkan' ? 'Dana di-refund' : o.sub}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-6">
                      <div className="flex flex-col items-stretch gap-2">
                        {!done ? (
                          <button
                            onClick={() => { setCancel(o); setReason(reasons[0]); setExtra('') }}
                            className="flex h-10 items-center justify-center gap-1 rounded-lg bg-sand px-3 text-[14px] font-medium text-danger hover:bg-peach"
                          >
                            <X size={14} />Batalkan
                          </button>
                        ) : (
                          <span className="rounded-lg border border-line px-3 py-2 text-[14px] text-bark">
                            {o.status}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-bark">
                    Tidak ada pesanan pada filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-sand/60 px-6 py-4 text-[14px] text-bark">
          <span>Menampilkan <b className="text-ink">{shown.length}</b> dari 33 pesanan aktif</span>
          <div className="flex items-center gap-2">
            <button
              aria-label="Sebelumnya"
              disabled={page === 1}
              onClick={() => setPage(1)}
              className="grid size-9 place-items-center rounded-lg disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {[1, 2].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={page === p ? 'page' : undefined}
                className={`grid size-9 place-items-center rounded-lg ${page === p ? 'bg-espresso text-white' : 'bg-white hover:bg-sand'}`}
              >
                {p}
              </button>
            ))}
            <button
              aria-label="Berikutnya"
              disabled={page === 2}
              onClick={() => setPage(2)}
              className="grid size-9 place-items-center rounded-lg bg-white disabled:opacity-40 hover:bg-sand"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>

      {/* ── Modal Batalkan ── */}
      {cancel && (
        <Modal labelledBy={cancelTitleId} onClose={stableCloseCancel} widthClass="max-w-[426px]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-peach text-danger">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h2 id={cancelTitleId} className="text-[20px] font-bold leading-tight text-danger">
                  Batalkan Pesanan
                </h2>
                <div className="text-[12px] text-bark">{cancel.code} - {cancel.name}</div>
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
                  onChange={(e) => setReason(e.target.value)}
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
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Contoh: Stok Oatmilk habis, pelanggan setuju cancel"
                className="h-12 w-full rounded-lg bg-sand px-4 text-[14px] outline-none placeholder:text-mist"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3 border-t border-line pt-5">
              <Btn variant="ghost" onClick={() => setCancel(null)}>Kembali</Btn>
              <Btn
                variant="danger"
                onClick={() => { setStatus(cancel.id, 'Dibatalkan'); setCancel(null) }}
              >
                <XCircle size={15} />Ya, Batalkan &amp; Refund
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </main>
  )
}
