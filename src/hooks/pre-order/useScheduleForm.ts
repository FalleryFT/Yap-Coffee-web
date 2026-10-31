import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { parseGoogleMapsUrl } from '@/lib/maps'
import type { PreOrderSchedule } from '@/types/admin'
import { toState, toSubmitValues, validate } from '@/utils/scheduleForm'
import type { Errors, FormState, ScheduleFormValues } from '@/types/preOrder'

export function useScheduleForm(
  schedule: PreOrderSchedule | undefined,
  onSubmit: (values: ScheduleFormValues) => void,
) {
  const isEdit = schedule !== undefined
  const [values, setValues] = useState<FormState>(() => toState(schedule))
  const [errors, setErrors] = useState<Errors>({})

  function update(key: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // Validasi link langsung saat mengetik, supaya preview peta muncul/hilang real-time.
  const mapsResult = useMemo(
    () => (values.mapsUrl.trim() ? parseGoogleMapsUrl(values.mapsUrl) : null),
    [values.mapsUrl],
  )
  const mapsError = errors.mapsUrl ?? (mapsResult && !mapsResult.ok ? mapsResult.reason : undefined)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values, isEdit)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    onSubmit(toSubmitValues(values))
  }

  return { values, errors, update, mapsResult, mapsError, handleSubmit }
} 