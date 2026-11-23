export type OrderStatus = 'menunggu' | 'meramu' | 'siap_ambil' | 'selesai'
export type AvatarTone = 'peach' | 'sage' | 'gray'
export type HintTone = 'danger' | 'olive' | 'muted'
export type ScheduleStatus = 'aktif' | 'mendatang' | 'berakhir'
// Kategori dikelola admin (tabel menu_categories), jadi bukan lagi daftar tetap.
export type MenuCategory = string
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
  mapsUrl?: string  
  /** Titik di peta aplikasi pelanggan; kosong bila belum diisi. */
  latitude?: number
  longitude?: number
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

export interface MenuAddon {
  label: string
  extra_price: number // rupiah, tanpa format; 0 = gratis
}

/** Jenis menu; dipilih saat menu dibuat dan terkunci setelahnya. */
export type MenuType = 'makanan' | 'minuman'

/** Ukuran gelas satu menu minuman, contoh Reguler (16 oz) atau Large (22 oz, +5.000). */
export interface MenuSize {
  label: string
  oz: number | null // angka saja; "oz" ditambahkan saat ditampilkan
  extraPrice: number // tambahan harga per gelas, rupiah tanpa format
  isDefault: boolean
}

/** Tingkat manis satu menu minuman. */
export interface MenuSugar {
  label: string
  isDefault: boolean
}

export interface MenuItem {
  id: number
  name: string
  description: string
  /** null = tanpa kategori (kategori asalnya sudah dihapus); hanya tampil di filter "Semua". */
  category: MenuCategory | null
  price: number // rupiah, tanpa format
  stock: number // sisa stok harian; status dihitung dari angka ini
  addons: MenuAddon[] // pilihan modifikasi/varian, contoh { label: 'Oat Milk', extra_price: 5000 }
  image?: string
  /** Tampil di katalog pre-order pelanggan. false = disembunyikan. */
  available: boolean
  /** Jenis menu; tidak bisa diubah setelah dibuat. */
  menuType: MenuType
  /** true = minuman, false = makanan (turunan dari menuType). */
  hasOptions?: boolean
  /** Ukuran gelas (hanya minuman, boleh kosong). */
  sizes: MenuSize[]
  /** Tingkat manis (hanya minuman, boleh kosong). */
  sugarLevels: MenuSugar[]
}

export interface WeeklyRevenuePoint {
  day: string // 'Sen', 'Sel', ...
  date: string // 'YYYY-MM-DD'
  revenue: number | null // null = hari belum berjalan
  isToday?: boolean
}