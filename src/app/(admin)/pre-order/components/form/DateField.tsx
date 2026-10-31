import { CalendarDays, Lock } from 'lucide-react'
import { useId, useRef } from 'react'
import { describeDate } from '@/lib/format'
import { FieldShell, boxClass } from './FieldShell'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  /** Terkunci: tampil seperti biasa tetapi tidak bisa diubah. */
  disabled?: boolean
}

// Tampilan "Jumat, 25 Oktober 2024"; input date asli ditaruh transparan di atasnya.
export function DateField({ label, value, onChange, error, disabled }: Props) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  function openPicker() {
    try {
      inputRef.current?.showPicker()
    } catch {
      // Browser tidak mengizinkan: input tetap bisa dipakai lewat keyboard.
    }
  }

  return (
    <FieldShell label={label} htmlFor={id} error={error}>
      <div className={`relative ${boxClass(error, disabled)}`}>
        <CalendarDays size={16} className="shrink-0 text-mocha" />
        <span className={value ? (disabled ? 'text-bark' : 'text-ink') : 'text-mist'}>
          {value ? describeDate(value).dateLong : 'Pilih tanggal'}
        </span>
        {disabled && <Lock size={14} className="ml-auto shrink-0 text-mist" />}
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onClick={openPicker}
          aria-invalid={Boolean(error)}
          className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
      </div>
    </FieldShell>
  )
}