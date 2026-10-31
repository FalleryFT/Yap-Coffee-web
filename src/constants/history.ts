import type { DropdownOption } from '@/types/history'

export const PAGE_SIZE = 8
export const TICK_COUNT = 4
export const CURRENT_MONTH = '2024-10'

export const statusOptions: DropdownOption[] = [
  { value: 'semua', label: 'Semua Status' },
  { value: 'selesai', label: 'Selesai Diambil' },
  { value: 'batal', label: 'Dibatalkan' },
]
