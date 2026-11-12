import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { toApiError } from '@/lib/apiError'
import { parseGoogleMapsUrl } from '@/lib/maps'
import type { PreOrderSchedule } from '@/types/admin'
import { toState, toSubmitValues, validate } from '@/utils/scheduleForm'
import type { Errors, FormState, ScheduleFormValues } from '@/types/preOrder'

const FORM_KEYS: (keyof FormState)[] = [
  'name', 'date', 'location', 'locationDetail', 'mapsUrl', 'coordinates', 'pickupStart', 'pickupEnd', 'cutOffTime',
]

export function useScheduleForm(
  schedule: PreOrderSchedule | undefined,
  onSubmit: (values: ScheduleFormValues) => Promise<void>,
) {
  const isEdit = schedule !== undefined
  const [values, setValues] = useState<FormState>(() => toState(schedule))
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    const found = validate(values, isEdit)
    setErrors(found)
    setSubmitError(null)
    if (Object.keys(found).length > 0) return

    setSaving(true)
    try {
      await onSubmit(toSubmitValues(values))
      // Saat sukses, dialog ditutup oleh useSchedules sehingga modal ini langsung dilepas.
    } catch (err) {
      const apiError = toApiError(err)
      // Galat validasi dari server dipetakan ke kolom yang sama dengan form.
      const serverErrors: Errors = {}
      for (const key of FORM_KEYS) {
        const message = apiError.errorFor(key)
        if (message) serverErrors[key] = message
      }
      // Server memisahkan latitude dan longitude; form hanya punya satu kolom koordinat.
      const coordinatesError = apiError.errorFor('latitude') ?? apiError.errorFor('longitude')
      if (coordinatesError) serverErrors.coordinates = coordinatesError
      setErrors(serverErrors)
      setSubmitError(apiError.message)
      setSaving(false)
    }
  }

  return { values, errors, update, mapsResult, mapsError, saving, submitError, handleSubmit }
}
