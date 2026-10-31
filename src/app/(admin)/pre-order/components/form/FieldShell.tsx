import type { ReactNode } from 'react'

export function boxClass(error?: string, disabled?: boolean) {
  const base = 'flex h-11 items-center gap-2 rounded-lg border px-3 text-sm'
  if (disabled) return `${base} cursor-not-allowed border-line bg-sand text-bark`
  return [
    base,
    'bg-white focus-within:ring-2 focus-within:ring-espresso/20',
    error ? 'border-danger' : 'border-line',
  ].join(' ')
}

interface Props {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

export function FieldShell({ label, htmlFor, error, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}