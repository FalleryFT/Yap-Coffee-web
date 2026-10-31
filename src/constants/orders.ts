import type { OrderStatus } from '@/types/orders'

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

export const filters: [string, string][] = [
  ['Semua', '33'],
  ['Baru Masuk', '6'],
  ['Diproses', '9'],
  ['Siap Diambil', '14'],
]

export const statCards = [
  ['Baru Masuk', '6', 'Perlu konfirmasi barista'],
  ['Sedang Diproses', '9', 'Di bar espresso & manual'],
  ['Siap Diambil', '14', 'Di pick-up counter meja 1'],
] as const