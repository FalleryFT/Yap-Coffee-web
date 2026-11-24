// Cache sisi klien (di memori tab) dengan pola stale-while-revalidate:
// data lama langsung tampil, lalu disegarkan di latar belakang bila sudah kedaluwarsa.

export const TTL = {
  short: 10_000, // data yang sering berubah (pesanan, dashboard)
  normal: 60_000, // menu, jadwal, riwayat
  long: 300_000, // profil admin, pengaturan outlet
} as const

export interface CacheEntry {
  data: unknown
  /** Waktu data diterima (ms). */
  at: number
  /** true = sudah dibatalkan (invalidate), wajib diambil ulang pada pemakaian berikutnya. */
  stale: boolean
}

const MAX_ENTRIES = 80

const store = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<unknown>>()
const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

export function subscribeCache(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getEntry(key: string): CacheEntry | undefined {
  return store.get(key)
}

export function isFresh(key: string, ttl: number): boolean {
  const entry = store.get(key)
  return entry !== undefined && !entry.stale && Date.now() - entry.at < ttl
}

export function setCached<T>(key: string, data: T): void {
  store.delete(key) // pindahkan ke posisi paling baru
  store.set(key, { data, at: Date.now(), stale: false })
  while (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value
    if (oldest === undefined) break
    store.delete(oldest)
  }
  emit()
}

/** Mengubah data yang sudah ada di cache (mis. mengganti satu baris) tanpa mengubah waktu ambilnya. */
export function updateCached<T>(key: string, updater: (prev: T) => T): void {
  const entry = store.get(key)
  if (!entry) return
  store.set(key, { ...entry, data: updater(entry.data as T) })
  emit()
}

/** Menandai semua entri berawalan `prefixes` sebagai kedaluwarsa; data lama tetap tampil sampai diganti. */
export function invalidateCache(...prefixes: string[]): void {
  const match = (key: string) => prefixes.some((prefix) => key.startsWith(prefix))
  let changed = false
  for (const [key, entry] of store) {
    if (match(key) && !entry.stale) {
      store.set(key, { ...entry, stale: true })
      changed = true
    }
  }
  for (const key of inflight.keys()) {
    if (match(key)) inflight.delete(key)
  }
  if (changed) emit()
}

export function clearCache(): void {
  store.clear()
  inflight.clear()
  emit()
}

/** Mengambil data lewat `fetcher` dan menyimpannya. Permintaan yang sama yang sedang berjalan dipakai bersama. */
export function fetchCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const running = inflight.get(key) as Promise<T> | undefined
  if (running) return running

  const request: Promise<T> = fetcher()
    .then((data) => {
      if (inflight.get(key) === request) {
        setCached(key, data)
      } else if (!store.has(key)) {
        // Dibatalkan selama permintaan berjalan: tetap dipakai, tetapi ditandai kedaluwarsa.
        store.set(key, { data, at: Date.now(), stale: true })
        emit()
      }
      return data
    })
    .finally(() => {
      if (inflight.get(key) === request) inflight.delete(key)
    })

  inflight.set(key, request)
  return request
}