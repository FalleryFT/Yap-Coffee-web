import { http } from '@/lib/http'
import type { ApiSuccess } from '@/types/api'
import type { Order, OrderPage, OrderStatsData, OrderStatus } from '@/types/orders'

// Query daftar pesanan (backend/src/validators/orderValidators.ts → listOrdersQuerySchema).
// Tanpa `status`, backend hanya mengembalikan pesanan aktif.
export interface GetOrdersParams {
  status?: OrderStatus
  q?: string
  page?: number
  limit?: number
}

// Badan permintaan batal (cancelOrderSchema). Backend belum menyimpan keduanya, tetapi tetap divalidasi.
export interface CancelOrderPayload {
  reason?: string
  note?: string
}

const BASE = '/admin/orders'

export async function getOrders(params: GetOrdersParams): Promise<OrderPage> {
  const { data } = await http.get<ApiSuccess<OrderPage>>(BASE, { params })
  return data.data
}

export async function getOrderStats(): Promise<OrderStatsData> {
  const { data } = await http.get<ApiSuccess<OrderStatsData>>(`${BASE}/stats`)
  return data.data
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const { data } = await http.patch<ApiSuccess<Order>>(`${BASE}/${id}/status`, { status })
  return data.data
}

export async function cancelOrder(id: string, payload: CancelOrderPayload): Promise<Order> {
  const { data } = await http.post<ApiSuccess<Order>>(`${BASE}/${id}/cancel`, payload)
  return data.data
}
