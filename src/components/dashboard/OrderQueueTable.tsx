import { Check, CheckCheck, CircleCheck, EllipsisVertical, Receipt, Search, SlidersHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardOrders, todaySummary } from '../../data/dummy'
import type { AvatarTone, HintTone, OrderStatus } from '../../types/admin'

interface StatusConfig {
  label: string
  badge: string
  dot: string
  next?: OrderStatus
  action?: { label: string; icon: LucideIcon; className: string }
}

// Satu tempat untuk tampilan tiap status; klik tombol aksi memajukan status ke `next`.
const statusConfig: Record<OrderStatus, StatusConfig> = {
  menunggu: {
    label: 'Menunggu',
    badge: 'bg-danger-soft text-danger',
    dot: 'bg-danger',
    next: 'meramu',
    action: { label: 'Terima', icon: Check, className: 'bg-espresso text-white' },
  },
  meramu: {
    label: 'Meramu',
    badge: 'bg-honey text-mocha',
    dot: 'bg-mocha',
    next: 'siap_ambil',
    action: { label: 'Siap Ambil', icon: CheckCheck, className: 'bg-mocha text-white' },
  },
  siap_ambil: {
    label: 'Siap Ambil',
    badge: 'bg-sand text-bark',
    dot: 'bg-olive',
    next: 'selesai',
    action: { label: 'Serahkan', icon: CircleCheck, className: 'bg-olive text-white' },
  },
  selesai: {
    label: 'Selesai',
    badge: 'bg-sand text-mist',
    dot: 'bg-mist',
  },
}

const avatarTone: Record<AvatarTone, string> = {
  peach: 'bg-peach text-mocha',
  sage: 'bg-[#e3e8cf] text-olive',
  gray: 'bg-sand text-bark',
}

const hintTone: Record<HintTone, string> = {
  danger: 'text-danger',
  olive: 'text-olive',
  muted: 'text-mist',
}

const headCell =
  'px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-bark uppercase'

export function OrderQueueTable() {
  const [orders, setOrders] = useState(dashboardOrders)
  const [query, setQuery] = useState('')

  const keyword = query.trim().toLowerCase()
  const rows = orders.filter(
    (o) =>
      !keyword ||
      o.customerName.toLowerCase().includes(keyword) ||
      o.id.toLowerCase().includes(keyword),
  )

  function advance(id: string) {
    setOrders((prev) =>
      prev.map((o) => {
        const next = statusConfig[o.status].next
        return o.id === id && next ? { ...o, status: next } : o
      }),
    )
  }

  return (
    <section className="rounded-2xl border border-line bg-white shadow-card">
      <header className="flex flex-wrap items-end justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-espresso">
            <Receipt size={20} />
            Lihat Orders: Pesanan Masuk &amp; Antrean Bar
          </h2>
          <p className="mt-1 text-sm">Daftar pesanan live dan antrean pickup dari tetangga sekitar</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex h-11 w-72 items-center gap-2 rounded-lg border border-line bg-cream px-3">
            <Search size={16} className="text-mist" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau #Order ID..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-mist"
            />
          </label>
          <button
            className="flex size-11 items-center justify-center rounded-lg border border-line bg-cream text-bark hover:bg-sand"
            aria-label="Filter"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </header>

      <div className="overflow-x-auto px-6">
        <table className="w-full min-w-[56rem] border-collapse">
          <thead className="bg-sand">
            <tr>
              <th className={headCell}>ID &amp; Waktu</th>
              <th className={headCell}>Pelanggan Tetangga</th>
              <th className={headCell}>Detail Item Seduhan &amp; Addons</th>
              <th className={headCell}>Jadwal Ambil</th>
              <th className={headCell}>Status</th>
              <th className={`${headCell} text-right`}>Aksi Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-mist">
                  Tidak ada pesanan yang cocok.
                </td>
              </tr>
            )}
            {rows.map((o) => {
              const cfg = statusConfig[o.status]
              const Action = cfg.action
              return (
                <tr key={o.id} className="align-middle text-sm">
                  <td className="px-4 py-4">
                    <p className="font-bold text-espresso">{o.id}</p>
                    <p className="text-xs">{o.time}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarTone[o.avatarTone]}`}
                      >
                        {o.customerInitials}
                      </span>
                      <div className="leading-tight">
                        <p className="font-semibold text-espresso">{o.customerName}</p>
                        <p className="text-xs">{o.customerPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-espresso">{o.items}</p>
                    <p className="text-xs">{o.notes}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-espresso">{o.pickupTime}</p>
                    <p className={`text-xs ${hintTone[o.pickupHintTone]}`}>{o.pickupHint}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badge}`}
                    >
                      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {Action ? (
                        <button
                          onClick={() => advance(o.id)}
                          className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold ${Action.className}`}
                        >
                          <Action.icon size={14} />
                          {Action.label}
                        </button>
                      ) : (
                        <span className="text-xs text-mist">Struk POS</span>
                      )}
                      <button className="text-mist hover:text-espresso" aria-label="Opsi lainnya">
                        <EllipsisVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <footer className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4">
        <p className="text-xs">
          Menampilkan {rows.length} dari {todaySummary.totalOrders} pesanan hari ini
        </p>
        <Link
          to="/orders"
          className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white hover:bg-espresso/90"
        >
          Lihat Seluruh Halaman Orders
          <Receipt size={16} />
        </Link>
      </footer>
    </section>
  )
}