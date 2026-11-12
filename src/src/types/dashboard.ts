import type { TopMenuItem, WeeklyRevenuePoint } from '@/types/admin'
import type { Order } from '@/types/orders'
import type { OrderStatus } from '@/types/admin'

export interface StatusConfig {
  label: string
  badge: string
  dot: string
  next?: OrderStatus
}

// ---- Respons GET /admin/dashboard (backend/src/controllers/admin/adminDashboardController.ts) ----

/** Banner "Pesanan Baru Masuk"; null dari API berarti tidak ada pesanan baru. */
export interface NewOrderAlert {
  count: number
  pickupTime: string // '09:30 WIB'
  customers: string[] // maksimal 3 nama
}

export interface TodaySummaryData {
  totalOrders: number
  trendPercent: number | null // dibanding kemarin; null bila kemarin kosong
  readyForPickup: number
  completed: number
  onTimePercent: number | null // null bila belum ada pesanan selesai
  revenue: number
  averagePerOrder: number
}

export interface WeeklyRevenueData {
  points: WeeklyRevenuePoint[] // Senin sampai Minggu
  trendPercent: number | null // dibanding periode yang sama pekan lalu
}

export interface TopMenuData {
  items: TopMenuItem[]
  contribution: string // '88.2%'
}

export interface DashboardData {
  generatedAt: string
  newOrderAlert: NewOrderAlert | null
  summary: TodaySummaryData
  weeklyRevenue: WeeklyRevenueData
  topMenu: TopMenuData
  queue: { items: Order[]; total: number }
}
