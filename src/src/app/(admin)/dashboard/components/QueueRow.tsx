import { ChevronDown } from 'lucide-react'
import type { DashboardOrder, OrderStatus } from '@/types/admin'
import { avatarTone, flow, hintTone, pill, statusConfig } from '@/constants/dashboard'

interface Props {
  order: DashboardOrder
  onAdvance: (id: string, status: OrderStatus) => void
}

export function QueueRow({ order: o, onAdvance }: Props) {
  const cfg = statusConfig[o.status]

  return (
    <tr className="align-middle text-sm">
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
        <div className="flex items-center justify-end">
          <div className="relative">
            <select
              aria-label={`Status ${o.id}`}
              value={o.status}
              onChange={(e) => onAdvance(o.id, e.target.value as OrderStatus)}
              className={`h-9 appearance-none rounded-full pl-4 pr-9 text-xs font-semibold outline-none ${pill[o.status]}`}
            >
              {flow.map((s) => (
                <option key={s} value={s} className="bg-white text-ink">
                  {statusConfig[s].label}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-2.5" />
          </div>
        </div>
      </td>
    </tr>
  )
}
