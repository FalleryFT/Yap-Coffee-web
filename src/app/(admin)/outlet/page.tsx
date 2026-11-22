import type { Metadata } from 'next'
import { OutletScreen } from './components/OutletScreen'

export const metadata: Metadata = {
  title: 'Outlet & Kontak Penjual',
}

export default function OutletPage() {
  return <OutletScreen />
}