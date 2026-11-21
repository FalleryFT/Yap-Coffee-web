import { Coffee, FileQuestion, Lock, RotateCw, ServerCrash, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

// Isi teks tiap jenis error. Tambah kode baru (mis. 429) cukup dengan menambah satu entri.
const errorVariants = {
  '500': {
    icon: <ServerCrash size={26} aria-hidden />,
    label: 'ERROR 500',
    title: 'Terjadi Kesalahan di Server',
    description:
      'Maaf, halaman ini tidak bisa dimuat. Coba muat ulang sebentar lagi. Jika masalah berlanjut, hubungi pengembang.',
  },
  '503': {
    icon: <TriangleAlert size={26} aria-hidden />,
    label: 'ERROR 503',
    title: 'Layanan Sedang Tidak Tersedia',
    description: 'Server sedang sibuk atau dalam perawatan. Silakan coba lagi beberapa saat lagi.',
  },
  '404': {
    icon: <FileQuestion size={26} aria-hidden />,
    label: 'ERROR 404',
    title: 'Halaman Tidak Ditemukan',
    description: 'Halaman yang Anda cari tidak ada atau sudah dipindahkan.',
  },
  '403': {
    icon: <Lock size={26} aria-hidden />,
    label: 'ERROR 403',
    title: 'Akses Ditolak',
    description: 'Akun Anda tidak punya izin untuk membuka halaman ini.',
  },
} as const

export type ErrorCode = keyof typeof errorVariants

interface ErrorScreenProps {
  code?: ErrorCode
  /** Dipanggil tombol "Coba Lagi". Tanpa ini, tombolnya tidak ditampilkan. */
  onRetry?: () => void
  /** Tujuan tombol kembali (default: /dashboard). */
  homeHref?: string
  /** Kode referensi (error.digest) supaya mudah dilacak di log server. */
  digest?: string
  /** Pesan teknis; hanya dikirim saat mode development. */
  detail?: ReactNode
}

// Tampilan error satu halaman. Tata letak, warna, dan font sama dengan halaman login
// (kartu putih rounded-2xl + shadow-card di atas latar krem, tombol espresso).
export function ErrorScreen({ code = '500', onRetry, homeHref = '/dashboard', digest, detail }: ErrorScreenProps) {
  const v = errorVariants[code]

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-8">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-espresso text-white">
            <Coffee size={20} aria-hidden />
          </span>
          <span className="text-[1.75rem] leading-none font-bold tracking-tight text-espresso">Yap Coffee</span>
        </div>
        <p className="mt-2 text-xs font-medium tracking-wide text-bark">ADMIN PORTAL</p>
      </header>

      <section role="alert" className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-card">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-sand text-espresso">{v.icon}</span>
        <p className="mt-4 text-xs font-semibold tracking-wide text-mocha">{v.label}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-espresso">{v.title}</h1>
        <p className="mx-auto mt-2 max-w-80 text-sm leading-normal text-bark">{v.description}</p>

        {detail && (
          <p className="mt-5 rounded-lg bg-danger-soft px-4 py-3 text-left font-mono text-xs break-words text-danger">
            {detail}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-espresso px-6 text-[15px] font-semibold text-white shadow-lg shadow-espresso/25 transition hover:bg-espresso/90 focus-visible:ring-2 focus-visible:ring-espresso focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <RotateCw size={18} aria-hidden />
              Coba Lagi
            </button>
          )}
          <a
            href={homeHref}
            className="flex h-12 items-center justify-center rounded-lg bg-sand px-6 text-[15px] font-medium text-ink transition hover:bg-line focus-visible:ring-2 focus-visible:ring-espresso/40 focus-visible:outline-none"
          >
            Kembali ke Dashboard
          </a>
        </div>

        {digest && <p className="mt-6 text-[11px] text-mist">Kode referensi: {digest}</p>}
      </section>

      <footer className="mt-6 text-center text-xs text-bark">
        Yap Coffee © {new Date().getFullYear()} • Khusus Akses Pengelola Gerai
      </footer>
    </main>
  )
}