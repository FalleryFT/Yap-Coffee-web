'use client'

import {
  AlarmClockOff,
  CalendarCog,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  CircleCheck,
  Clock,
  Info,
  Link2,
  MapPin,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimeClock } from '@mui/x-date-pickers/TimeClock'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { describeDate } from '@/lib/format'
import { parseGoogleMapsUrl } from '@/lib/maps'
import type { PreOrderSchedule } from '@/types/admin'
import { MapsEmbed } from '@/app/components/MapsEmbed'
import { Modal } from '@/app/components/Modal'

// Nilai yang dikirim ke PreOrderScreen (format sama seperti sebelumnya + mapsUrl).
export interface ScheduleFormValues {
  name: string
  date: string
  location: string
  locationDetail: string
  mapsUrl: string
  pickupTime: string // "08:30 - 11:30 WIB"
  cutOff: string // "07:00 WIB"
}

// State internal form: jam disimpan mentah "HH:mm" agar cocok dengan TimeClock.
interface FormState {
  name: string
  date: string
  location: string
  locationDetail: string
  mapsUrl: string
  pickupStart: string
  pickupEnd: string
  cutOffTime: string
}

type Errors = Partial<Record<keyof FormState, string>>

function parseTimes(text: string): string[] {
  return Array.from(text.matchAll(/(\d{1,2}):(\d{2})/g), (m) => `${m[1].padStart(2, '0')}:${m[2]}`)
}

function toState(schedule?: PreOrderSchedule): FormState {
  if (!schedule) {
    return {
      name: '',
      date: '',
      location: '',
      locationDetail: '',
      mapsUrl: '',
      pickupStart: '',
      pickupEnd: '',
      cutOffTime: '',
    }
  }
  const [pickupStart = '', pickupEnd = ''] = parseTimes(schedule.pickupTime)
  const [cutOffTime = ''] = parseTimes(schedule.cutOff)
  return {
    name: schedule.name,
    date: schedule.date,
    location: schedule.location,
    locationDetail: schedule.locationDetail,
    mapsUrl: schedule.mapsUrl ?? '',
    pickupStart,
    pickupEnd,
    cutOffTime,
  }
}

function validate(values: FormState): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Nama kloter wajib diisi.'
  if (!values.date) errors.date = 'Tanggal wajib dipilih.'
  if (!values.location.trim()) errors.location = 'Nama titik lokasi wajib diisi.'

  if (!values.mapsUrl.trim()) {
    errors.mapsUrl = 'Link Google Maps wajib diisi.'
  } else {
    const result = parseGoogleMapsUrl(values.mapsUrl)
    if (!result.ok) errors.mapsUrl = result.reason
  }

  if (!values.pickupStart) errors.pickupStart = 'Jam mulai wajib dipilih.'
  if (!values.pickupEnd) errors.pickupEnd = 'Jam selesai wajib dipilih.'
  if (values.pickupStart && values.pickupEnd && values.pickupEnd <= values.pickupStart) {
    errors.pickupEnd = 'Jam selesai harus setelah jam mulai.'
  }
  if (!values.cutOffTime) errors.cutOffTime = 'Batas pemesanan wajib dipilih.'
  return errors
}

// ---------- Bagian kecil pembentuk form ----------

function Section({
  step,
  title,
  badge,
  children,
}: {
  step: number
  title: string
  badge?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-line bg-sidebar p-4">
      <header className="mb-3 flex items-center justify-between border-b border-line pb-3">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wide text-espresso uppercase">
          <span className="flex size-5 items-center justify-center rounded-full bg-espresso text-[11px] text-white">
            {step}
          </span>
          {title}
        </h3>
        {badge}
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}

function FieldShell({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
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

function boxClass(error?: string) {
  return [
    'flex h-11 items-center gap-2 rounded-lg border bg-white px-3 text-sm focus-within:ring-2 focus-within:ring-espresso/20',
    error ? 'border-danger' : 'border-line',
  ].join(' ')
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  error?: string
  autoFocus?: boolean
}

function TextField({ label, value, onChange, placeholder, icon: Icon, error, autoFocus }: TextFieldProps) {
  const id = useId()
  return (
    <FieldShell label={label} htmlFor={id} error={error}>
      <div className={boxClass(error)}>
        {Icon && <Icon size={16} className="shrink-0 text-mocha" />}
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          className="w-full bg-transparent text-ink outline-none placeholder:text-mist"
        />
      </div>
    </FieldShell>
  )
}

// Tampilan "Jumat, 25 Oktober 2024"; input date asli ditaruh transparan di atasnya.
function DateField({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}) {
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
      <div className={`relative ${boxClass(error)}`}>
        <CalendarDays size={16} className="shrink-0 text-mocha" />
        <span className={value ? 'text-ink' : 'text-mist'}>
          {value ? describeDate(value).dateLong : 'Pilih tanggal'}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={openPicker}
          aria-invalid={Boolean(error)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </div>
    </FieldShell>
  )
}

// ---------- Pemilih jam dengan MUI TimeClock ----------

// Samakan dengan warna "espresso" di tema Tailwind kamu (MUI butuh nilai hex, bukan CSS variable).
const clockTheme = createTheme({
  palette: { primary: { main: '#4a3328' } },
  typography: { fontFamily: 'inherit' },
})

interface TimeClockFieldProps {
  label: string
  /** Format "HH:mm" (24 jam), atau string kosong jika belum dipilih. */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  error?: string
  /** Sisi tempat popup jam dibuka, agar tidak keluar dari modal. */
  align?: 'left' | 'right'
}

function TimeClockField({
  label,
  value,
  onChange,
  placeholder = 'Pilih jam',
  icon: Icon,
  error,
  align = 'left',
}: TimeClockFieldProps) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation() // jangan ikut menutup modal
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isOpen])

  const clockValue = value ? dayjs(`2000-01-01T${value}`) : null

  return (
    <FieldShell label={label} htmlFor={id} error={error}>
      <div ref={containerRef} className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-invalid={Boolean(error)}
          className={`${boxClass(error)} w-full cursor-pointer justify-between pr-2 text-left`}
        >
          <span className="flex min-w-0 items-center gap-2">
            {Icon && <Icon size={16} className="shrink-0 text-mocha" />}
            <span className={value ? 'text-ink' : 'text-mist'}>
              {value ? `${value} WIB` : placeholder}
            </span>
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-bark transition-transform duration-200 ${isOpen ? 'rotate-180 text-espresso' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            role="dialog"
            aria-label={`Pilih ${label}`}
            className={`absolute top-full z-40 mt-1.5 rounded-xl border border-line bg-white p-3 shadow-xl ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
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

// ---------- Popup tambah / edit ----------

interface ScheduleFormModalProps {
  mode: 'add' | 'edit'
  /** Wajib diisi saat mode 'edit'. */
  schedule?: PreOrderSchedule
  onSubmit: (values: ScheduleFormValues) => void
  onClose: () => void
}

export function ScheduleFormModal({ mode, schedule, onSubmit, onClose }: ScheduleFormModalProps) {
  const titleId = useId()
  const isEdit = mode === 'edit'
  const [values, setValues] = useState<FormState>(() => toState(schedule))
  const [errors, setErrors] = useState<Errors>({})

  function update(key: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // Validasi link langsung saat mengetik, supaya preview peta muncul/hilang real-time.
  const mapsResult = useMemo(
    () => (values.mapsUrl.trim() ? parseGoogleMapsUrl(values.mapsUrl) : null),
    [values.mapsUrl],
  )
  const mapsError = errors.mapsUrl ?? (mapsResult && !mapsResult.ok ? mapsResult.reason : undefined)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      name: values.name.trim(),
      date: values.date,
      location: values.location.trim(),
      locationDetail: values.locationDetail.trim(),
      mapsUrl: values.mapsUrl.trim(),
      pickupTime: `${values.pickupStart} - ${values.pickupEnd} WIB`,
      cutOff: `${values.cutOffTime} WIB`,
    })
  }

  const HeaderIcon = isEdit ? CalendarCog : CalendarPlus
  const statusBadge =
    isEdit && schedule ? (
      <span
        className={[
          'flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
          schedule.status === 'aktif' ? 'bg-[#e8ecd8] text-olive' : 'bg-[#e9e6df] text-bark',
        ].join(' ')}
      >
        <span
          className={`size-1.5 rounded-full ${schedule.status === 'aktif' ? 'bg-olive' : 'bg-mist'}`}
        />
        {schedule.status === 'aktif' ? 'Sesi Aktif' : 'Sesi Mendatang'}
      </span>
    ) : null

  return (
    <Modal onClose={onClose} labelledBy={titleId}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={clockTheme}>
          <form onSubmit={handleSubmit} noValidate>
            <header className="flex items-start gap-3 border-b border-line pb-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-espresso text-white">
                <HeaderIcon size={20} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="text-xl font-bold text-espresso">
                  {isEdit ? 'Edit Jadwal Pre-Order' : 'Tambah Jadwal Pre-Order'}
                </h2>
                <p className="text-sm">
                  {isEdit
                    ? 'Perbarui informasi sesi kloter seduh, titik temu pengambilan, dan jam cut-off pemesanan.'
                    : 'Atur jadwal kloter seduh dan titik temu pengambilan kopi tetangga.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-bark hover:text-espresso"
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </header>

            <div className="mt-5 flex flex-col gap-4">
              <Section step={1} title="Set Hari (Hari & Tanggal)" badge={statusBadge}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    label="Nama Kloter / Sesi"
                    value={values.name}
                    onChange={(v) => update('name', v)}
                    placeholder="Contoh: Kloter Pagi Kampus"
                    error={errors.name}
                    autoFocus
                  />
                  <DateField
                    label="Hari & Tanggal PO"
                    value={values.date}
                    onChange={(v) => update('date', v)}
                    error={errors.date}
                  />
                </div>
              </Section>

              <Section
                step={2}
                title={isEdit ? 'Set Lokasi (Titik Temu Pengambilan)' : 'Set Lokasi'}
              >
                <TextField
                  label="Nama Titik Lokasi Pengambilan"
                  value={values.location}
                  onChange={(v) => update('location', v)}
                  placeholder="Contoh: Gedung Sipil UB"
                  icon={MapPin}
                  error={errors.location}
                />
                <div className="flex flex-col gap-2">
                  <TextField
                    label="Link Google Maps (wajib)"
                    value={values.mapsUrl}
                    onChange={(v) => update('mapsUrl', v)}
                    placeholder="https://www.google.com/maps/place/..."
                    icon={Link2}
                    error={mapsError}
                  />
                  {!mapsResult && (
                    <p className="text-xs text-mist">
                      Buka Google Maps, pilih lokasi pengambilan, lalu salin URL dari address bar.
                      Peta ini akan tampil di sisi pelanggan.
                    </p>
                  )}
                  {mapsResult?.ok && (
                    <MapsEmbed
                      url={values.mapsUrl}
                      title={`Peta ${values.location || 'titik pengambilan'}`}
                      className="h-44"
                    />
                  )}
                </div>
                <TextField
                  label="Catatan / Detail Titik Temu"
                  value={values.locationDetail}
                  onChange={(v) => update('locationDetail', v)}
                  placeholder="Contoh: Drop Box Gazebo Tengah Lantai 1"
                />
              </Section>

              <Section step={3} title={isEdit ? 'Set Jam (Pickup & Cut-off)' : 'Set Jam'}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <TimeClockField
                    label="Pickup Mulai"
                    value={values.pickupStart}
                    onChange={(v) => update('pickupStart', v)}
                    placeholder="08:30 WIB"
                    icon={Clock}
                    error={errors.pickupStart}
                  />
                  <TimeClockField
                    label="Pickup Selesai"
                    value={values.pickupEnd}
                    onChange={(v) => update('pickupEnd', v)}
                    placeholder="11:30 WIB"
                    icon={Clock}
                    error={errors.pickupEnd}
                  />
                  <TimeClockField
                    label="Batas pesan (Cut-off)"
                    value={values.cutOffTime}
                    onChange={(v) => update('cutOffTime', v)}
                    placeholder="07:00 WIB"
                    icon={AlarmClockOff}
                    error={errors.cutOffTime}
                    align="right"
                  />
                </div>
              </Section>

              {isEdit && (
                <p className="flex items-start gap-2 rounded-xl bg-peach p-3 text-xs leading-relaxed text-bark">
                  <Info size={16} className="mt-0.5 shrink-0 text-mocha" />
                  Perubahan jadwal akan langsung diperbarui di portal pemesanan pelanggan. Pesanan
                  yang sudah masuk pada sesi ini akan otomatis mengikuti titik temu terbaru.
                </p>
              )}
            </div>

            <footer className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-lg bg-sand px-6 text-sm font-medium text-espresso hover:bg-line"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white hover:bg-espresso/90"
              >
                <CircleCheck size={16} />
                {isEdit ? 'Simpan Perubahan' : 'Simpan & Buka Jadwal'}
              </button>
            </footer>
          </form>
        </ThemeProvider>
      </LocalizationProvider>
    </Modal>
  )
}
