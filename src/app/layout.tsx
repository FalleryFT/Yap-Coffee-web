import type { Metadata } from 'next'
import '@fontsource-variable/plus-jakarta-sans'
import './globals.css'

// Catatan: next/font/google adalah alternatif yang lebih "Next.js-native" (font di-host
// sendiri otomatis saat build), tapi mengambil berkas fontnya dari Google Fonts SAAT BUILD
// sehingga build gagal tanpa akses internet (termasuk di balik proxy/firewall ketat).
// @fontsource-variable menyertakan berkas fontnya langsung sebagai paket npm biasa, jadi
// build selalu bisa dilakukan offline. Ganti dengan next/font/google bila itu bukan masalah
// di lingkungan Anda — lihat README.

export const metadata: Metadata = {
  title: {
    default: 'Yap Coffee Admin',
    template: '%s | Yap Coffee',
  },
  description: 'Panel admin Yap Coffee: kelola sesi pre-order, katalog menu, dan antrean pesanan.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
