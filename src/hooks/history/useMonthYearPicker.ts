import { useEffect, useRef, useState } from 'react'

export function useMonthYearPicker(
  value: string,
  currentValue: string,
  onChange: (value: string) => void,
) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'month' | 'year'>('month')
  const [viewYear, setViewYear] = useState(() => Number(currentValue.slice(0, 4)))
  const ref = useRef<HTMLDivElement>(null)

  // Tutup saat klik di luar atau tekan Escape.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = () => {
    if (!open) {
      const base = value === 'semua' ? currentValue : value
      setViewYear(Number(base.slice(0, 4)))
      setView('month')
    }
    setOpen((o) => !o)
  }

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  const toggleView = () => setView((v) => (v === 'month' ? 'year' : 'month'))
  const pickYear = (y: number) => {
    setViewYear(y)
    setView('month')
  }

  return { open, view, viewYear, setViewYear, ref, toggle, pick, toggleView, pickYear }
}
