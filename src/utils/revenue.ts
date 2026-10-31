import { REVENUE } from '@/data/revenue'

export const revenueOf = (year: number, monthIndex: number): number | null =>
  REVENUE[year]?.[monthIndex] ?? null

export const sumOf = (values: (number | null)[]): number =>
  values.reduce<number>((sum, v) => sum + (v ?? 0), 0)

export const yearTotal = (year: number): number | null => {
  const values = REVENUE[year]
  if (!values || values.every((v) => v === null)) return null
  return sumOf(values)
}

export function compact(value: number): string {
  if (value === 0) return '0'
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`
  }
  return `${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
}
