import { ArrowRight } from 'lucide-react'
import type { PreOrderSchedule } from '@/types/admin'
import { ScheduleRow } from './ScheduleRow'

const headCell =
  'px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-bark uppercase'

interface ScheduleTableProps {
  schedules: PreOrderSchedule[]
  onEdit: (schedule: PreOrderSchedule) => void
  onDelete: (schedule: PreOrderSchedule) => void
}

export function ScheduleTable({ schedules, onEdit, onDelete }: ScheduleTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-espresso">Daftar Jadwal PreOrder</h2>
          <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-bark">
            {schedules.length} Jadwal
          </span>
        </div>
        <p className="flex items-center gap-1.5 text-xs">
          Alur: <span className="font-medium text-espresso">Jadwal PreOrder</span>
          <ArrowRight size={12} />
          <span className="text-mocha">Edit Jadwal</span> /{' '}
          <span className="text-danger">Hapus Jadwal</span>
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[60rem] border-collapse">
          <thead className="bg-sand">
            <tr>
              <th className={headCell}>Set Hari (Hari &amp; Tanggal)</th>
              <th className={headCell}>Set Lokasi (Titik Pickup)</th>
              <th className={headCell}>Set Jam (Jam Pickup &amp; Cut-off)</th>
              <th className={`${headCell} text-center`}>Status Jadwal</th>
              <th className={`${headCell} text-right`}>Aksi Jadwal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {schedules.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-mist">
                  Belum ada jadwal pre-order. Klik tombol &quot;+ Jadwal&quot; untuk menambahkan.
                </td>
              </tr>
            )}
            {schedules.map((s) => (
              <ScheduleRow key={s.id} schedule={s} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-6 py-3 text-xs">
        <p>
          Menampilkan {schedules.length} dari {schedules.length} jadwal pre-order aktif
        </p>
        <p className="font-medium text-espresso">
          Semua alur tersinkronisasi otomatis dengan portal pelanggan
        </p>
      </footer>
    </section>
  )
}
