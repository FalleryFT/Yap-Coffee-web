'use client'

import { useCancelOrder } from '@/hooks/orders/useCancelOrder'
import { useOrderDetail } from '@/hooks/orders/useOrderDetail'
import { useOrders } from '@/hooks/orders/useOrders'
import { usePage } from '@/hooks/orders/usePage'
import { CancelOrderModal } from './CancelOrderModal'
import { OrderDetailModal } from './OrderDetailModal'
import { OrderStats } from './OrderStats'
import { OrderTable } from './OrderTable'
import { OrderToolbar } from './OrderToolbar'

export function OrdersScreen() {
  const orders = useOrders()
  const cancel = useCancelOrder(orders.setStatus)
  const detail = useOrderDetail()
  const { page, setPage } = usePage()

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <OrderStats />

      <OrderToolbar
        tab={orders.tab}
        onTab={orders.setTab}
        query={orders.query}
        onQuery={orders.setQuery}
        statusFilter={orders.statusFilter}
        onStatusFilter={orders.setStatusFilter}
        onReload={orders.reload}
      />

      <OrderTable
        orders={orders.shown}
        page={page}
        onPage={setPage}
        onDetail={detail.open}
        onStatus={orders.setStatus}
        onCancel={cancel.open}
      />

      {detail.target && <OrderDetailModal order={detail.target} onClose={detail.close} />}

      {cancel.target && (
        <CancelOrderModal
          order={cancel.target}
          reason={cancel.reason}
          onReason={cancel.setReason}
          extra={cancel.extra}
          onExtra={cancel.setExtra}
          onClose={cancel.close}
          onConfirm={cancel.confirm}
        />
      )}
    </main>
  )
}