'use client'

import { AtSign, CircleCheck, ExternalLink, MessageCircle, Store } from 'lucide-react'
import type { FormEvent } from 'react'
import { useStoreSettings } from '@/hooks/settings/useStoreSettings'
import { Section } from '../../pre-order/components/form/Section'
import { TextField } from '../../pre-order/components/form/TextField'

/** Nama outlet serta kontak WhatsApp dan Instagram yang tampil di aplikasi pelanggan. */
export function StoreSection() {
  const s = useStoreSettings()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void s.save()
  }

  if (s.loading) {
    return <p className="rounded-xl border border-line bg-white px-6 py-10 text-center text-sm text-mist">Memuat pengaturan…</p>
  }
  if (s.loadError) {
    return (
      <div className="rounded-xl border border-line bg-white px-6 py-10 text-center text-sm">
        <p className="text-danger">{s.loadError}</p>
        <button onClick={s.reload} className="mt-3 font-semibold text-espresso underline underline-offset-2">
          Coba lagi
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Section step={1} title="Outlet & Kontak Penjual">
        <TextField
          label="Nama Outlet"
          value={s.outletName}
          onChange={s.setOutletName}
          placeholder="Contoh: Yap Coffee Kaftek"
          icon={Store}
          error={s.errors.outletName}
        />
        <TextField
          label="Nomor WhatsApp"
          value={s.whatsapp}
          onChange={s.setWhatsapp}
          placeholder="081234567890"
          icon={MessageCircle}
          error={s.errors.whatsapp}
        />
        <TextField
          label="Instagram"
          value={s.instagram}
          onChange={s.setInstagram}
          placeholder="https://www.instagram.com/nama_akun/"
          icon={AtSign}
          error={s.errors.instagram}
        />
        <p className="text-xs text-mist">
          Nomor boleh diawali 08… atau +62…. Untuk Instagram tempel tautan profil atau cukup tulis @nama_akun.
        </p>

        {s.saved && (
          <div className="flex flex-col gap-2 rounded-lg bg-cream/60 p-3">
            <PreviewRow label="Tombol Hubungi Penjual" href={s.saved.preview.whatsappUrl} text={s.saved.preview.whatsapp} />
            <PreviewRow label="Kartu Instagram" href={s.saved.preview.instagram} text={s.saved.preview.instagramHandle} />
          </div>
        )}
      </Section>

      {s.submitError && (
        <p role="alert" className="rounded-lg bg-danger-soft px-4 py-3 text-[13px] text-danger">
          {s.submitError}
        </p>
      )}
      {s.notice && (
        <p role="status" className="rounded-lg bg-peach px-4 py-3 text-[13px] text-espresso">
          {s.notice}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={s.saving || !s.dirty}
          className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white hover:bg-espresso/90 disabled:opacity-50"
        >
          <CircleCheck size={16} />
          {s.saving ? 'Menyimpan…' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  )
}

function PreviewRow({ label, href, text }: { label: string; href: string; text: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <span className="text-bark">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-semibold text-espresso hover:underline"
        >
          {text}
          <ExternalLink size={14} />
        </a>
      ) : (
        <span className="text-danger">Belum valid</span>
      )}
    </div>
  )
}
