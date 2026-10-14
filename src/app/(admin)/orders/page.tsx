import type { Metadata } from 'next'
import { OrdersScreen } from '@/screens/OrdersScreen'

export const metadata: Metadata = {
  title: 'Orders',
}

export default function OrdersPage() {
  return <OrdersScreen />
}
