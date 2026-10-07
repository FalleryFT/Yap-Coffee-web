import { Clock, MapPin } from 'lucide-react'
import { preOrderSchedules } from '../../data/dummy'
import { describeDate } from '../../lib/format'

const headCell =
  'px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-bark uppercase'

export function PreOrderScheduleCard() {
  const rows = preOrderSchedules

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <header className="flex items-center gap-3 px-6 py-5">
        <h2 className="text-lg font-bold text-espresso">Daftar Jadwal PreOrder</h2>
        <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-bark">
          {preOrderSchedules.length} Jadwal
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <thead className="bg-sand">
            <tr>
              <th className={headCell}>Set Hari (Hari &amp; Tanggal)</th>
              <th className={headCell}>Set Lokasi (Titik Pickup)</th>
              <th className={headCell}>Set Jam (Jam Pickup &amp; Cut-off)</th>
              <th className={headCell}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((s) => {
              const d = describeDate(s.date)
              return (
                <tr key={s.id} className="align-top text-sm">
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
                  <td className="px-4 py-4">
                    <span
                      className={[
                        'inline-block rounded-full px-3 py-1 text-xs font-semibold',
                        s.status === 'aktif'
                          ? 'bg-[#e8ecd8] text-olive'
                          : 'bg-sand text-bark',
                      ].join(' ')}
                    >
                      {s.status === 'aktif' ? '● Aktif' : '○ Mendatang'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}