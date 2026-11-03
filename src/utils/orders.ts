import type { OrderItem } from '@/types/orders'

export const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

export const itemsSubtotal = (items: OrderItem[]) => items.reduce((sum, it) => sum + it.price, 0)

export const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export const mapsDirectionsUrl = (query: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`

export const whatsappUrl = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`

/** Nomor halaman yang ditampilkan di paginasi: paling banyak `max`, berpusat di halaman aktif. */
export function pageNumbers(page: number, totalPages: number, max = 5): number[] {
  const count = Math.min(max, totalPages)
  const start = Math.max(1, Math.min(page - Math.floor(count / 2), totalPages - count + 1))
  return Array.from({ length: count }, (_, i) => start + i)
}
