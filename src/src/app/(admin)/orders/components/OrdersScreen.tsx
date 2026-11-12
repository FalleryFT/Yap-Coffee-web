'use client'

import { useCancelOrder } from '@/hooks/orders/useCancelOrder'
import { useCompleteOrder } from '@/hooks/orders/useCompleteOrder'
import { useOrderDetail } from '@/hooks/orders/useOrderDetail'
import { useOrders } from '@/hooks/orders/useOrders'
import type { OrderStatus } from '@/types/orders'
import { CancelOrderModal } from './CancelOrderModal'
import { CompleteOrderModal } from './CompleteOrderModal'
import { OrderDetailModal } from './OrderDetailModal'
import { OrderStats } from './OrderStats'
import { OrderTable } from './OrderTable'
import { OrderToolbar } from './OrderToolbar'

export function OrdersScreen() {
  const orders = useOrders()
  const cancel = useCancelOrder(orders.cancelOrder)
  const complete = useCompleteOrder(orders.completeOrder)
  const detail = useOrderDetail()

  // Selesai bersifat final, jadi harus dikonfirmasi dulu. Dropdown tetap menampilkan status lama
  // sampai konfirmasi berhasil (nilainya mengikuti data pesanan, bukan pilihan sementara).
  function handleStatus(id: string, status: OrderStatus) {
    if (status !== 'Selesai') {
      orders.setStatus(id, status)
      return
    }
    const order = orders.shown.find((o) => o.id === id)
    if (order) complete.open(order)
  }

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <OrderStats stats={orders.stats} />

      <OrderToolbar
        counts={orders.stats?.active ?? null}
        tab={orders.tab}
        onTab={orders.setTab}
        query={orders.query}
        onQuery={orders.setQuery}
        statusFilter={orders.statusFilter}
        onStatusFilter={orders.setStatusFilter}
        onReload={orders.reload}
      />

      {orders.actionError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-peach px-5 py-3 text-[14px] text-danger"
        >
          <span>{orders.actionError}</span>
          <button onClick={orders.dismissActionError} className="shrink-0 font-semibold underline">
            Tutup
          </button>
        </div>
      )}

      {orders.loadError ? (
        <div className="rounded-2xl border border-line bg-white px-6 py-14 text-center text-sm">
          <p className="text-danger">{orders.loadError}</p>
          <button
            onClick={orders.reload}
            className="mt-4 rounded-lg bg-espresso px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-espresso/90"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <OrderTable
          orders={orders.shown}
          loading={orders.loading}
          page={orders.page}
          totalPages={orders.totalPages}
          total={orders.total}
          onPage={orders.setPage}
          onDetail={detail.open}
          onStatus={handleStatus}
          onCancel={cancel.open}
        />
      )}

      {detail.target && <OrderDetailModal order={detail.target} onClose={detail.close} />}

      {complete.target && (
        <CompleteOrderModal
          order={complete.target}
          submitting={complete.submitting}
          error={complete.error}
          onClose={complete.close}
          onConfirm={complete.confirm}
        />
      )}

      {cancel.target && (
        <CancelOrderModal
          order={cancel.target}
          reason={cancel.reason}
          onReason={cancel.setReason}
          extra={cancel.extra}
          onExtra={cancel.setExtra}
          submitting={cancel.submitting}
          error={cancel.error}
          onClose={cancel.close}
          onConfirm={cancel.confirm}
        />
      )}
    </main>
  )
}
