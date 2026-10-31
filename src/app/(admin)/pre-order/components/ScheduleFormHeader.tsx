import { CalendarCog, CalendarPlus, X } from 'lucide-react'

interface Props {
  titleId: string
  isEdit: boolean
  onClose: () => void
}

export function ScheduleFormHeader({ titleId, isEdit, onClose }: Props) {
  const HeaderIcon = isEdit ? CalendarCog : CalendarPlus

  return (
    <header className="flex items-start gap-3 border-b border-line pb-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-espresso text-white">
        <HeaderIcon size={20} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 id={titleId} className="text-xl font-bold text-espresso">
          {isEdit ? 'Edit Jadwal Pre-Order' : 'Tambah Jadwal Pre-Order'}
        </h2>
        <p className="text-sm">
          {isEdit
            ? 'Perbarui informasi sesi kloter seduh, titik temu pengambilan, dan jam cut-off pemesanan.'
            : 'Atur jadwal kloter seduh dan titik temu pengambilan kopi tetangga.'}
        </p>
      </div>
      <button type="button" onClick={onClose} className="text-bark hover:text-espresso" aria-label="Tutup">
        <X size={20} />
      </button>
    </header>
  )
}
