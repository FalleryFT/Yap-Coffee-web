import { ArrowRight, Clock, MapPin, Pencil, Trash2 } from 'lucide-react'
import { describeDate } from '../../lib/format'
import type { PreOrderSchedule, ScheduleStatus } from '../../types/admin'

const headCell =
  'px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-bark uppercase'

const statusStyle: Record<ScheduleStatus, { label: string; badge: string; dot?: string }> = {
  aktif: { label: 'Aktif', badge: 'bg-[#e8ecd8] text-olive', dot: 'bg-olive' },
  mendatang: { label: 'Mendatang', badge: 'bg-[#e9e6df] text-bark' },
}

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
            {schedules.map((s) => {
              const d = describeDate(s.date)
              const status = statusStyle[s.status]
              return (
                <tr key={s.id} className="align-middle text-sm">
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-peach leading-none text-mocha">
                        <span className="text-[10px] font-medium">{d.dayShort}</span>
                        <span className="text-base font-bold">{d.dateNumber}</span>
                      </span>
                      <div>
                        <p className="font-bold text-espresso">{s.name}</p>
                        <p className="text-xs">{d.dateLong}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-mocha" />
                      <div>
                        <p className="font-semibold text-espresso">{s.location}</p>
                        <p className="text-xs">{s.locationDetail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-2">
                      <Clock size={16} className="mt-0.5 shrink-0 text-mocha" />
                      <div>
                        <p className="font-semibold text-espresso">{s.pickupTime}</p>
                        <span
                          className={[
                            'mt-1 inline-block rounded px-2 py-0.5 text-xs',
                            s.cutOffUrgent
                              ? 'bg-danger-soft font-semibold text-danger'
                              : 'bg-sand text-bark',
                          ].join(' ')}
                        >
                          Cut-off: {s.cutOff}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}
                    >
                      {status.dot && <span className={`size-1.5 rounded-full ${status.dot}`} />}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(s)}
                        className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-left text-xs leading-tight font-medium text-espresso hover:bg-sand"
                        aria-label={`Edit jadwal ${s.name}`}
                      >
                        <Pencil size={14} />
                        <span>
                          Edit
                          <br />
                          Jadwal
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(s)}
                        className="flex items-center gap-2 rounded-lg border border-[#f2c9c6] bg-danger-soft px-3 py-2 text-left text-xs leading-tight font-medium text-danger hover:bg-[#f9dcd9]"
                        aria-label={`Hapus jadwal ${s.name}`}
                      >
                        <Trash2 size={14} />
                        <span>
                          Hapus
                          <br />
                          Jadwal
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
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