import { CheckCircle2, ChevronDown, CircleX, Eye } from 'lucide-react'
import { flow, pill } from '@/constants/orders'
import type { Order, OrderStatus } from '@/types/orders'
import { shortDate } from '@/utils/history'
import { IconBtn } from './ui'

interface Props {
  order: Order
  onStatus: (id: string, status: OrderStatus) => void
  /** Kolom Aksi hanya tampil jika onDetail dan onCancel diisi (dipakai di halaman Orders). */
  onDetail?: (order: Order) => void
  onCancel?: (order: Order) => void
}

export function OrderRow({ order: o, onStatus, onDetail, onCancel }: Props) {
  const done = o.status === 'Selesai' || o.status === 'Dibatalkan'
  const showActions = Boolean(onDetail && onCancel)
  const [first, ...rest] = o.items

  return (
    <tr className={`text-center align-middle transition-colors hover:bg-cream/60 ${done ? 'text-mist' : ''}`}>
      {/* Pesanan */}
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="text-[14px] font-bold text-espresso">{o.code}</div>
        <div className="mt-1 text-[12px] text-bark">{shortDate(o.date)}</div>
      </td>

      {/* Pelanggan */}
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="text-[14px] font-semibold text-ink">{o.name}</div>
        <div className="mt-0.5 text-[12px] text-bark">{o.phone}</div>
      </td>

      {/* Menu (ringkas; selengkapnya ada di Detail) */}
      <td className="max-w-[240px] px-4 py-3.5">
        <div className="truncate text-[14px] font-medium text-ink">
          <span className="mr-1 text-espresso">{first?.qty}x</span>
          {first?.name}
        </div>
        {rest.length > 0 && <div className="mt-0.5 text-[12px] text-bark">+{rest.length} menu lainnya</div>}
      </td>

      {/* Sesi pickup */}
      <td className="whitespace-nowrap px-4 py-3.5">
        <span className="inline-flex rounded-lg bg-sand px-2.5 py-1.5 text-[13px] font-bold text-ink">
          {o.window.replace(' - ', ' – ')}
        </span>
      </td>

      {/* Pembayaran */}
      <td className="whitespace-nowrap px-4 py-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-[12px] text-espresso">
          <CheckCircle2 size={12} />
          {o.pay}
        </span>
      </td>

      {/* Status (dropdown pill) */}
      <td className="whitespace-nowrap px-4 py-3.5">
        {o.status === 'Dibatalkan' ? (
          <span
            className={`inline-flex h-9 min-w-[140px] items-center justify-center rounded-full px-4 text-[13px] font-semibold ${pill.Dibatalkan}`}
          >
            Dibatalkan
          </span>
        ) : (
          <div className="relative inline-block">
            <select
              aria-label={`Status ${o.code}`}
              value={o.status}
              onChange={(e) => onStatus(o.id, e.target.value as OrderStatus)}
              className={`h-9 min-w-[140px] cursor-pointer appearance-none rounded-full pl-4 pr-9 text-[13px] font-semibold outline-none ${pill[o.status]}`}
            >
              {flow.map((s) => (
                <option key={s} value={s} className="bg-white text-ink">
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-2.5" />
          </div>
        )}
      </td>

      {/* Aksi */}
      {showActions && (
        <td className="whitespace-nowrap px-4 py-3.5">
          <div className="flex items-center justify-center gap-1.5">
            <IconBtn label="Lihat detail" onClick={() => onDetail?.(o)}>
              <Eye size={16} />
            </IconBtn>
            <IconBtn label="Batalkan pesanan" tone="danger" disabled={done} onClick={() => onCancel?.(o)}>
              <CircleX size={16} />
            </IconBtn>
          </div>
        </td>
      )}
    </tr>
  )
}