'use client'

import { X } from 'lucide-react'
import { useEscapeAndScrollLock } from '@/hooks/useEscapeAndScrollLock'
import { ReceiptItems } from './receipt/ReceiptItems'
import { ReceiptStoreInfo } from './receipt/ReceiptStoreInfo'
import { ReceiptTotals } from './receipt/ReceiptTotals'
import type { ReceiptData } from '@/types/receipt'

type ReceiptModalProps = {
  receipt: ReceiptData | null
  onClose: () => void
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  useEscapeAndScrollLock(receipt !== null, onClose)

  if (!receipt) return null

  const r = receipt

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1a0c]/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Struk ${r.receiptNo}`}
        className="relative max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-[20px] bg-white text-[#3b2a1c] shadow-[0_24px_60px_-12px_rgba(74,42,16,0.35)]"
      >
        {/* aksen atas */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#6b4a2e] to-[#ecd9c6]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup struk"
          className="absolute right-5 top-6 rounded-md p-1 text-[#4a3526] transition hover:bg-[#f3f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6b4a2e]"
        >
          <X size={18} />
        </button>

        <div className="px-6 pb-6 pt-5">
          <ReceiptStoreInfo r={r} />
          <ReceiptItems r={r} />

          <hr className="my-5 border-t border-dashed border-[#d9d3c8]" />

          <ReceiptTotals r={r} />
        </div>
      </div>
    </div>
  )
}
