import {
  AlarmClockOff,
  CalendarCog,
  CalendarDays,
  CalendarPlus,
  CircleCheck,
  Clock,
  Info,
  MapPin,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { describeDate } from '../../lib/format'
import type { PreOrderSchedule } from '../../types/admin'
import { Modal } from '../Modal'

export interface ScheduleFormValues {
  name: string
  date: string
  location: string
  locationDetail: string
  pickupTime: string
  cutOff: string
}

type Errors = Partial<Record<keyof ScheduleFormValues, string>>

function toValues(schedule?: PreOrderSchedule): ScheduleFormValues {
  if (!schedule) {
    return { name: '', date: '', location: '', locationDetail: '', pickupTime: '', cutOff: '' }
  }
  return {
    name: schedule.name,
    date: schedule.date,
    location: schedule.location,
    locationDetail: schedule.locationDetail,
    pickupTime: schedule.pickupTime,
    cutOff: schedule.cutOff,
  }
}

function validate(values: ScheduleFormValues): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Nama kloter wajib diisi.'
  if (!values.date) errors.date = 'Tanggal wajib dipilih.'
  if (!values.location.trim()) errors.location = 'Titik lokasi wajib diisi.'
  if (!values.pickupTime.trim()) errors.pickupTime = 'Jam pengambilan wajib diisi.'
  if (!values.cutOff.trim()) errors.cutOff = 'Batas pemesanan wajib diisi.'
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
  const [values, setValues] = useState<ScheduleFormValues>(() => toValues(schedule))
  const [errors, setErrors] = useState<Errors>({})

  function update(key: keyof ScheduleFormValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

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
      pickupTime: values.pickupTime.trim(),
      cutOff: values.cutOff.trim(),
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
              label="Titik Lokasi Pengambilan"
              value={values.location}
              onChange={(v) => update('location', v)}
              placeholder="Contoh: Gedung Sipil UB"
              icon={MapPin}
              error={errors.location}
            />
            <TextField
              label="Catatan / Detail Titik Temu"
              value={values.locationDetail}
              onChange={(v) => update('locationDetail', v)}
              placeholder="Contoh: Drop Box Gazebo Tengah Lantai 1"
            />
          </Section>

          <Section step={3} title={isEdit ? 'Set Jam (Pickup & Cut-off)' : 'Set Jam'}>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="Jam Pengambilan (Pickup Window)"
                value={values.pickupTime}
                onChange={(v) => update('pickupTime', v)}
                placeholder="08:30 - 11:30 WIB"
                icon={Clock}
                error={errors.pickupTime}
              />
              <TextField
                label="Batas Pemesanan (Cut-off Time)"
                value={values.cutOff}
                onChange={(v) => update('cutOff', v)}
                placeholder="07:00 WIB"
                icon={AlarmClockOff}
                error={errors.cutOff}
              />
            </div>
          </Section>

          {isEdit && (
            <p className="flex items-start gap-2 rounded-xl bg-peach p-3 text-xs leading-relaxed text-bark">
              <Info size={16} className="mt-0.5 shrink-0 text-mocha" />
              Perubahan jadwal akan langsung diperbarui di portal pemesanan pelanggan. Pesanan yang
              sudah masuk pada sesi ini akan otomatis mengikuti titik temu terbaru.
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
    </Modal>
  )
}