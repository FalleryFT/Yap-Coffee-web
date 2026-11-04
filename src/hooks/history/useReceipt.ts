import { useCallback, useState } from 'react'
import { toApiError } from '@/lib/apiError'
import { getReceipt } from '@/services/historyService'
import type { HistoryRow } from '@/types/history'
import type { ReceiptData } from '@/types/receipt'

export function useReceipt() {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const open = useCallback(async (row: HistoryRow) => {
    setError(null)
    setLoadingId(row.id)
    try {
      setReceipt(await getReceipt(row.id))
    } catch (err) {
      setError(toApiError(err).message)
    } finally {
      setLoadingId(null)
    }
  }, [])

  const close = useCallback(() => setReceipt(null), [])
  const dismissError = useCallback(() => setError(null), [])

  return { receipt, open, close, loadingId, error, dismissError }
}
