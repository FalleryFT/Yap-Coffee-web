import type { PreOrderSchedule } from '@/types/admin'

const style: Record<PreOrderSchedule['status'], { label: string; badge: string; dot: string }> = {
  aktif: { label: 'Sesi Aktif', badge: 'bg-[#e8ecd8] text-olive', dot: 'bg-olive' },
  mendatang: { label: 'Sesi Mendatang', badge: 'bg-[#e9e6df] text-bark', dot: 'bg-mist' },
  berakhir: { label: 'Sesi Berakhir', badge: 'bg-sand text-mist', dot: 'bg-mist' },
}

export function ScheduleStatusBadge({ status }: { status: PreOrderSchedule['status'] }) {
  const s = style[status]
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.badge}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}