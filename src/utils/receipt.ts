import { formatNumber } from '@/lib/format'

export const rupiah = (value: number) => `Rp ${formatNumber(value)}`

export function formatTransactionTime(iso: string): string {
  const d = new Date(iso)
  const date = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${date} • ${hh}:${mm}`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}
