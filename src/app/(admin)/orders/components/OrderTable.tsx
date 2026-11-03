import type { Order, OrderStatus } from '@/types/orders'
import { OrderPagination } from './OrderPagination'
import { OrderRow } from './OrderRow'
import { Card, Th } from './ui'

interface Props {
  orders: Order[]
  loading: boolean
  page: number
  totalPages: number
  total: number
  onPage: (page: number) => void
  onDetail: (order: Order) => void
  onStatus: (id: string, status: OrderStatus) => void
  onCancel: (order: Order) => void
}

export function OrderTable({ orders, loading, page, totalPages, total, onPage, onDetail, onStatus, onCancel }: Props) {
  return (
    <Card className="overflow-hidden">
      {/* Baris lama tetap tampil (agak pudar) saat memuat ulang, supaya tabel tidak berkedip. */}
      <div className={`overflow-x-auto transition-opacity ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
        <table className="w-full min-w-[980px] border-collapse [&_th]:text-left [&_td]:text-left">
          <thead className="border-b border-line bg-sand/70">
            <tr>
              <Th>Pesanan</Th>
              <Th>Pelanggan</Th>
              <Th>Menu</Th>
              <Th>Sesi Pickup</Th>
              <Th>Pembayaran</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} onDetail={onDetail} onStatus={onStatus} onCancel={onCancel} />
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-bark">
                  {loading ? 'Memuat pesanan…' : 'Tidak ada pesanan pada filter ini.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OrderPagination shown={orders.length} total={total} page={page} totalPages={totalPages} onPage={onPage} />
    </Card>
  )
}