import { useEffect } from 'react'

// Esc untuk menutup + kunci scroll halaman di belakangnya, hanya selagi drawer mobile terbuka.
// Di layar lg ke atas, `open` tidak pernah bisa true (tombol pemicunya disembunyikan via lg:hidden),
// jadi efek ini otomatis tidak aktif di desktop.
export function useDrawerLock(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])
}
