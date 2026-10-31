import type { PreOrderSchedule } from '@/types/admin'

// Nilai yang dikirim ke PreOrderScreen (format sama seperti sebelumnya + mapsUrl).
export interface ScheduleFormValues {
  name: string
  date: string
  location: string
  locationDetail: string
  mapsUrl: string
  pickupTime: string // "08:30 - 11:30 WIB"
  cutOff: string // "07:00 WIB"
}

// State internal form: jam disimpan mentah "HH:mm" agar cocok dengan TimeClock.
export interface FormState {
  name: string
  date: string
  location: string
  locationDetail: string
  mapsUrl: string
  pickupStart: string
  pickupEnd: string
  cutOffTime: string
}

export type Errors = Partial<Record<keyof FormState, string>>

export type Dialog =
  | { type: 'add' }
  | { type: 'edit'; schedule: PreOrderSchedule }
  | { type: 'delete'; schedule: PreOrderSchedule }
  | null
