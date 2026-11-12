import { NotebookPen } from 'lucide-react'
import type { ReceiptData } from '@/types/receipt'
import { rupiah } from '@/utils/receipt'

export function ReceiptItems({ r }: { r: ReceiptData }) {
  return (
    <>
      <div className="mt-5 flex items-center justify-between border-b border-[#e6e1d8] pb-2 text-[11px] tracking-wide text-[#6f6559]">
        <span>ITEM &amp; KUSTOMISASI</span>
        <span>JUMLAH</span>
      </div>

      {r.items.map((item, i) => (
        <div key={i} className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold">
              {item.qty}× <span className="ml-0.5 font-semibold">{item.name}</span>
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-[#5c5247]">
              {item.lines.map((line, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#4a3526]" />
                  <span>
                    {line.label}: {line.value}
                    {line.extra ? <strong className="text-[#3b2a1c]"> +{rupiah(line.extra)}</strong> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-[#4a2a10]">{rupiah(item.qty * item.unitPrice)}</p>
            <p className="mt-0.5 text-[11px] text-[#8a8073]">@ {rupiah(item.unitPrice)}</p>
          </div>
        </div>
      ))}

      {/* catatan barista */}
      {r.baristaNote ? (
        <div className="mt-4 flex gap-2.5 rounded-xl bg-[#f3f1ea] px-3.5 py-3 text-xs leading-relaxed">
          <NotebookPen size={14} className="mt-0.5 shrink-0 text-[#6f6559]" />
          <p>
            <strong>Catatan Barista:</strong> <em>“{r.baristaNote}”</em>
          </p>
        </div>
      ) : null}
    </>
  )
}
