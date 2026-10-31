// Data dummy per tahun (12 bulan, dalam juta rupiah). Nanti diganti data dari API.
const jt = (...v: (number | null)[]) => v.map((x) => (x === null ? null : x * 1_000_000))
export const REVENUE: Record<number, (number | null)[]> = {
  2022: jt(null, null, null, null, null, null, 18, 22, 25, 28, 31, 35),
  2023: jt(36, 38, 41, 40, 44, 47, 49, 52, 55, 53, 57, 60),
  2024: jt(62, 58, 71, 69, 78, 84, 81, 90, 94, 100, null, null),
}
