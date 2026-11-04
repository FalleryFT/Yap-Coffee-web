export const sumOf = (values: (number | null)[]): number =>
  values.reduce<number>((sum, v) => sum + (v ?? 0), 0)

export function compact(value: number): string {
  if (value === 0) return '0'
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`
  }
  return `${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
}
