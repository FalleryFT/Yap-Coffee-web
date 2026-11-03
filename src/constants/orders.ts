import type { OrderStatus, OrderStatsData } from '@/types/orders'

// Jumlah pesanan per halaman di tabel Orders
export const ORDERS_PAGE_SIZE = 20

// Daftar pilihan di dropdown status (tanpa "Dibatalkan")
export const flow: OrderStatus[] = ['Baru Masuk', 'Diproses', 'Siap Ambil', 'Selesai']

// Aksi "maju satu fase" di kolom Aksi
export const nextAction: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  'Baru Masuk': { next: 'Diproses', label: 'Proses pesanan' },
  Diproses: { next: 'Siap Ambil', label: 'Tandai siap ambil' },
  'Siap Ambil': { next: 'Selesai', label: 'Tandai selesai' },
}

// Warna status di tabel
export const pill: Record<OrderStatus, string> = {
  'Baru Masuk': 'bg-peach text-mocha',
  Diproses: 'bg-honey text-mocha',
  'Siap Ambil': 'bg-[#e8ecd8] text-olive',
  Selesai: 'bg-sand text-bark',
  Dibatalkan: 'bg-sand text-mist',
}

// Warna titik di kartu statistik = warna status di tabel
export const dot: Record<string, string> = {
  'Baru Masuk': 'bg-peach ring-1 ring-inset ring-mocha/30',
  'Sedang Diproses': 'bg-honey ring-1 ring-inset ring-mocha/30',
  'Siap Diambil': 'bg-[#e8ecd8] ring-1 ring-inset ring-olive/30',
}

export const reasons = [
  'Bahan baku habis (Kopi Susu / Oatmilk)',
  'Pelanggan minta cancel',
  'Stok menu habis terjual',
  'Kesalahan input pesanan',
  'Lainnya',
]

// Tab di toolbar: `status` = filter yang dikirim ke API, `count` = kunci jumlahnya di stats.active
export const tabs: {
  label: string
  status?: OrderStatus
  count: keyof OrderStatsData['active']
}[] = [
  { label: 'Semua', count: 'semua' },
  { label: 'Baru Masuk', status: 'Baru Masuk', count: 'baruMasuk' },
  { label: 'Diproses', status: 'Diproses', count: 'diproses' },
  { label: 'Siap Diambil', status: 'Siap Ambil', count: 'siapAmbil' },
]

// [judul kartu, kunci jumlah di stats.active, keterangan]
export const statCards = [
  ['Baru Masuk', 'baruMasuk', 'Perlu konfirmasi barista'],
  ['Sedang Diproses', 'diproses', 'Di bar espresso & manual'],
  ['Siap Diambil', 'siapAmbil', 'Di pick-up counter meja 1'],
] as const