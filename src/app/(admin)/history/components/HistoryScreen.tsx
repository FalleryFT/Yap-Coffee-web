'use client'

import { ReceiptModal } from '@/app/components/ReceiptModal'
import { CURRENT_MONTH } from '@/constants/history'
import { useHistoryFilters } from '@/hooks/history/useHistoryFilters'
import { useReceipt } from '@/hooks/history/useReceipt'
import { ActiveFilters } from './ActiveFilters'
import { HistoryHeader } from './HistoryHeader'
import { HistoryPagination } from './HistoryPagination'
import { HistoryStats } from './HistoryStats'
import { HistoryTable } from './HistoryTable'
import { HistoryToolbar } from './HistoryToolbar'
import { MonthlyRevenueCard } from './MonthlyRevenueCard'
import { Card } from './ui'

export function HistoryScreen() {
  const f = useHistoryFilters()
  const { receipt, open, close } = useReceipt()

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <HistoryHeader />

      {/* ── Grafik bulanan (kiri) + 3 kartu ringkasan (kanan) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <MonthlyRevenueCard selected={f.month} currentMonth={CURRENT_MONTH} />
        <HistoryStats />
      </div>

      {/* ── Tabel riwayat (tanpa overflow-hidden agar popover tidak terpotong) ── */}
      <Card>
        <HistoryToolbar
          q={f.q}
          onQuery={f.changeQuery}
          month={f.month}
          onMonth={f.changeMonth}
          status={f.status}
          onStatus={f.changeStatus}
          onReset={f.resetToDefault}
        />

        {f.hasFilter && (
          <ActiveFilters
            month={f.month}
            status={f.status}
            statusLabel={f.statusLabel}
            onClear={f.clearFilters}
          />
        )}

        <HistoryTable rows={f.pageRows} onReceipt={open} />

        <HistoryPagination
          total={f.shown.length}
          start={f.start}
          count={f.pageRows.length}
          currentPage={f.currentPage}
          totalPages={f.totalPages}
          onPage={f.setPage}
        />
      </Card>

      <ReceiptModal receipt={receipt} onClose={close} />
    </main>
  )
}
