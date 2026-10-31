import type { HistoryRow } from '@/types/history'
import { HistoryTableRow } from './HistoryTableRow'
import { Th } from './ui'

interface Props {
  rows: HistoryRow[]
  onReceipt: (row: HistoryRow) => void
}

export function HistoryTable({ rows, onReceipt }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="bg-sand/70">
          <tr>
            <Th>No. Order &amp; Waktu</Th>
            <Th>Pelanggan Tetangga</Th>
            <Th>Detail Menu &amp; Catatan</Th>
            <Th>Titik Pengambilan</Th>
            <Th>Total &amp; Bayar</Th>
            <Th>Status</Th>
            <Th className="text-right">Aksi Nota</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <HistoryTableRow key={r.id} row={r} onReceipt={onReceipt} />
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="py-16 text-center text-bark">
                Tidak ada transaksi yang cocok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
