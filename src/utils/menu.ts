import type { StockStatus } from '@/types/admin'
import { LOW_STOCK_LIMIT } from '@/constants/menu'

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'habis'
  if (stock <= LOW_STOCK_LIMIT) return 'menipis'
  return 'tersedia'
}

// ── Konversi tambahan menu: backend memakai { label, extra_price }, form memakai teks "Oat Milk +5k" ──

export interface AddonPayload {
  label: string
  extra_price: number
}

/** "Oat Milk +5k" → { label: 'Oat Milk', extra_price: 5000 }; tanpa harga → 0. */
export function parseAddon(text: string): AddonPayload {
  const match = text.trim().match(/^(.*?)\s*\+\s*(\d+)\s*(k?)$/i)
  if (!match || !match[1]) return { label: text.trim(), extra_price: 0 }
  const amount = Number(match[2])
  return { label: match[1].trim(), extra_price: match[3] ? amount * 1000 : amount }
}

/** { label: 'Oat Milk', extra_price: 5000 } → "Oat Milk +5k". */
export function formatAddon({ label, extra_price }: AddonPayload): string {
  if (extra_price <= 0) return label
  return extra_price % 1000 === 0
    ? `${label} +${extra_price / 1000}k`
    : `${label} +${extra_price}`
}

/**
 * Backend hanya menyimpan nama berkas gambar (contoh: 'yap_latte.png').
 * Tetapkan NEXT_PUBLIC_IMAGE_BASE_URL bila gambar disajikan dari alamat tertentu.
 */
export function toImageUrl(image: string | null | undefined): string | undefined {
  if (!image) return undefined
  if (/^(https?:|blob:|data:|\/)/.test(image)) return image
  const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? '').replace(/\/$/, '')
  return base ? `${base}/${image}` : image
}
