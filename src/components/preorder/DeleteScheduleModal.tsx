import { CalendarX, Clock, MapPin, TriangleAlert, X } from 'lucide-react'
import { useId } from 'react'
import { describeDate } from '../../lib/format'
import type { PreOrderSchedule } from '../../types/admin'
import { Modal } from '../Modal'

interface DeleteScheduleModalProps {
  schedule: PreOrderSchedule
  onConfirm: () => void
  onClose: () => void
}

export function DeleteScheduleModal({ schedule, onConfirm, onClose }: DeleteScheduleModalProps) {
  const titleId = useId()

  return (
    <Modal onClose={onClose} labelledBy={titleId} widthClass="max-w-lg">
      <header className="flex items-center justify-between">
        <span className="flex items-center gap-2 rounded-full bg-danger-soft py-1.5 pr-4 pl-2 text-xs font-bold tracking-wide text-danger uppercase">
          <span className="flex size-5 items-center justify-center rounded-full bg-danger text-white">
            <TriangleAlert size={12} />
          </span>
          Peringatan Sistem
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full bg-sand text-bark hover:bg-line"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>
      </header>

      <h2 id={titleId} className="mt-4 text-2xl font-bold text-espresso">
        Hapus Jadwal Pre-Order Ini?
      </h2>
      <p className="mt-3 text-sm leading-relaxed">
        Apakah Anda yakin ingin menghapus sesi jadwal &quot;
        <strong className="text-espresso">
          {schedule.name} - {schedule.location}
        </strong>
        &quot;? Sesi ini tidak akan lagi muncul di etalase pemesanan tetangga dan slot waktu akan
        ditutup permanen.
      </p>

      <div className="mt-5 flex flex-col gap-2 rounded-xl bg-sand p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="font-bold text-espresso">{schedule.name}</p>
          <span className="shrink-0 rounded-full bg-line px-3 py-0.5 text-xs">
            {describeDate(schedule.date).dateShort}
          </span>
        </div>
        <p className="flex items-center gap-2 text-espresso">
          <MapPin size={16} className="shrink-0 text-mocha" />
          {schedule.location} ({schedule.locationDetail})
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} className="shrink-0 text-mocha" />
          {schedule.pickupTime} • Cut-off: {schedule.cutOff}
        </p>
      </div>

      <footer className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-11 rounded-lg bg-sand px-6 text-sm font-medium text-espresso hover:bg-line"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-11 items-center gap-2 rounded-lg bg-danger px-5 text-sm font-semibold text-white hover:bg-danger/90"
        >
          <CalendarX size={16} />
          Ya, Hapus Jadwal
        </button>
      </footer>
    </Modal>
  )
}