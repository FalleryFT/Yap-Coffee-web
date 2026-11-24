import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { fetchCached, getEntry, isFresh, setCached, subscribeCache, TTL, updateCached } from '@/lib/cache'
import { toApiError } from '@/lib/apiError'

interface QueryOptions {
  /** Lama data dianggap segar (ms); selama itu tidak ada permintaan baru. */
  ttl?: number
  enabled?: boolean
  /** Saat kunci berganti dan datanya belum ada, tetap tampilkan data kunci sebelumnya. */
  keepPrevious?: boolean
}

export function useCachedQuery<T>(key: string, fetcher: () => Promise<T>, options: QueryOptions = {}) {
  const { ttl = TTL.normal, enabled = true, keepPrevious = false } = options

  const entry = useSyncExternalStore(subscribeCache, () => getEntry(key), () => undefined)
  const cachedData = entry?.data as T | undefined

  const [errorState, setErrorState] = useState<{ key: string; message: string } | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const fetcherRef = useRef(fetcher)
  const forceRef = useRef(false)
  const lastData = useRef<T | undefined>(undefined)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    if (cachedData !== undefined) lastData.current = cachedData
  }, [cachedData])

  useEffect(() => {
    if (!enabled) return
    const force = forceRef.current
    forceRef.current = false
    setErrorState(null)
    if (!force && isFresh(key, ttl)) return

    let active = true
    fetchCached(key, () => fetcherRef.current()).catch((err) => {
      if (active) setErrorState({ key, message: toApiError(err).message })
    })
    return () => {
      active = false
    }
  }, [key, ttl, enabled, reloadKey])

  const reload = useCallback(() => {
    forceRef.current = true
    setReloadKey((k) => k + 1)
  }, [])

  const mutate = useCallback((updater: (prev: T) => T) => updateCached<T>(key, updater), [key])
  const set = useCallback((value: T) => setCached<T>(key, value), [key])

  const ownError = errorState?.key === key ? errorState.message : null

  return {
    data: cachedData ?? (keepPrevious ? lastData.current : undefined),
    /** true selama data untuk kunci ini belum ada dan belum gagal. */
    isLoading: enabled && cachedData === undefined && ownError === null,
    /** Galat hanya dilaporkan bila belum ada data; kegagalan muat ulang di latar belakang diam-diam. */
    error: cachedData === undefined ? ownError : null,
    updatedAt: entry?.at ?? null,
    reload,
    mutate,
    set,
  }
}