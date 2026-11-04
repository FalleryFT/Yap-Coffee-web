import { useRevenueChart } from '@/hooks/history/useRevenueChart'
import { useRevenueData } from '@/hooks/history/useRevenueData'
import { RevenueBars } from './revenue/RevenueBars'
import { RevenueHeader } from './revenue/RevenueHeader'

interface MonthlyRevenueCardProps {
  selected: string // 'YYYY-MM' atau 'semua'
  currentMonth: string // bulan berjalan, 'YYYY-MM'
}

export function MonthlyRevenueCard({ selected, currentMonth }: MonthlyRevenueCardProps) {
  const data = useRevenueData(selected)
  const chart = useRevenueChart(selected, currentMonth, data)

  return (
    <section className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card">
      <RevenueHeader chart={chart} />
      <RevenueBars chart={chart} />

      <footer className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs">
        <span>{chart.footerLabel}</span>
        <span className="font-bold text-olive">{chart.footerValue}</span>
      </footer>
    </section>
  )
}
