'use client'

import { useDashboard } from '@/hooks/dashboard/useDashboard'
import { DashboardHeader } from './DashboardHeader'
import { NewOrderBanner } from './NewOrderBanner'
import { OrderQueueTable } from './OrderQueueTable'
import { TodaySummary } from './TodaySummary'
import { TopMenuCard } from './TopMenuCard'
import { WeeklyRevenueCard } from './WeeklyRevenueCard'

function ErrorNotice({ message, action }: { message: string; action: { label: string; run: () => void } }) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
    >
      <span>{message}</span>
      <button onClick={action.run} className="font-semibold underline underline-offset-2">
        {action.label}
      </button>
    </div>
  )
}

export function DashboardScreen() {
  const d = useDashboard()
  const { data } = d

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <DashboardHeader syncLabel={d.syncLabel} onResync={d.resync} />

      {d.error && <ErrorNotice message={d.error} action={{ label: 'Coba lagi', run: d.resync }} />}
      {d.actionError && (
        <ErrorNotice message={d.actionError} action={{ label: 'Tutup', run: d.dismissActionError }} />
      )}

      {data?.newOrderAlert && <NewOrderBanner alert={data.newOrderAlert} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <WeeklyRevenueCard weekly={data?.weeklyRevenue ?? null} />
        <TopMenuCard topMenu={data?.topMenu ?? null} />
      </div>

      <TodaySummary summary={data?.summary ?? null} />
      <OrderQueueTable
        rows={data?.queue.items ?? []}
        total={data?.queue.total ?? 0}
        loading={d.loading}
        query={d.query}
        onQuery={d.setQuery}
        onStatus={d.setStatus}
      />
    </main>
  )
}
