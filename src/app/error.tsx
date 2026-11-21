'use client'

import { useEffect } from 'react'
import { ErrorScreen } from '@/app/components/ErrorScreen'

// Dipakai Next.js saat sebuah halaman/komponen melempar error saat dirender (500).
// Kesalahan permintaan API (axios) tetap ditangani di tiap halaman lewat toApiError.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorScreen
      code="500"
      onRetry={reset}
      digest={error.digest}
      detail={process.env.NODE_ENV === 'development' ? error.message : undefined}
    />
  )
}