import { useEffect, useState } from 'react'

/** Nilai yang baru ikut berubah setelah `delay` ms tidak ada perubahan lagi (untuk kolom cari). */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
