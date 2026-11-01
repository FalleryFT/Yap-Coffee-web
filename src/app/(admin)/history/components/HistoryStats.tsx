import { Banknote, Coffee, ReceiptText, TrendingDown } from 'lucide-react'
import { MiniStat } from './MiniStat'

export function HistoryStats() {
  return (
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
        label="Pendapatan Perbulan"
        icon={Banknote}
        value={
          <span className="text-olive">
            <span className="mr-1 text-[14px] font-semibold text-mocha">Rp</span>
            100.000.000
          </span>
        }
        footer={<span>Pendapatan bulan ini</span>}
      />
    </div>
  )
}
