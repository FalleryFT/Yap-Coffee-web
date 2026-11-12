import type { Metadata } from 'next'
import { PreOrderScreen } from './components/PreOrderScreen'

export const metadata: Metadata = {
  title: 'Pre-Order',
}

export default function PreOrderPage() {
  return <PreOrderScreen />
}
