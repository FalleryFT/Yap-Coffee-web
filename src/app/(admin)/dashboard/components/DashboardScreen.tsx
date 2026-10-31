'use client'

import { usePosSync } from '@/hooks/dashboard/usePosSync'
import { DashboardHeader } from './DashboardHeader'
import { NewOrderBanner } from './NewOrderBanner'
import { OrderQueueTable } from './OrderQueueTable'
import { TodaySummary } from './TodaySummary'
import { TopMenuCard } from './TopMenuCard'
import { WeeklyRevenueCard } from './WeeklyRevenueCard'

export function DashboardScreen() {
  const { syncLabel, resync } = usePosSync()

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <DashboardHeader syncLabel={syncLabel} onResync={resync} />

      <NewOrderBanner />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <WeeklyRevenueCard />
        <TopMenuCard />
      </div>

      <TodaySummary />
      <OrderQueueTable />
    </main>
  )
}
