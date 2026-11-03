import { useCallback, useState } from 'react'
import { reasons } from '@/constants/orders'
import { toApiError } from '@/lib/apiError'
import type { CancelOrderPayload } from '@/services/orderService'
import type { Order } from '@/types/orders'

export function useCancelOrder(onConfirm: (id: string, payload: CancelOrderPayload) => Promise<void>) {
  const [target, setTarget] = useState<Order | null>(null)
  const [reason, setReason] = useState(reasons[0])
  const [extra, setExtra] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const open = useCallback((order: Order) => {
    setTarget(order)
    setReason(reasons[0])
    setExtra('')
    setError(null)
  }, [])

  const close = useCallback(() => setTarget(null), [])

  // Modal hanya ditutup bila pembatalan berhasil; bila gagal, pesan galat tampil di modal.
  const confirm = useCallback(async () => {
    if (!target || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await onConfirm(target.id, { reason, note: extra.trim() || undefined })
      setTarget(null)
    } catch (err) {
      setError(toApiError(err).message)
    } finally {
      setSubmitting(false)
    }
  }, [target, submitting, reason, extra, onConfirm])

  return { target, reason, setReason, extra, setExtra, submitting, error, open, close, confirm }
}
