// Pemberitahuan sederhana antar komponen: halaman Outlet dan Profile memberi tahu Topbar dan Sidebar
// bahwa nama outlet atau nama admin berubah, supaya tampil tanpa memuat ulang halaman.
const ADMIN_DATA_CHANGED = 'yap:admin-data-changed'

export function emitAdminDataChanged(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(ADMIN_DATA_CHANGED))
}

export function onAdminDataChanged(listener: () => void): () => void {
  window.addEventListener(ADMIN_DATA_CHANGED, listener)
  return () => window.removeEventListener(ADMIN_DATA_CHANGED, listener)
}