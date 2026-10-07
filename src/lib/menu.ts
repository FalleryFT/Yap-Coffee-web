import type { MenuCategory, StockStatus } from '../types/admin'

export const menuCategories: MenuCategory[] = [
  'Kopi Susu',
  'Manual Brew',
  'Non-Coffee',
  'Makanan Ringan',
]

// Sisa stok sampai angka ini dianggap "Menipis".
export const LOW_STOCK_LIMIT = 5

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'habis'
  if (stock <= LOW_STOCK_LIMIT) return 'menipis'
  return 'tersedia'
}

export const stockFilterOptions: { value: StockStatus | 'semua'; label: string }[] = [
  { value: 'semua', label: 'Semua Status Stok' },
  { value: 'tersedia', label: 'Tersedia' },
  { value: 'menipis', label: 'Menipis' },
  { value: 'habis', label: 'Habis Terjual' },
]