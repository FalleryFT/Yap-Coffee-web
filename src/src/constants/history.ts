import type { DropdownOption } from '@/types/history'

export const PAGE_SIZE = 8
export const TICK_COUNT = 4

// Bulan berjalan 'YYYY-MM', dihitung dari tanggal perangkat.
const now = new Date()
export const CURRENT_MONTH = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

export const statusOptions: DropdownOption[] = [
  { value: 'semua', label: 'Semua Status' },
  { value: 'selesai', label: 'Selesai Diambil' },
  { value: 'batal', label: 'Dibatalkan' },
]
