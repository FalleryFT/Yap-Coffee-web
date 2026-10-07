// 1042000 -> "1.042.000"
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}

// "2024-10-25" -> Date lokal (hindari geser zona waktu akibat new Date('2024-10-25')).
export function parseIsoDate(iso: string): Date {
  const [year = 1970, month = 1, day = 1] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Hari & tanggal dihitung dari satu tanggal ISO, jadi tidak mungkin salah hari.
export function describeDate(iso: string) {
  const date = parseIsoDate(iso)
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('id-ID', options).format(date)

  return {
    dayShort: fmt({ weekday: 'short' }).toUpperCase(), // JUM
    dateNumber: date.getDate(), // 25
    dateLong: fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), // Jumat, 25 Oktober 2024
    dateShort: fmt({ weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }), // Jumat, 25 Okt 2024
  }
}