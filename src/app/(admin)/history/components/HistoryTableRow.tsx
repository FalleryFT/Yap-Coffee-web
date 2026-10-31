import { Banknote, FileText, MessageSquare, QrCode } from 'lucide-react'
import type { HistoryRow } from '@/types/history'
import { shortDate } from '@/utils/history'
import { StatusBadge } from './StatusBadge'

interface Props {
  row: HistoryRow
  onReceipt: (row: HistoryRow) => void
}

export function HistoryTableRow({ row: r, onReceipt }: Props) {
  return (
    <tr className="align-middle">
      <td className="px-3 py-6">
        <div className="text-[14px] font-bold text-espresso">#ORD-{r.id}</div>
        <div className="text-[12px] text-bark">
          {shortDate(r.date)} • {r.time} WIB
        </div>
      </td>
      <td className="px-3 py-6">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${r.tone}`}>
            {r.ini}
          </span>
          <div>
            <div className="text-[14px] font-semibold text-ink">{r.name}</div>
            <div className="flex items-center gap-1 text-[12px] text-bark">
              <MessageSquare size={11} />{r.ph}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-6 text-[14px]">
        <div className="font-medium text-ink">{r.item}</div>
        <span className="mt-2 inline-block rounded bg-sand px-2 py-1.5 text-[12px] text-bark">
          {r.mod}
        </span>
      </td>
      <td className="px-3 py-6 text-[14px]">
        <div className="font-medium text-ink">{r.spot}</div>
        <div className="text-[12px] text-mocha">Sesi Pagi (08:30 - 10:00)</div>
      </td>
      <td className="px-3 py-6">
        <div
          className={`text-[14px] font-bold ${r.status === 'batal' ? 'text-mist line-through' : 'text-espresso'}`}
        >
          Rp {r.total}
        </div>
        <div className="flex items-center gap-1 text-[12px] text-bark">
          {r.pay === 'QRIS Instan' ? <QrCode size={12} /> : <Banknote size={12} />}
          {r.pay}
        </div>
      </td>
      <td className="px-3 py-6">
        <StatusBadge status={r.status} />
      </td>
      <td className="px-3 py-6 text-right">
        <button
          onClick={() => onReceipt(r)}
          disabled={r.status === 'batal'}
          className="inline-flex items-center gap-1.5 rounded-md bg-sand px-3 py-2 text-[12px] font-semibold text-ink hover:bg-line disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-sand"
        >
          <FileText size={13} />Struk
        </button>
      </td>
    </tr>
  )
}
