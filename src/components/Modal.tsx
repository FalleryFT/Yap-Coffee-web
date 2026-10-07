import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  onClose: () => void
  /** id elemen judul di dalam isi modal, untuk aria-labelledby. */
  labelledBy: string
  widthClass?: string
  children: ReactNode
}

// Kerangka popup: latar gelap, Esc / klik di luar untuk menutup, kunci scroll halaman.
// Pemanggil sebaiknya memberi onClose yang stabil (useCallback).
export function Modal({ onClose, labelledBy, widthClass = 'max-w-xl', children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Fokus masuk ke popup, kecuali isinya sudah punya autoFocus.
    if (!panelRef.current?.contains(document.activeElement)) panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/35">
      <div
        className="flex min-h-full items-center justify-center p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          className={`w-full ${widthClass} rounded-2xl bg-white p-8 shadow-2xl outline-none`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}