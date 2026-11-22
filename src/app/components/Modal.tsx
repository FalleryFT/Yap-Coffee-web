'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { formatNumber } from '@/lib/format'

interface ModalProps {
  onClose: () => void
  /** id elemen judul di dalam isi modal, untuk aria-labelledby. */
  labelledBy: string
  widthClass?: string
  /**
   * Tempel popup ke atas (bukan di tengah vertikal), sehingga posisi atasnya tetap
   * walau tinggi isinya berubah (mis. form Tambah Menu: Makanan vs Minuman).
   */
  anchorTop?: boolean
  children: ReactNode
}

// Kerangka popup: latar gelap, Esc / klik di luar untuk menutup, kunci scroll halaman.
// Pemanggil sebaiknya memberi onClose yang stabil (useCallback).
export function Modal({ onClose, labelledBy, widthClass = 'max-w-xl', anchorTop = false, children }: ModalProps) {
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
        className={`flex min-h-full justify-center ${anchorTop ? 'items-start px-4 pb-4 pt-[5vh]' : 'items-center p-4'}`}
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