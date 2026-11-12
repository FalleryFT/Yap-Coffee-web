'use client'

import { CircleCheck, KeyRound, User } from 'lucide-react'
import type { FormEvent } from 'react'
import { useAdminAccount } from '@/hooks/settings/useAdminAccount'
import { Section } from '../../pre-order/components/form/Section'
import { TextField } from '../../pre-order/components/form/TextField'

/** Mengganti nama tampilan dan kata sandi admin yang sedang masuk. */
export function AdminAccountSection() {
  const a = useAdminAccount()

  function submitName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void a.saveName()
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void a.savePassword()
  }

  if (a.loading) {
    return <p className="rounded-xl border border-line bg-white px-6 py-10 text-center text-sm text-mist">Memuat akun…</p>
  }
  if (a.loadError) {
    return (
      <div className="rounded-xl border border-line bg-white px-6 py-10 text-center text-sm">
        <p className="text-danger">{a.loadError}</p>
        <button onClick={a.reload} className="mt-3 font-semibold text-espresso underline underline-offset-2">
          Coba lagi
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submitName} noValidate className="flex flex-col gap-4">
        <Section step={2} title="Nama Admin">
          <TextField
            label="Nama"
            value={a.name}
            onChange={a.setName}
            placeholder="Nama yang tampil di sidebar"
            icon={User}
            error={a.nameError ?? undefined}
          />
          <p className="text-xs text-mist">
            Username untuk masuk: <span className="font-semibold text-espresso">{a.admin?.username}</span> (tidak diubah di sini).
          </p>
          {a.nameNotice && (
            <p role="status" className="rounded-lg bg-peach px-4 py-3 text-[13px] text-espresso">
              {a.nameNotice}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={a.nameSaving || !a.nameDirty}
              className="flex h-10 items-center gap-2 rounded-lg bg-espresso px-4 text-sm font-semibold text-white hover:bg-espresso/90 disabled:opacity-50"
            >
              <CircleCheck size={16} />
              {a.nameSaving ? 'Menyimpan…' : 'Simpan Nama'}
            </button>
          </div>
        </Section>
      </form>

      <form onSubmit={submitPassword} noValidate className="flex flex-col gap-4">
        <Section step={3} title="Ganti Kata Sandi">
          <TextField
            label="Kata Sandi Saat Ini"
            type="password"
            autoComplete="current-password"
            value={a.currentPassword}
            onChange={a.setCurrentPassword}
            icon={KeyRound}
            error={a.passwordErrors.current_password}
          />
          <TextField
            label="Kata Sandi Baru"
            type="password"
            autoComplete="new-password"
            value={a.newPassword}
            onChange={a.setNewPassword}
            placeholder="Minimal 8 karakter"
            icon={KeyRound}
            error={a.passwordErrors.password}
          />
          <TextField
            label="Ulangi Kata Sandi Baru"
            type="password"
            autoComplete="new-password"
            value={a.confirmPassword}
            onChange={a.setConfirmPassword}
            icon={KeyRound}
            error={a.passwordErrors.password_confirmation}
          />
          {a.passwordError && (
            <p role="alert" className="rounded-lg bg-danger-soft px-4 py-3 text-[13px] text-danger">
              {a.passwordError}
            </p>
          )}
          {a.passwordNotice && (
            <p role="status" className="rounded-lg bg-peach px-4 py-3 text-[13px] text-espresso">
              {a.passwordNotice}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={a.passwordSaving || !a.currentPassword || !a.newPassword}
              className="flex h-10 items-center gap-2 rounded-lg bg-espresso px-4 text-sm font-semibold text-white hover:bg-espresso/90 disabled:opacity-50"
            >
              <CircleCheck size={16} />
              {a.passwordSaving ? 'Menyimpan…' : 'Ubah Kata Sandi'}
            </button>
          </div>
        </Section>
      </form>
    </div>
  )
}
