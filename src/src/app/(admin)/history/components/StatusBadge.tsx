import { CheckCircle2, XCircle } from 'lucide-react'
import type { HistoryStatus } from '@/types/history'

export function StatusBadge({ status }: { status: HistoryStatus }) {
  if (status === 'batal') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-3 py-2 text-[12px] font-semibold text-danger">
        <XCircle size={13} />Dibatalkan
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8ecd8] px-3 py-2 text-[12px] font-semibold text-olive">
      <CheckCircle2 size={13} />Selesai Diambil
    </span>
  )
}
