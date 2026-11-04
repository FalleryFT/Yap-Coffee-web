import { Banknote, Coffee, ReceiptText, TrendingDown } from 'lucide-react'
import { formatNumber } from '@/lib/format'
import type { HistoryStatsData } from '@/types/history'
import { MiniStat } from './MiniStat'

interface Props {
  stats: HistoryStatsData | null
  month: string // 'YYYY-MM' | 'semua'
}

const dash = '–'

export function HistoryStats({ stats, month }: Props) {
  const count = (n: number | undefined) => (n === undefined ? dash : formatNumber(n))

  return (
    <div className="flex flex-col gap-4">
      <MiniStat
        label="Total Terselesaikan"
        icon={ReceiptText}
        value={
          <>
            {count(stats?.completed)}{' '}
            <span className="text-[16px] font-semibold text-mocha">Pesanan</span>
          </>
        }
        footer={
          <>
            <TrendingDown size={14} className="text-danger" />
            <span>
              <b className="text-danger">{count(stats?.cancelled)}</b> pesanan dibatalkan
            </span>
          </>
        }
      />
      <MiniStat
        label="Total Pesanan"
        icon={Coffee}
        value={
          <>
            {count(stats?.total)}{' '}
            <span className="text-[16px] font-semibold text-mocha">Pesanan</span>
          </>
        }
        footer={
          <>
            <Coffee size={14} />
            <span>
              {stats?.topMenu
                ? `Terlaris: ${stats.topMenu.name} (${formatNumber(stats.topMenu.qty)} cup)`
                : 'Belum ada menu terlaris'}
            </span>
          </>
        }
      />
      <MiniStat
        label={month === 'semua' ? 'Total Pendapatan' : 'Pendapatan Perbulan'}
        icon={Banknote}
        value={
          <span className="text-olive">
            <span className="mr-1 text-[14px] font-semibold text-mocha">Rp</span>
            {count(stats?.revenue)}
          </span>
        }
        footer={<span>{month === 'semua' ? 'Pendapatan seluruh periode' : 'Pendapatan bulan terpilih'}</span>}
      />
    </div>
  )
}
