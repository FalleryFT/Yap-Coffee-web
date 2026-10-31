import { useCallback, useState } from 'react'
import { reasons } from '@/constants/orders'
import type { Order, OrderStatus } from '@/types/orders'

export function useCancelOrder(onConfirm: (id: string, status: OrderStatus) => void) {
  const [target, setTarget] = useState<Order | null>(null)
  const [reason, setReason] = useState(reasons[0])
  const [extra, setExtra] = useState('')

  const open = useCallback((order: Order) => {
    setTarget(order)
    setReason(reasons[0])
    setExtra('')
  }, [])

  const close = useCallback(() => setTarget(null), [])

  const confirm = useCallback(() => {
    if (!target) return
    onConfirm(target.id, 'Dibatalkan')
    setTarget(null)
  }, [target, onConfirm])

  return { target, reason, setReason, extra, setExtra, open, close, confirm }
}
