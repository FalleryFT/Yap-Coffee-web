'use client'

import { CircleCheck } from 'lucide-react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useId } from 'react'
import type { PreOrderSchedule } from '@/types/admin'
import { Modal } from '@/app/components/Modal'
import { useScheduleForm } from '@/hooks/pre-order/useScheduleForm'
import type { ScheduleFormValues } from '@/types/preOrder'
import { ScheduleFormHeader } from './ScheduleFormHeader'
import { ScheduleFormSections } from './ScheduleFormSections'

// Samakan dengan warna "espresso" di tema Tailwind kamu (MUI butuh nilai hex, bukan CSS variable).
const clockTheme = createTheme({
  palette: { primary: { main: '#4a3328' } },
  typography: { fontFamily: 'inherit' },
})

interface ScheduleFormModalProps {
  mode: 'add' | 'edit'
  /** Wajib diisi saat mode 'edit'. */
  schedule?: PreOrderSchedule
  onSubmit: (values: ScheduleFormValues) => Promise<void>
  onClose: () => void
}

export function ScheduleFormModal({ mode, schedule, onSubmit, onClose }: ScheduleFormModalProps) {
  const titleId = useId()
  const isEdit = mode === 'edit'
  const form = useScheduleForm(schedule, onSubmit)

  return (
    <Modal onClose={onClose} labelledBy={titleId}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={clockTheme}>
          <form onSubmit={form.handleSubmit} noValidate>
            <ScheduleFormHeader titleId={titleId} isEdit={isEdit} onClose={onClose} />

            <div className="mt-5 flex flex-col gap-4">
              <ScheduleFormSections
                isEdit={isEdit}
                schedule={schedule}
                values={form.values}
                errors={form.errors}
                update={form.update}
                mapsResult={form.mapsResult}
                mapsError={form.mapsError}
              />
            </div>

            {form.submitError && (
              <p role="alert" className="mt-4 rounded-lg bg-danger-soft px-4 py-3 text-[13px] text-danger">
                {form.submitError}
              </p>
            )}

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
                disabled={form.saving}
                className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white hover:bg-espresso/90 disabled:opacity-50"
              >
                <CircleCheck size={16} />
                {form.saving ? 'Menyimpan…' : isEdit ? 'Simpan Perubahan' : 'Simpan & Buka Jadwal'}
              </button>
            </footer>
          </form>
        </ThemeProvider>
      </LocalizationProvider>
    </Modal>
  )
}
