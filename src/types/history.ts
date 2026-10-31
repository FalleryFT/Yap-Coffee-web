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
