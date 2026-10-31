'use client'

import { CirclePlus } from 'lucide-react'
import { useSchedules } from '@/hooks/pre-order/useSchedules'
import { DeleteScheduleModal } from './DeleteScheduleModal'
import { ScheduleFormModal } from './ScheduleFormModal'
import { ScheduleTable } from './ScheduleTable'

export function PreOrderScreen() {
  const { schedules, dialog, setDialog, closeDialog, addSchedule, editSchedule, deleteSchedule } =
    useSchedules()

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

      <ScheduleTable
        schedules={schedules}
        onEdit={(schedule) => setDialog({ type: 'edit', schedule })}
        onDelete={(schedule) => setDialog({ type: 'delete', schedule })}
      />

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
