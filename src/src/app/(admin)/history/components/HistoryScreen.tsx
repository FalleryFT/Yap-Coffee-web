'use client'

import { ReceiptModal } from '@/app/components/ReceiptModal'
import { CURRENT_MONTH } from '@/constants/history'
import { useHistoryFilters } from '@/hooks/history/useHistoryFilters'
import { useHistoryStats } from '@/hooks/history/useHistoryStats'
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
  const stats = useHistoryStats(f.month)
  const receipt = useReceipt()

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <HistoryHeader status={f.status} month={f.month} q={f.q} />

      {/* ── Grafik bulanan (kiri) + 3 kartu ringkasan (kanan) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <MonthlyRevenueCard selected={f.month} currentMonth={CURRENT_MONTH} />
        <HistoryStats stats={stats} month={f.month} />
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

        {(f.loadError || receipt.error) && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 border-b border-line bg-danger-soft px-4 py-3 text-[13px] text-danger"
          >
            <span>{f.loadError ?? receipt.error}</span>
            <button
              onClick={f.loadError ? f.reload : receipt.dismissError}
              className="font-semibold underline"
            >
              {f.loadError ? 'Coba lagi' : 'Tutup'}
            </button>
          </div>
        )}

        <HistoryTable rows={f.pageRows} onReceipt={receipt.open} loading={f.loading} />

        <HistoryPagination
          total={f.total}
          start={f.start}
          count={f.pageRows.length}
          currentPage={f.currentPage}
          totalPages={f.totalPages}
          onPage={f.setPage}
        />
      </Card>

      <ReceiptModal receipt={receipt.receipt} onClose={receipt.close} />
    </main>
  )
}
