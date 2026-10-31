import { Lock } from 'lucide-react'
import { useId } from 'react'
import type { LucideIcon } from 'lucide-react'
import { FieldShell, boxClass } from './FieldShell'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  error?: string
  autoFocus?: boolean
  /** Terkunci: tampil seperti biasa tetapi tidak bisa diubah. */
  disabled?: boolean
}

export function TextField({ label, value, onChange, placeholder, icon: Icon, error, autoFocus, disabled }: Props) {
  const id = useId()
  return (
    <FieldShell label={label} htmlFor={id} error={error}>
      <div className={boxClass(error, disabled)}>
        {Icon && <Icon size={16} className="shrink-0 text-mocha" />}
        <input
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          className="w-full bg-transparent text-ink outline-none placeholder:text-mist disabled:cursor-not-allowed disabled:text-bark"
        />
        {disabled && <Lock size={14} className="shrink-0 text-mist" />}
      </div>
    </FieldShell>
  )
}