export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white shadow-card ${className}`}>{children}</div>
}

export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`whitespace-nowrap px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-bark ${className}`}
    >
      {children}
    </th>
  )
}

export function Btn({
  variant = 'primary',
  className = '',
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'soft'
}) {
  const v = {
    primary: 'bg-espresso text-white hover:bg-espresso/90 shadow-sm',
    ghost: 'bg-sand text-ink hover:bg-line',
    danger: 'bg-danger text-white hover:bg-red-800',
    soft: 'bg-sand text-ink hover:bg-line',
  }[variant]
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors ${v} ${className}`}
    />
  )
}

// Tombol ikon saja. `label` dipakai untuk tooltip & aria-label.
export function IconBtn({
  label,
  tone = 'neutral',
  className = '',
  children,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  tone?: 'neutral' | 'primary' | 'danger'
}) {
  const t = {
    neutral: 'bg-sand text-espresso enabled:hover:bg-line',
    primary: 'bg-espresso text-white enabled:hover:bg-espresso/90',
    danger: 'bg-sand text-danger enabled:hover:bg-peach',
  }[tone]
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...p}
      className={`grid size-9 place-items-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${t} ${className}`}
    >
      {children}
    </button>
  )
}