// Pemberitahuan sederhana antar komponen: halaman Pengaturan memberi tahu Topbar dan Sidebar
// bahwa nama outlet atau nama admin berubah, supaya tampil tanpa memuat ulang halaman.
const SETTINGS_CHANGED = 'yap:settings-changed'

export function emitSettingsChanged(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SETTINGS_CHANGED))
}

export function onSettingsChanged(listener: () => void): () => void {
  window.addEventListener(SETTINGS_CHANGED, listener)
  return () => window.removeEventListener(SETTINGS_CHANGED, listener)
}
