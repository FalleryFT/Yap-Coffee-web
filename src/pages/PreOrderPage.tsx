import { CirclePlus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { DeleteScheduleModal } from '../components/preorder/DeleteScheduleModal'
import { ScheduleFormModal } from '../components/preorder/ScheduleFormModal'
import type { ScheduleFormValues } from '../components/preorder/ScheduleFormModal'
import { ScheduleTable } from '../components/preorder/ScheduleTable'
import { preOrderSchedules } from '../data/dummy'
import type { PreOrderSchedule } from '../types/admin'

type Dialog =
  | { type: 'add' }
  | { type: 'edit'; schedule: PreOrderSchedule }
  | { type: 'delete'; schedule: PreOrderSchedule }
  | null

function sortSchedules(list: PreOrderSchedule[]): PreOrderSchedule[] {
  return [...list].sort(
    (a, b) => a.date.localeCompare(b.date) || a.pickupTime.localeCompare(b.pickupTime),
  )
}

export default function PreOrderPage() {
  const [schedules, setSchedules] = useState<PreOrderSchedule[]>(preOrderSchedules)
  const [dialog, setDialog] = useState<Dialog>(null)

  const closeDialog = useCallback(() => setDialog(null), [])

  function addSchedule(values: ScheduleFormValues) {
    setSchedules((prev) => {
      const nextId = Math.max(0, ...prev.map((s) => s.id)) + 1
      // "Simpan & Buka Jadwal": sesi baru langsung berstatus aktif.
      const created: PreOrderSchedule = {
        id: nextId,
        ...values,
        cutOffUrgent: false,
        status: 'aktif',
      }
      return sortSchedules([...prev, created])
    })
    closeDialog()
  }

  function editSchedule(target: PreOrderSchedule, values: ScheduleFormValues) {
    setSchedules((prev) =>
      sortSchedules(
        prev.map((s) =>
          s.id === target.id
            ? { ...s, ...values, cutOffUrgent: s.cutOff === values.cutOff ? s.cutOffUrgent : false }
            : s,
        ),
      ),
    )
    closeDialog()
  }

  function deleteSchedule(target: PreOrderSchedule) {
    setSchedules((prev) => prev.filter((s) => s.id !== target.id))
    closeDialog()
  }

  return (
    <main className="flex flex-col gap-6 px-8 py-8">
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