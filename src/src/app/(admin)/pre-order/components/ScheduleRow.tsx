import { Clock, MapPin, Pencil, Trash2 } from 'lucide-react'
import { describeDate } from '@/lib/format'
import type { PreOrderSchedule, ScheduleStatus } from '@/types/admin'

const statusStyle: Record<ScheduleStatus, { label: string; badge: string; dot?: string }> = {
  aktif: { label: 'Aktif', badge: 'bg-[#e8ecd8] text-olive', dot: 'bg-olive' },
  mendatang: { label: 'Mendatang', badge: 'bg-[#e9e6df] text-bark' },
}

interface Props {
  schedule: PreOrderSchedule
  onEdit: (schedule: PreOrderSchedule) => void
  onDelete: (schedule: PreOrderSchedule) => void
}

export function ScheduleRow({ schedule: s, onEdit, onDelete }: Props) {
  const d = describeDate(s.date)
  const status = statusStyle[s.status]

  return (
    <tr className="align-middle text-sm">
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
                s.cutOffUrgent ? 'bg-danger-soft font-semibold text-danger' : 'bg-sand text-bark',
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
}
