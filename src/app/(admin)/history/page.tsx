import type { Metadata } from 'next'
import { HistoryScreen } from '@/screens/HistoryScreen'

export const metadata: Metadata = {
  title: 'History',
}

export default function HistoryPage() {
  return <HistoryScreen />
}
