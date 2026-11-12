export type OrderStatus = 'Baru Masuk' | 'Diproses' | 'Siap Ambil' | 'Selesai' | 'Dibatalkan'

export interface OrderItem {
  qty: number
  name: string
  price: number
  mods: string[]
}

export interface OrderKloter {
  name: string
  date: string // ISO "2024-10-24"
  hours: string // "11.00 - 14.00"
}

export interface PickupPoint {
  name: string
  detail: string
  area: string
  mapsQuery: string
  route: string
  /** Tautan Google Maps dari jadwal; dipakai bila ada, selain membangun dari mapsQuery. */
  mapsUrl?: string
}

export interface Order {
  id: string
  code: string
  date: string // ISO "2024-10-24"
  time: string
  name: string
  phone: string
  items: OrderItem[]
  window: string
  kloter: OrderKloter
  pickup: PickupPoint
  note?: string
  // Rincian biaya dan status bayar; hanya ada pada data dari API (tidak ada di data dummy).
  subtotal?: number
  tax?: number
  serviceFee?: number
  packagingFee?: number
  total: number
  pay: string
  paid?: boolean
  status: OrderStatus
}

/** Satu halaman daftar pesanan dari GET /admin/orders. */
export interface OrderPage {
  items: Order[]
  page: number
  limit: number
  total: number
  totalPages: number
}

/** Data kartu statistik dan badge tab dari GET /admin/orders/stats. */
export interface OrderStatsData {
  today: {
    count: number
    lastWeekCount: number
    /** Persen dibanding hari yang sama minggu lalu; null bila minggu lalu kosong. */
    changePercent: number | null
  }
  active: { semua: number; baruMasuk: number; diproses: number; siapAmbil: number }
}