import type { OrderStatus } from '@/types/admin'

export interface StatusConfig {
  label: string
  badge: string
  dot: string
  next?: OrderStatus
}
