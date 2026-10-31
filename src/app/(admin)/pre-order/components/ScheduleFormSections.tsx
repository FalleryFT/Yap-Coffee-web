import { AlarmClockOff, Clock, Link2, MapPin } from 'lucide-react'
import { MapsEmbed } from '@/app/components/MapsEmbed'
import type { PreOrderSchedule } from '@/types/admin'
import type { Errors, FormState } from '@/types/preOrder'
import { DateField } from './form/DateField'
import { Section } from './form/Section'
import { TextField } from './form/TextField'
import { TimeClockField } from './form/TimeClockField'
import { ScheduleStatusBadge } from './ScheduleStatusBadge'

interface MapsResult {
  ok: boolean
}

interface Props {
  isEdit: boolean
  schedule?: PreOrderSchedule
  values: FormState
  errors: Errors
  update: (key: keyof FormState, value: string) => void
  mapsResult: MapsResult | null
  mapsError?: string
}

export function ScheduleFormSections({ isEdit, schedule, values, errors, update, mapsResult, mapsError }: Props) {
  const statusBadge = isEdit && schedule ? <ScheduleStatusBadge status={schedule.status} /> : null

  // Saat edit: tanggal, link Google Maps, dan semua jam terkunci (tidak bisa diubah).
  const locked = isEdit

  return (
    <>
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
            disabled={locked}
          />
        </div>
      </Section>

      <Section step={2} title={isEdit ? 'Set Lokasi (Titik Temu Pengambilan)' : 'Set Lokasi'}>
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
            disabled={locked}
          />
          {!mapsResult && !locked && (
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
            disabled={locked}
          />
          <TimeClockField
            label="Pickup Selesai"
            value={values.pickupEnd}
            onChange={(v) => update('pickupEnd', v)}
            placeholder="11:30 WIB"
            icon={Clock}
            error={errors.pickupEnd}
            disabled={locked}
          />
          <TimeClockField
            label="Batas pesan (Cut-off)"
            value={values.cutOffTime}
            onChange={(v) => update('cutOffTime', v)}
            placeholder="07:00 WIB"
            icon={AlarmClockOff}
            error={errors.cutOffTime}
            align="right"
            disabled={locked}
          />
        </div>
      </Section>
    </>
  )
}