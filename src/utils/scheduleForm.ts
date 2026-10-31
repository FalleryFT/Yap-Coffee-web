import { parseGoogleMapsUrl } from '@/lib/maps'
import type { PreOrderSchedule } from '@/types/admin'
import type { Errors, FormState, ScheduleFormValues } from '@/types/preOrder'

function parseTimes(text: string): string[] {
  return Array.from(text.matchAll(/(\d{1,2}):(\d{2})/g), (m) => `${m[1].padStart(2, '0')}:${m[2]}`)
}

export function toState(schedule?: PreOrderSchedule): FormState {
  if (!schedule) {
    return {
      name: '',
      date: '',
      location: '',
      locationDetail: '',
      mapsUrl: '',
      pickupStart: '',
      pickupEnd: '',
      cutOffTime: '',
    }
  }
  const [pickupStart = '', pickupEnd = ''] = parseTimes(schedule.pickupTime)
  const [cutOffTime = ''] = parseTimes(schedule.cutOff)
  return {
    name: schedule.name,
    date: schedule.date,
    location: schedule.location,
    locationDetail: schedule.locationDetail,
    mapsUrl: schedule.mapsUrl ?? '',
    pickupStart,
    pickupEnd,
    cutOffTime,
  }
}

// Saat edit, tanggal, link Google Maps, dan jam terkunci sehingga tidak divalidasi ulang.
export function validate(values: FormState, isEdit = false): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Nama kloter wajib diisi.'
  if (!values.location.trim()) errors.location = 'Nama titik lokasi wajib diisi.'
  if (isEdit) return errors

  if (!values.date) errors.date = 'Tanggal wajib dipilih.'

  if (!values.mapsUrl.trim()) {
    errors.mapsUrl = 'Link Google Maps wajib diisi.'
  } else {
    const result = parseGoogleMapsUrl(values.mapsUrl)
    if (!result.ok) errors.mapsUrl = result.reason
  }

  if (!values.pickupStart) errors.pickupStart = 'Jam mulai wajib dipilih.'
  if (!values.pickupEnd) errors.pickupEnd = 'Jam selesai wajib dipilih.'
  if (values.pickupStart && values.pickupEnd && values.pickupEnd <= values.pickupStart) {
    errors.pickupEnd = 'Jam selesai harus setelah jam mulai.'
  }
  if (!values.cutOffTime) errors.cutOffTime = 'Batas pemesanan wajib dipilih.'
  return errors
}

export function toSubmitValues(values: FormState): ScheduleFormValues {
  return {
    name: values.name.trim(),
    date: values.date,
    location: values.location.trim(),
    locationDetail: values.locationDetail.trim(),
    mapsUrl: values.mapsUrl.trim(),
    pickupTime: `${values.pickupStart} - ${values.pickupEnd} WIB`,
    cutOff: `${values.cutOffTime} WIB`,
  }
}