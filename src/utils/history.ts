import { MONTH_ABBR, MONTH_NAMES } from '@/constants/months'

export function shortDate(iso: string): string {
  const [y = '', m = '1', d = '1'] = iso.split('-')
  return `${Number(d)} ${MONTH_ABBR[Number(m) - 1]} ${y}`
}

// value: 'YYYY-MM' atau 'semua'
export function formatMonthLabel(value: string, currentValue: string): string {
  if (value === 'semua') return 'Semua Bulan'
  const [year = '', month = '1'] = value.split('-')
  const label = `${MONTH_NAMES[Number(month) - 1]} ${year}`
  return value === currentValue ? `Bulan Ini - ${label}` : label
}
