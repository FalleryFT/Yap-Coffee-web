import type { StockStatus } from '@/types/admin'
import { LOW_STOCK_LIMIT } from '@/constants/menu'

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'habis'
  if (stock <= LOW_STOCK_LIMIT) return 'menipis'
  return 'tersedia'
}
