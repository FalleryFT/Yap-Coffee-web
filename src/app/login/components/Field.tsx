import type { InputHTMLAttributes, ReactNode } from 'react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  icon: ReactNode
  /** Elemen di sisi kanan input, misalnya tombol lihat/sembunyikan sandi. */
  trailing?: ReactNode
  error?: string
}

export function Field({ id, label, icon, trailing, error, ...input }: FieldProps) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-bark">
          {icon}
        </span>

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={[
            'h-11 w-full rounded-lg bg-white pl-11 text-sm text-ink shadow-field outline-none',
            'placeholder:text-mist focus-visible:ring-2 focus-visible:ring-espresso/40',
            trailing ? 'pr-12' : 'pr-4',
            error ? 'ring-2 ring-danger/60' : '',
          ].join(' ')}
          {...input}
        />

        {trailing && <div className="absolute inset-y-0 right-3 flex items-center">{trailing}</div>}
      </div>

      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
