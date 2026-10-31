import { useCallback, useState } from 'react'
import { preOrderSchedules } from '@/data/dummy'
import type { PreOrderSchedule } from '@/types/admin'
import type { Dialog, ScheduleFormValues } from '@/types/preOrder'

function sortSchedules(list: PreOrderSchedule[]): PreOrderSchedule[] {
  return [...list].sort(
    (a, b) => a.date.localeCompare(b.date) || a.pickupTime.localeCompare(b.pickupTime),
  )
}

export function useSchedules() {
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

  return { schedules, dialog, setDialog, closeDialog, addSchedule, editSchedule, deleteSchedule }
}
