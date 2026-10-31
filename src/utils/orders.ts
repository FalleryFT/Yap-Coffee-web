import type { OrderItem } from '@/types/orders'

export const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

export const itemsSubtotal = (items: OrderItem[]) => items.reduce((sum, it) => sum + it.price, 0)

export const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export const mapsDirectionsUrl = (query: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`

export const whatsappUrl = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`