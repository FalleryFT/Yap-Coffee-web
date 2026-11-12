import { ChevronDown, RefreshCw, Search } from 'lucide-react'
import { flow, tabs } from '@/constants/orders'
import type { OrderStatsData, OrderStatus } from '@/types/orders'
import { Card } from './ui'

interface Props {
  /** Jumlah pesanan aktif untuk badge tab; null selama statistik belum dimuat. */
  counts: OrderStatsData['active'] | null
  tab: string
  onTab: (tab: string) => void
  query: string
  onQuery: (q: string) => void
  statusFilter: OrderStatus | 'Semua'
  onStatusFilter: (s: OrderStatus | 'Semua') => void
  onReload: () => void
}

export function OrderToolbar({ counts, tab, onTab, query, onQuery, statusFilter, onStatusFilter, onReload }: Props) {
  return (
    <Card className="flex flex-wrap items-center gap-3 p-4">
      <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto" role="tablist">
        {tabs.map(({ label, count }) => (
          <button
            key={label}
            role="tab"
            aria-selected={tab === label}
            onClick={() => onTab(label)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${
              tab === label ? 'bg-espresso text-white' : 'bg-sand text-ink hover:bg-line'
            }`}
          >
            {label}{counts && ` (${counts[count]})`}
          </button>
        ))}
      </div>
      <label className="flex h-11 w-72 items-center gap-2 rounded-lg bg-sand px-3 text-[14px] text-bark">
        <Search size={16} />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Cari Pelanggan atau #ORD ID..."
          className="w-full bg-transparent outline-none placeholder:text-mist"
        />
      </label>
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilter(e.target.value as OrderStatus | 'Semua')}
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
        onClick={onReload}
        className="grid size-11 place-items-center rounded-lg bg-sand text-espresso hover:bg-line"
      >
        <RefreshCw size={16} />
      </button>
    </Card>
  )
}
