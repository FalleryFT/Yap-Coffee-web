'use client'

import '@fontsource-variable/plus-jakarta-sans'
import './globals.css'
import { ErrorScreen } from '@/app/components/ErrorScreen'

// Cadangan terakhir bila RootLayout sendiri yang error. Karena layout ikut diganti,
// berkas ini wajib membawa <html>, <body>, font, dan CSS sendiri.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="id">
      <body>
        <ErrorScreen
          code="500"
          onRetry={reset}
          digest={error.digest}
          detail={process.env.NODE_ENV === 'development' ? error.message : undefined}
        />
      </body>
    </html>
  )
}