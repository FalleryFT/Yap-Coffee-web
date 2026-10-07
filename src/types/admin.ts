export type OrderStatus = 'menunggu' | 'meramu' | 'siap_ambil' | 'selesai'
export type AvatarTone = 'peach' | 'sage' | 'gray'
export type HintTone = 'danger' | 'olive' | 'muted'
export type ScheduleStatus = 'aktif' | 'mendatang'
export type MenuCategory = 'Kopi Susu' | 'Manual Brew' | 'Non-Coffee' | 'Makanan Ringan'
export type StockStatus = 'tersedia' | 'menipis' | 'habis'

export interface DashboardOrder {
  id: string
  time: string
  customerName: string
  customerInitials: string
  customerPhone: string
  avatarTone: AvatarTone
  items: string
  notes: string
  pickupTime: string
  pickupHint: string
  pickupHintTone: HintTone
  status: OrderStatus
}

export interface PreOrderSchedule {
  id: number
  name: string
  date: string // 'YYYY-MM-DD'; hari & tanggal tampilan dihitung dari sini
  location: string
  locationDetail: string
  pickupTime: string // '08:30 - 11:30 WIB'
  cutOff: string // '07:00 WIB' (tampilan menambah awalan "Cut-off: ")
  cutOffUrgent: boolean
  status: ScheduleStatus
}

export interface TopMenuItem {
  id: number
  name: string
  description: string
  sold: number
  share: string
  unit: string
  image?: string
}

export interface MenuItem {
  id: number
  name: string
  description: string
  category: MenuCategory
  price: number // rupiah, tanpa format
  stock: number // sisa stok harian; status dihitung dari angka ini
  addons: string[] // pilihan modifikasi, contoh 'Oat Milk +5k'
  image?: string
}