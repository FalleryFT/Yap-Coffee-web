'use client'

import {
  AlertTriangle,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  Search,
  X,
  XCircle,
} from 'lucide-react'
import { useCallback, useId, useMemo, useState } from 'react'
import { Modal } from '@/app/components/Modal'

// ─── Types ───────────────────────────────────────────────────────────────────
type OrderStatus = 'Baru Masuk' | 'Diproses' | 'Siap Ambil' | 'Selesai' | 'Dibatalkan'

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
  items: OrderItem[]
  window: string
  total: number
  pay: string
  status: OrderStatus
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

// Daftar pilihan di dropdown status (tanpa "Dibatalkan")
const flow: OrderStatus[] = ['Baru Masuk', 'Diproses', 'Siap Ambil', 'Selesai']

// Warna status di tabel
const pill: Record<OrderStatus, string> = {
  'Baru Masuk': 'bg-peach text-mocha',
  Diproses: 'bg-honey text-mocha',
  'Siap Ambil': 'bg-[#e8ecd8] text-olive',
  Selesai: 'bg-sand text-bark',
  Dibatalkan: 'bg-sand text-mist',
}

// Warna titik di kartu statistik = warna status di tabel
const dot: Record<string, string> = {
  'Baru Masuk': 'bg-peach ring-1 ring-inset ring-mocha/30',
  'Sedang Diproses': 'bg-honey ring-1 ring-inset ring-mocha/30',
  'Siap Diambil': 'bg-[#e8ecd8] ring-1 ring-inset ring-olive/30',
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
    items: [
      { qty: 2, name: 'Es Kopi Susu Tetangga', price: 48000, mods: ['+ Oatmilk Sub (x2)', 'Less Sweet (50%)'] },
      { qty: 1, name: 'Cinnamon Roll', price: 20000, mods: [] },
    ],
    window: '12:30 - 12:45',
    total: 68000,
    pay: 'QRIS Lunas',
    status: 'Siap Ambil',
  },
  {
    id: '1043',
    code: '#ORD-1043',
    time: '12:15 WIB',
    name: 'Nadia Saraswati',
    phone: '+62 878-1120-4491',
    items: [
      { qty: 1, name: 'Pandan Latte Dingin', price: 28000, mods: ['+ Double Shot (+Rp 6k)', 'Normal Sweet'] },
      { qty: 1, name: 'Butter Croissant', price: 20000, mods: [] },
    ],
    window: '12:45 - 13:00',
    total: 54000,
    pay: 'QRIS Lunas',
    status: 'Diproses',
  },
  {
    id: '1044',
    code: '#ORD-1044',
    time: '12:22 WIB',
    name: 'Fahri Alamsyah',
    phone: '+62 856-7819-2039',
    items: [
      { qty: 4, name: 'Es Kopi Susu Tetangga', price: 80000, mods: ['Regular Creamer', 'Normal 100% Sugar'] },
      { qty: 2, name: 'Risoles Rogout', price: 32000, mods: [] },
    ],
    window: '13:00 - 13:15',
    total: 112000,
    pay: 'QRIS Lunas',
    status: 'Baru Masuk',
  },
  {
    id: '1041',
    code: '#ORD-1041',
    time: '11:45 WIB',
    name: 'Siti Rahma',
    phone: '+62 813-9002-1822',
    items: [{ qty: 1, name: 'Cold Brew Classic 250ml', price: 35000, mods: ['Cold Bottled'] }],
    window: '12:00 - 12:15',
    total: 35000,
    pay: 'Tunai Terbayar',
    status: 'Selesai',
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
    <th
      className={`whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-bark ${className}`}
    >
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
export function OrdersScreen() {
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
            (f === 'Baru Masuk' && o.status === 'Baru Masuk') ||
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
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
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
          ['Baru Masuk', '6', 'Perlu konfirmasi barista'],
          ['Sedang Diproses', '9', 'Di bar espresso & manual'],
          ['Siap Diambil', '14', 'Di pick-up counter meja 1'],
        ] as const).map(([t, n, s]) => (
          <Card key={t} className="p-5">
            <div className="flex items-center justify-between text-[14px] text-bark">
              {t}
              <span className={`size-3 rounded-full ${dot[t]}`} />
            </div>
            <div className={`mt-3 text-[34px] font-bold leading-none ${t === 'Siap Diambil' ? 'text-olive' : 'text-espresso'}`}>
              {n}
            </div>
            <div className="mt-5 text-[12px] text-bark">{s}</div>
          </Card>
        ))}
      </div>

      {/* ── Toolbar: filter tabs + search + status ── */}
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
          <table className="w-full min-w-[1080px] border-collapse">
            <thead className="border-b border-line bg-sand/70">
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
                  <tr
                    key={o.id}
                    className={`align-middle transition-colors hover:bg-cream/60 ${done ? 'text-mist' : ''}`}
                  >
                    {/* ID */}
                    <td className="whitespace-nowrap px-5 py-5">
                      <div className="text-[16px] font-bold leading-tight text-espresso">{o.code}</div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-bark">
                        <Clock size={12} />
                        {o.time}
                      </div>
                      <div className="mt-0.5 text-[12px] text-bark">24 Okt 2024</div>
                    </td>

                    {/* Pelanggan */}
                    <td className="whitespace-nowrap px-5 py-5">
                      <div className="text-[14px] font-semibold text-ink">{o.name}</div>
                      <div className="mt-0.5 text-[12px] text-bark">{o.phone}</div>
                    </td>

                    {/* Detail pesanan */}
                    <td className="min-w-[280px] px-5 py-5">
                      <div className="space-y-3">
                        {o.items.map((it) => (
                          <div key={it.name}>
                            <div className="flex items-start justify-between gap-6 text-[14px] font-medium text-ink">
                              <span>
                                <span className="mr-1.5 text-espresso">{it.qty}x</span>
                                {it.name}
                              </span>
                              <span className="shrink-0 font-normal text-bark">{rp(it.price)}</span>
                            </div>
                            {it.mods.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {it.mods.map((m) => (
                                  <span
                                    key={m}
                                    className="rounded-md bg-sand px-2 py-0.5 text-[11px] font-medium text-espresso"
                                  >
                                    {m}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Sesi pickup */}
                    <td className="whitespace-nowrap px-5 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg bg-sand px-3 py-2 text-[13px] font-bold ${
                          done ? 'text-bark' : 'text-ink'
                        }`}
                      >
                        <Clock size={13} />
                        {o.window.replace(' - ', ' – ')}
                      </span>
                    </td>

                    {/* Pembayaran */}
                    <td className="whitespace-nowrap px-5 py-5">
                      <div className="text-[11px] uppercase tracking-wide text-bark">Total Pembayaran</div>
                      <div className="mt-0.5 text-[20px] font-bold leading-tight text-espresso">{rp(o.total)}</div>
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-[12px] text-espresso">
                        <CheckCircle2 size={13} />
                        {o.pay}
                      </span>
                    </td>

                    {/* Status (dropdown pill) */}
                    <td className="whitespace-nowrap px-5 py-5">
                      {o.status === 'Dibatalkan' ? (
                        <span
                          className={`inline-flex h-10 min-w-[150px] items-center justify-center rounded-full px-5 text-[14px] font-semibold ${pill.Dibatalkan}`}
                        >
                          Dibatalkan
                        </span>
                      ) : (
                        <div className="relative inline-block">
                          <select
                            aria-label={`Status ${o.code}`}
                            value={o.status}
                            onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                            className={`h-10 min-w-[150px] cursor-pointer appearance-none rounded-full pl-5 pr-10 text-[14px] font-semibold outline-none ${pill[o.status]}`}
                          >
                            {flow.map((s) => (
                              <option key={s} value={s} className="bg-white text-ink">
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="pointer-events-none absolute right-4 top-3.5" />
                        </div>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="whitespace-nowrap px-5 py-5 text-right">
                      {!done ? (
                        <button
                          onClick={() => { setCancel(o); setReason(reasons[0]); setExtra('') }}
                          className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-sand px-4 text-[14px] font-medium text-danger transition-colors hover:bg-peach"
                        >
                          <X size={14} />Batalkan
                        </button>
                      ) : (
                        <span className="inline-flex h-10 items-center rounded-lg border border-line px-4 text-[14px] text-bark">
                          {o.status}
                        </span>
                      )}
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-sand/60 px-6 py-4 text-[14px] text-bark">
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