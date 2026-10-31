'use client'

import { Receipt } from 'lucide-react'
import Link from 'next/link'
import { OrderRow } from '@/app/(admin)/orders/components/OrderRow'
import { Th } from '@/app/(admin)/orders/components/ui'
import { todaySummary } from '@/data/dummy'
import { useOrderQueue } from '@/hooks/dashboard/useOrderQueue'
import { QueueHeader } from './QueueHeader'

export function OrderQueueTable() {
  const { rows, query, setQuery, setStatus } = useOrderQueue()

  return (
    <section className="rounded-2xl border border-line bg-white shadow-card">
      <QueueHeader query={query} onQuery={setQuery} />

      <div className="overflow-x-auto px-6">
        <table className="w-full min-w-[56rem] border-collapse">
          <thead className="border-y border-line bg-sand/70">
            <tr>
              <Th>Pesanan</Th>
              <Th>Pelanggan</Th>
              <Th>Menu</Th>
              <Th>Sesi Pickup</Th>
              <Th>Pembayaran</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-mist">
                  Tidak ada pesanan yang cocok.
                </td>
              </tr>
            )}
            {rows.map((o) => (
              <OrderRow key={o.id} order={o} onStatus={setStatus} />
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4">
        <p className="text-xs">
          Menampilkan {rows.length} dari {todaySummary.totalOrders} pesanan hari ini
        </p>
        <Link
          href="/orders"
          className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white hover:bg-espresso/90"
        >
          Lihat Seluruh Halaman Orders
          <Receipt size={16} />
        </Link>
      </footer>
    </section>
  )
}