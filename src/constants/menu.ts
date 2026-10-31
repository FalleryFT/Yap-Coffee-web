import type { MenuCategory, StockStatus } from '@/types/admin'

export const menuCategories: MenuCategory[] = [
  'Kopi Susu',
  'Manual Brew',
  'Non-Coffee',
  'Makanan Ringan',
]

// Sisa stok sampai angka ini dianggap "Menipis".
export const LOW_STOCK_LIMIT = 5

export const stockFilterOptions: { value: StockStatus | 'semua'; label: string }[] = [
  { value: 'semua', label: 'Semua Status Stok' },
  { value: 'tersedia', label: 'Tersedia' },
  { value: 'menipis', label: 'Menipis' },
  { value: 'habis', label: 'Habis Terjual' },
]

export const descMax = 200

export const labelCls = 'mb-1.5 block text-[13px] font-medium text-espresso'
export const inputCls =
  'w-full rounded-lg border border-line bg-sand px-4 py-3 text-[14px] text-ink placeholder:text-mist outline-none focus:ring-2 focus:ring-mocha/30'
