'use client'

import { Check, ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export interface DropdownOption {
  value: string
  label: string
}

interface FilterDropdownProps {
  icon: LucideIcon
  ariaLabel: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  menuClassName?: string
}

export function FilterDropdown({
  icon: Icon,
  ariaLabel,
  value,
  options,
  onChange,
  menuClassName = 'min-w-56',
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex h-12 items-center gap-3 rounded-lg bg-white px-3 text-[14px] transition-colors hover:bg-sand',
          open ? 'ring-2 ring-mocha/40' : '',
        ].join(' ')}
      >
        <Icon size={16} className="text-espresso" />
        <span className="flex items-center gap-6 rounded border border-line px-3 py-1.5 text-ink">
          {selected?.label}
          <ChevronDown
            size={13}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute left-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-line bg-white p-1.5 shadow-card ${menuClassName}`}
        >
          {options.map((o) => {
            const active = o.value === value
            return (
              <li key={o.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className={[
                    'flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left text-[14px] hover:bg-sand',
                    active ? 'bg-sand font-semibold text-espresso' : 'text-ink',
                  ].join(' ')}
                >
                  {o.label}
                  {active && <Check size={15} className="text-olive" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}