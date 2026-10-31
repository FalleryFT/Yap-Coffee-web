import { useCallback, useMemo, useState } from 'react'
import { seed } from '@/data/orders'
import type { Order, OrderStatus } from '@/types/orders'

export function useOrders() {
  const [list, setList] = useState<Order[]>(seed)
  const [tab, setTab] = useState('Semua')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'Semua'>('Semua')

  const shown = useMemo(
    () =>
      list.filter(
        (o) =>
          (tab === 'Semua' ||
            (tab === 'Baru Masuk' && o.status === 'Baru Masuk') ||
            (tab === 'Diproses' && o.status === 'Diproses') ||
            (tab === 'Siap Diambil' && o.status === 'Siap Ambil')) &&
          (statusFilter === 'Semua' || o.status === statusFilter) &&
          (o.name + o.code).toLowerCase().includes(query.toLowerCase()),
      ),
    [list, tab, query, statusFilter],
  )

  const setStatus = useCallback(
    (id: string, status: OrderStatus) =>
      setList((l) => l.map((o) => (o.id === id ? { ...o, status } : o))),
    [],
  )

  const reload = useCallback(() => setList(seed), [])

  return { shown, tab, setTab, query, setQuery, statusFilter, setStatusFilter, setStatus, reload }
}
