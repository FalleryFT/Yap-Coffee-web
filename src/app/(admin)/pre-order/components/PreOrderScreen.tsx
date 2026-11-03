'use client'

import { CirclePlus } from 'lucide-react'
import { useSchedules } from '@/hooks/pre-order/useSchedules'
import { DeleteScheduleModal } from './DeleteScheduleModal'
import { ScheduleFormModal } from './ScheduleFormModal'
import { ScheduleTable } from './ScheduleTable'

export function PreOrderScreen() {
  const {
    schedules, loading, loadError, reload,
    dialog, setDialog, closeDialog,
    addSchedule, editSchedule, deleteSchedule,
  } = useSchedules()

  return (
    <main className="flex flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-espresso">Jadwal &amp; Sesi Pre-Order</h1>
          <p className="mt-2 max-w-3xl text-sm">
            Atur dan kelola sesi kloter seduh komunal Yap Coffee: penentuan hari, titik lokasi
            pengambilan, serta jam pickup &amp; cut-off.
          </p>
        </div>
        <button
          onClick={() => setDialog({ type: 'add' })}
          className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white shadow-card hover:bg-espresso/90"
        >
          <CirclePlus size={18} />
          Jadwal
        </button>
      </header>

      {loading ? (
        <p className="rounded-2xl border border-line bg-white px-6 py-14 text-center text-sm text-mist">
          Memuat jadwal…
        </p>
      ) : loadError ? (
        <div className="rounded-2xl border border-line bg-white px-6 py-14 text-center text-sm">
          <p className="text-danger">{loadError}</p>
          <button
            onClick={reload}
            className="mt-4 rounded-lg bg-espresso px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-espresso/90"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <ScheduleTable
          schedules={schedules}
          onEdit={(schedule) => setDialog({ type: 'edit', schedule })}
          onDelete={(schedule) => setDialog({ type: 'delete', schedule })}
        />
      )}

      {dialog?.type === 'add' && (
        <ScheduleFormModal mode="add" onSubmit={addSchedule} onClose={closeDialog} />
      )}
      {dialog?.type === 'edit' && (
        <ScheduleFormModal
          mode="edit"
          schedule={dialog.schedule}
          onSubmit={(values) => editSchedule(dialog.schedule, values)}
          onClose={closeDialog}
        />
      )}
      {dialog?.type === 'delete' && (
        <DeleteScheduleModal
          schedule={dialog.schedule}
          onConfirm={() => deleteSchedule(dialog.schedule)}
          onClose={closeDialog}
        />
      )}
    </main>
  )
}
