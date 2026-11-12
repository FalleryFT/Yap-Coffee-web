import { useCallback, useState } from 'react'
import { seed } from '@/data/orders'
import type { Order, OrderStatus } from '@/types/orders'

export function useOrderQueue() {
  const [orders, setOrders] = useState<Order[]>(seed)
  const [query, setQuery] = useState('')

  const keyword = query.trim().toLowerCase()
  const rows = orders.filter(
    (o) => !keyword || o.name.toLowerCase().includes(keyword) || o.code.toLowerCase().includes(keyword),
  )

  const setStatus = useCallback(
    (id: string, status: OrderStatus) =>
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
    [],
  )

  return { rows, query, setQuery, setStatus }
}