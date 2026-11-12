import { useCallback, useState } from 'react'
import type { Order } from '@/types/orders'

export function useOrderDetail() {
  const [target, setTarget] = useState<Order | null>(null)

  const open = useCallback((order: Order) => setTarget(order), [])
  const close = useCallback(() => setTarget(null), [])

  return { target, open, close }
}