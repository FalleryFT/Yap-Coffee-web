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
  total: number
  pay: string
  status: OrderStatus
}