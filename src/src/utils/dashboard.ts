/** 14 → "+14%", -3.5 → "-3,5%". Dipakai untuk tren dibanding kemarin / pekan lalu. */
export function formatTrend(percent: number): { text: string; up: boolean } {
  const abs = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(Math.abs(percent))
  const sign = percent > 0 ? '+' : percent < 0 ? '-' : ''
  return { text: `${sign}${abs}%`, up: percent >= 0 }
}
