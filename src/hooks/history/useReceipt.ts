import { useState } from 'react'
import type { ReceiptData } from '@/types/receipt'
import type { HistoryRow } from '@/types/history'
import { toReceipt } from '@/utils/history'

export function useReceipt() {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)

  const open = (row: HistoryRow) => setReceipt(toReceipt(row))
  const close = () => setReceipt(null)

  return { receipt, open, close }
}
