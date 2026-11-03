import { useCallback, useState } from 'react'
import { toApiError } from '@/lib/apiError'
import type { Order } from '@/types/orders'

/** Konfirmasi sebelum pesanan ditandai Selesai (status final, tidak bisa diubah lagi). */
export function useCompleteOrder(onConfirm: (id: string) => Promise<void>) {
  const [target, setTarget] = useState<Order | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const open = useCallback((order: Order) => {
    setTarget(order)
    setError(null)
  }, [])

  const close = useCallback(() => setTarget(null), [])

  // Modal hanya ditutup bila berhasil; bila gagal, pesan galat tampil di modal.
  const confirm = useCallback(async () => {
    if (!target || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await onConfirm(target.id)
      setTarget(null)
    } catch (err) {
      setError(toApiError(err).message)
    } finally {
      setSubmitting(false)
    }
  }, [target, submitting, onConfirm])

  return { target, submitting, error, open, close, confirm }
}
