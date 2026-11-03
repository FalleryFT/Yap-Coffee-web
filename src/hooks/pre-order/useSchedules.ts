import { useCallback, useEffect, useState } from 'react'
import { toApiError } from '@/lib/apiError'
import {
  createSchedule,
  deleteSchedule as deleteScheduleApi,
  getSchedules,
  toCreatePayload,
  toUpdatePayload,
  updateSchedule,
} from '@/services/scheduleService'
import type { PreOrderSchedule } from '@/types/admin'
import type { Dialog, ScheduleFormValues } from '@/types/preOrder'

function sortSchedules(list: PreOrderSchedule[]): PreOrderSchedule[] {
  return [...list].sort(
    (a, b) => a.date.localeCompare(b.date) || a.pickupTime.localeCompare(b.pickupTime),
  )
}

export function useSchedules() {
  const [schedules, setSchedules] = useState<PreOrderSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [dialog, setDialog] = useState<Dialog>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(null)
    getSchedules()
      .then((data) => active && setSchedules(sortSchedules(data)))
      .catch((err) => active && setLoadError(toApiError(err).message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])
  const closeDialog = useCallback(() => setDialog(null), [])

  // Galat sengaja dilempar ulang (sebagai ApiError) agar modal bisa menampilkannya.
  // Dialog hanya ditutup bila permintaan berhasil.
  async function addSchedule(values: ScheduleFormValues) {
    try {
      const created = await createSchedule(toCreatePayload(values))
      setSchedules((prev) => sortSchedules([...prev, created]))
      closeDialog()
    } catch (err) {
      throw toApiError(err)
    }
  }

  async function editSchedule(target: PreOrderSchedule, values: ScheduleFormValues) {
    try {
      const updated = await updateSchedule(target.id, toUpdatePayload(values))
      setSchedules((prev) => sortSchedules(prev.map((s) => (s.id === updated.id ? updated : s))))
      closeDialog()
    } catch (err) {
      throw toApiError(err)
    }
  }

  async function deleteSchedule(target: PreOrderSchedule) {
    try {
      await deleteScheduleApi(target.id)
      setSchedules((prev) => prev.filter((s) => s.id !== target.id))
      closeDialog()
    } catch (err) {
      throw toApiError(err)
    }
  }

  return {
    schedules, loading, loadError, reload,
    dialog, setDialog, closeDialog,
    addSchedule, editSchedule, deleteSchedule,
  }
}
