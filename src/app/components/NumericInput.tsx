'use client'

import { useLayoutEffect, useRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { formatNumber } from '@/lib/format'

interface NumericInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'inputMode'> {
  value: number
  onValueChange: (value: number) => void
  /** Batas jumlah digit (default 9 → maksimal 999.999.999). */
  maxDigits?: number
  /** true = angka 0 tetap tampil "0"; false = kosong (placeholder muncul). */
  showZero?: boolean
}

/**
 * Input angka bulat yang otomatis diberi titik pemisah ribuan saat mengetik
 * (20000 → "20.000"). Nilai yang dikirim ke `onValueChange` tetap angka murni.
 * Posisi kursor dijaga supaya mengedit di tengah angka tidak melompat ke ujung.
 */
export function NumericInput({
  value,
  onValueChange,
  maxDigits = 9,
  showZero = false,
  ...rest
}: NumericInputProps) {
  const ref = useRef<HTMLInputElement>(null)
  // Jumlah digit di kiri kursor sebelum diformat ulang.
  const digitsBeforeCaret = useRef<number | null>(null)

  const display = value === 0 && !showZero ? '' : formatNumber(value)

  useLayoutEffect(() => {
    const el = ref.current
    const target = digitsBeforeCaret.current
    digitsBeforeCaret.current = null
    if (!el || target === null || document.activeElement !== el) return

    let seen = 0
    let pos = 0
    while (pos < el.value.length && seen < target) {
      if (/\d/.test(el.value[pos] as string)) seen++
      pos++
    }
    el.setSelectionRange(pos, pos)
  })

  return (
    <input
      {...rest}
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={display}
      onChange={(e) => {
        const raw = e.target.value
        const caret = e.target.selectionStart ?? raw.length
        digitsBeforeCaret.current = raw.slice(0, caret).replace(/\D/g, '').length
        const digits = raw.replace(/\D/g, '').slice(0, maxDigits)
        onValueChange(digits ? Number(digits) : 0)
      }}
    />
  )
}
