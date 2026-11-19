import { ChevronDown, Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { TimeClock } from '@mui/x-date-pickers/TimeClock'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { usePopover } from '@/hooks/pre-order/usePopover'
import { FieldShell, boxClass } from './FieldShell'

interface Props {
  label: string
  /** Format "HH:mm" (24 jam), atau string kosong jika belum dipilih. */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  error?: string
  /** Sisi tempat popup jam dibuka, agar tidak keluar dari modal. */
  align?: 'left' | 'right'
  /** Terkunci: tampil seperti biasa tetapi tidak bisa diubah. */
  disabled?: boolean
}

export function TimeClockField({
  label,
  value,
  onChange,
  placeholder = 'Pilih jam',
  icon: Icon,
  error,
  align = 'left',
  disabled,
}: Props) {
  const id = useId()
  const { isOpen, setIsOpen, containerRef } = usePopover()
  const popupRef = useRef<HTMLDivElement>(null)
  const [openUp, setOpenUp] = useState(false)

  // Buka ke bawah kalau muat; kalau ruang di bawah kurang dan di atas lebih lega, buka ke atas.
  // Diukur sebelum browser menggambar, jadi popup tidak sempat "loncat".
  useLayoutEffect(() => {
    if (!isOpen) return
    const trigger = containerRef.current
    const popup = popupRef.current
    if (!trigger || !popup) return
    const rect = trigger.getBoundingClientRect()
    const needed = popup.offsetHeight + 8
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    setOpenUp(spaceBelow < needed && spaceAbove > spaceBelow)
  }, [isOpen, containerRef])

  const clockValue = value ? dayjs(`2000-01-01T${value}`) : null

  return (
    <FieldShell label={label} htmlFor={id} error={error}>
      <div ref={containerRef} className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-invalid={Boolean(error)}
          className={`${boxClass(error, disabled)} w-full justify-between pr-2 text-left ${disabled ? '' : 'cursor-pointer'}`}
        >
          <span className="flex min-w-0 items-center gap-2">
            {Icon && <Icon size={16} className="shrink-0 text-mocha" />}
            <span className={value ? (disabled ? 'text-bark' : 'text-ink') : 'text-mist'}>
              {value ? `${value} WIB` : placeholder}
            </span>
          </span>
          {disabled ? (
            <Lock size={14} className="mr-1 shrink-0 text-mist" />
          ) : (
            <ChevronDown
              size={16}
              className={`shrink-0 text-bark transition-transform duration-200 ${isOpen ? 'rotate-180 text-espresso' : ''}`}
            />
          )}
        </button>

        {isOpen && !disabled && (
          <div
            ref={popupRef}
            role="dialog"
            aria-label={`Pilih ${label}`}
            className={`absolute z-40 rounded-xl border border-line bg-white p-3 shadow-xl ${
              openUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            } ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            <p className="text-center text-2xl font-bold text-espresso tabular-nums">
              {value || '--:--'}
            </p>
            <TimeClock
              value={clockValue}
              ampm={false}
              minutesStep={5}
              onChange={(next, selectionState) => {
                if (!next || !next.isValid()) return
                onChange(next.format('HH:mm'))
                // Setelah menit dipilih, popup otomatis tertutup.
                if (selectionState === 'finish') setIsOpen(false)
              }}
            />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-1 h-9 w-full rounded-lg bg-sand text-xs font-medium text-espresso hover:bg-line"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </FieldShell>
  )
}