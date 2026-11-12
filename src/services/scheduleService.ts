import { http } from '@/lib/http'
import type { ApiSuccess } from '@/types/api'
import type { PreOrderSchedule } from '@/types/admin'
import { parseCoordinates } from '@/lib/maps'
import type { ScheduleFormValues } from '@/types/preOrder'

// Badan permintaan tambah jadwal (backend/src/validators/scheduleValidators.ts → createScheduleSchema).
export interface CreateSchedulePayload {
  name: string
  date: string
  location: string
  locationDetail: string
  mapsUrl: string
  /** Bila kosong, server mencoba membacanya dari link Maps. */
  latitude?: number
  longitude?: number
  pickupStart: string // 'HH:mm'
  pickupEnd: string // 'HH:mm'
  cutOffTime: string // 'HH:mm'
}

// Saat edit, backend hanya menerima kolom ini (tanggal, maps, dan jam terkunci).
export interface UpdateSchedulePayload {
  name: string
  location: string
  locationDetail: string
  /** null = hapus titik di peta. */
  latitude: number | null
  longitude: number | null
}

const BASE = '/admin/pre-order/schedules'

// "08:30 - 11:30 WIB" -> ["08:30", "11:30"]
function parseTimes(text: string): string[] {
  return Array.from(text.matchAll(/(\d{1,2}):(\d{2})/g), (m) => `${m[1].padStart(2, '0')}:${m[2]}`)
}

/** Nilai form (jam berupa teks tampilan) → badan permintaan tambah jadwal. */
export function toCreatePayload(values: ScheduleFormValues): CreateSchedulePayload {
  const [pickupStart = '', pickupEnd = ''] = parseTimes(values.pickupTime)
  const [cutOffTime = ''] = parseTimes(values.cutOff)
  const point = parseCoordinates(values.coordinates)
  return {
    name: values.name,
    date: values.date,
    location: values.location,
    locationDetail: values.locationDetail,
    mapsUrl: values.mapsUrl,
    ...(point ? { latitude: point.latitude, longitude: point.longitude } : {}),
    pickupStart,
    pickupEnd,
    cutOffTime,
  }
}

export function toUpdatePayload(values: ScheduleFormValues): UpdateSchedulePayload {
  const point = parseCoordinates(values.coordinates)
  return {
    name: values.name,
    location: values.location,
    locationDetail: values.locationDetail,
    latitude: point?.latitude ?? null,
    longitude: point?.longitude ?? null,
  }
}

export async function getSchedules(): Promise<PreOrderSchedule[]> {
  const { data } = await http.get<ApiSuccess<PreOrderSchedule[]>>(BASE)
  return data.data
}

export async function createSchedule(payload: CreateSchedulePayload): Promise<PreOrderSchedule> {
  const { data } = await http.post<ApiSuccess<PreOrderSchedule>>(BASE, payload)
  return data.data
}

export async function updateSchedule(
  id: number,
  payload: UpdateSchedulePayload,
): Promise<PreOrderSchedule> {
  const { data } = await http.put<ApiSuccess<PreOrderSchedule>>(`${BASE}/${id}`, payload)
  return data.data
}

export async function deleteSchedule(id: number): Promise<void> {
  await http.delete(`${BASE}/${id}`)
}
