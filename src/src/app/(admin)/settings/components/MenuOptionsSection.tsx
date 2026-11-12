'use client'

import { CircleCheck, Plus, Trash2 } from 'lucide-react'
import { inputCls } from '@/constants/menu'
import { MAX_OPTIONS, useMenuOptions } from '@/hooks/settings/useMenuOptions'
import { Section } from '../../pre-order/components/form/Section'

const addBtn =
  'flex items-center gap-1.5 self-start rounded-lg border border-line bg-white px-3 py-2 text-[13px] font-medium text-espresso hover:bg-sand disabled:opacity-50'
const iconBtn = 'grid size-9 shrink-0 place-items-center rounded-lg text-bark hover:bg-sand hover:text-danger'

/** Ukuran gelas dan tingkat manis yang bisa dipilih pelanggan saat memesan minuman. */
export function MenuOptionsSection() {
  const o = useMenuOptions()

  if (o.loading) {
    return <p className="rounded-xl border border-line bg-white px-6 py-10 text-center text-sm text-mist">Memuat pilihan…</p>
  }
  if (o.loadError) {
    return (
      <div className="rounded-xl border border-line bg-white px-6 py-10 text-center text-sm">
        <p className="text-danger">{o.loadError}</p>
        <button onClick={o.reload} className="mt-3 font-semibold text-espresso underline underline-offset-2">
          Coba lagi
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Section step={4} title="Ukuran Gelas">
        <p className="text-xs text-mist">
          Hanya untuk kategori minuman. Pilih satu sebagai bawaan. Tambahan harga berlaku per gelas.
        </p>
        <div className="flex flex-col gap-2">
          {o.sizes.map((row) => (
            <div key={row.key} className="grid grid-cols-[1fr_auto] items-center gap-2 sm:grid-cols-[1.2fr_1fr_110px_auto_auto]">
              <input
                value={row.label}
                maxLength={32}
                onChange={(e) => o.updateSize(row.key, { label: e.target.value })}
                placeholder="Nama (Reguler)"
                aria-label="Nama ukuran"
                className={inputCls}
              />
              <input
                value={row.detail}
                maxLength={64}
                onChange={(e) => o.updateSize(row.key, { detail: e.target.value })}
                placeholder="Keterangan (16 oz)"
                aria-label="Keterangan ukuran"
                className={`${inputCls} hidden sm:block`}
              />
              <input
                value={row.extraPrice}
                inputMode="numeric"
                onChange={(e) => o.updateSize(row.key, { extraPrice: e.target.value.replace(/\D/g, '') })}
                placeholder="+ Rp"
                aria-label="Tambahan harga"
                className={`${inputCls} hidden sm:block`}
              />
              <label className="flex items-center gap-1.5 text-[12px] text-bark">
                <input
                  type="radio"
                  name="size-default"
                  checked={row.isDefault}
                  onChange={() => o.setDefaultSize(row.key)}
                />
                Bawaan
              </label>
              <button
                type="button"
                onClick={() => o.removeSize(row.key)}
                disabled={o.sizes.length <= 1}
                aria-label="Hapus ukuran"
                className={`${iconBtn} disabled:opacity-30`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={o.addSize} disabled={o.sizes.length >= MAX_OPTIONS} className={addBtn}>
          <Plus size={14} /> Tambah Ukuran
        </button>
      </Section>

      <Section step={5} title="Tingkat Manis">
        <div className="flex flex-col gap-2">
          {o.sugars.map((row) => (
            <div key={row.key} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
              <input
                value={row.label}
                maxLength={32}
                onChange={(e) => o.updateSugar(row.key, e.target.value)}
                placeholder="Nama (Less Sugar)"
                aria-label="Nama tingkat manis"
                className={inputCls}
              />
              <label className="flex items-center gap-1.5 text-[12px] text-bark">
                <input
                  type="radio"
                  name="sugar-default"
                  checked={row.isDefault}
                  onChange={() => o.setDefaultSugar(row.key)}
                />
                Bawaan
              </label>
              <button
                type="button"
                onClick={() => o.removeSugar(row.key)}
                disabled={o.sugars.length <= 1}
                aria-label="Hapus tingkat manis"
                className={`${iconBtn} disabled:opacity-30`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={o.addSugar} disabled={o.sugars.length >= MAX_OPTIONS} className={addBtn}>
          <Plus size={14} /> Tambah Tingkat Manis
        </button>
      </Section>

      {o.error && (
        <p role="alert" className="rounded-lg bg-danger-soft px-4 py-3 text-[13px] text-danger">
          {o.error}
        </p>
      )}
      {o.notice && (
        <p role="status" className="rounded-lg bg-peach px-4 py-3 text-[13px] text-espresso">
          {o.notice}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void o.save()}
          disabled={o.saving || !o.dirty}
          className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white hover:bg-espresso/90 disabled:opacity-50"
        >
          <CircleCheck size={16} />
          {o.saving ? 'Menyimpan…' : 'Simpan Ukuran & Manis'}
        </button>
      </div>
    </div>
  )
}
