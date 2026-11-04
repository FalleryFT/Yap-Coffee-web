export type HistoryStatus = 'selesai' | 'batal'
export type StatusFilter = HistoryStatus | 'semua'

export interface HistoryRow {
  id: string
  date: string // 'YYYY-MM-DD'
  time: string
  name: string
  ini: string
  tone: string
  ph: string
  item: string
  mod: string
  spot: string
  total: string
  pay: string
  status: HistoryStatus
  // Kolom tambahan dari API (boleh diabaikan oleh komponen lama).
  code?: string
  session?: { name: string; hours: string } // contoh: { name: 'Sesi Pagi', hours: '08:30 - 10:00' }
  totalAmount?: number
}

export interface HistoryPage {
  items: HistoryRow[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface HistoryStatsData {
  month: string
  completed: number
  cancelled: number
  total: number
  topMenu: { name: string; qty: number } | null
  revenue: number
}

export type RevenueData =
  | { mode: 'yearly'; points: { key: string; year: number; revenue: number }[] }
  | {
      mode: 'monthly'
      year: number
      points: { key: string; revenue: number | null }[]
      previousDecember: number | null
    }

export interface DropdownOption {
  value: string
  label: string
}

export interface Point {
  key: string
  short: string
  tooltip: string
  revenue: number | null // null = belum ada data
  highlight: boolean
}
