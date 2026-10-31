import type { PreOrderSchedule } from '@/types/admin'

export function ScheduleStatusBadge({ status }: { status: PreOrderSchedule['status'] }) {
  return (
    <span
      className={[
        'flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        status === 'aktif' ? 'bg-[#e8ecd8] text-olive' : 'bg-[#e9e6df] text-bark',
      ].join(' ')}
    >
      <span className={`size-1.5 rounded-full ${status === 'aktif' ? 'bg-olive' : 'bg-mist'}`} />
      {status === 'aktif' ? 'Sesi Aktif' : 'Sesi Mendatang'}
    </span>
  )
}
