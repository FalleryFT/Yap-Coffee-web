import {
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Coffee,
  Minus,
  Plus,
  X,
} from 'lucide-react'
import { useCallback, useId, useRef, useState } from 'react'
import { Modal } from '../Modal'
import type { MenuCategory, MenuItem } from '../../types/admin'

const categories: MenuCategory[] = ['Kopi Susu', 'Manual Brew', 'Non-Coffee', 'Makanan Ringan']

// ─── shared field helpers ─────────────────────────────────────────────────────
const labelCls = 'mb-1.5 block text-[13px] font-medium text-espresso'
const inputCls =
  'w-full rounded-lg border border-line bg-sand px-4 py-3 text-[14px] text-ink placeholder:text-mist outline-none focus:ring-2 focus:ring-mocha/30'

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = 'add' | 'edit'

interface MenuFormModalProps {
  mode: Mode
  /** item yang sedang di-edit (harus ada saat mode='edit') */
  item?: MenuItem
  onClose: () => void
  onSave: (data: Partial<MenuItem>) => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MenuFormModal({ mode, item, onClose, onSave }: MenuFormModalProps) {
  const titleId = useId()
  const stableClose = useCallback(() => onClose(), [onClose])

  // --- form state ---
  const [name, setName] = useState(item?.name ?? '')
  const [desc, setDesc] = useState(item?.description ?? '')
  const [category, setCategory] = useState<MenuCategory>(item?.category ?? 'Kopi Susu')
  const [price, setPrice] = useState(item?.price ?? 0)
  const [stock, setStock] = useState(item?.stock ?? 25)
  const [available, setAvailable] = useState(true)
  const [addons, setAddons] = useState<string[]>(item?.addons ?? [])
  const [newAddon, setNewAddon] = useState('')
  const [imgPreview, setImgPreview] = useState<string | undefined>(item?.image)
  const fileRef = useRef<HTMLInputElement>(null)

  const isEdit = mode === 'edit'
  const descMax = 200
  const skuLabel = item ? `SKU-${String(item.id).padStart(4, '0')}` : ''

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setImgPreview(URL.createObjectURL(file))
  }

  function addAddonTag() {
    const t = newAddon.trim()
    if (t && !addons.includes(t)) setAddons((prev) => [...prev, t])
    setNewAddon('')
  }

  function removeAddon(tag: string) {
    setAddons((prev) => prev.filter((a) => a !== tag))
  }

  function handleSave() {
    onSave({ name, description: desc, category, price, stock, addons, image: imgPreview })
    onClose()
  }

  return (
    <Modal
      labelledBy={titleId}
      onClose={stableClose}
      widthClass={isEdit ? 'max-w-[560px]' : 'max-w-[480px]'}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between pb-5">
        <div className="flex items-start gap-3">
          {isEdit && (
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand text-espresso">
              <Coffee size={20} />
            </span>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-mocha">
              {isEdit ? 'Edit Menu Racikan' : 'Formulir Produk'}
            </p>
            <h2 id={titleId} className="mt-0.5 text-[22px] font-bold text-espresso">
              {isEdit ? (
                <span className="flex items-center gap-2">
                  Edit Menu Racikan
                  <span className="rounded bg-peach px-2 py-0.5 text-[12px] font-semibold text-mocha">
                    {skuLabel}
                  </span>
                </span>
              ) : (
                'Tambah Menu Baru'
              )}
            </h2>
            {isEdit && (
              <p className="mt-1 text-[12px] text-bark">
                Perbarui informasi resep, harga jual, foto produk, dan stok harian katalog.
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="grid size-8 place-items-center rounded-lg text-mist hover:bg-sand hover:text-espresso"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5">
        {/* ── Foto ── */}
        {isEdit ? (
          <section>
            <div className="flex items-center justify-between">
              <p className={labelCls}>Foto Menu &amp; Kategori</p>
              <p className="text-[11px] text-bark">Rekomendasi rasio 1:1 format JPG/PNG</p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 border-line bg-sand"
                onClick={() => fileRef.current?.click()}
              >
                {imgPreview ? (
                  <img src={imgPreview} alt="preview" className="size-full object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center text-mist">
                    <Coffee size={28} strokeWidth={1.5} />
                  </span>
                )}
                <span className="absolute bottom-0 left-0 right-0 bg-espresso/70 py-0.5 text-center text-[10px] font-medium text-white">
                  Utama
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-[12px] text-bark">Foto Menu Saat Ini</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg bg-sand px-3 py-2 text-[12px] font-medium text-ink hover:bg-line"
                  >
                    ↑ Ganti
                  </button>
                  <button
                    onClick={() => setImgPreview(undefined)}
                    className="flex items-center gap-1.5 rounded-lg bg-peach px-3 py-2 text-[12px] font-medium text-danger hover:bg-danger-soft"
                  >
                    🗑 Hapus
                  </button>
                </div>
              </div>
              {/* Kategori di samping foto saat edit */}
              <div className="flex-1">
                <p className={labelCls}>Kategori Menu Kedai</p>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MenuCategory)}
                    className={`${inputCls} appearance-none pr-8`}
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-bark" />
                </div>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </section>
        ) : (
          <section>
            <p className={labelCls}>Foto Menu</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-sand py-8 text-bark hover:border-mocha/50 hover:bg-line"
            >
              {imgPreview ? (
                <img src={imgPreview} alt="preview" className="h-20 rounded-lg object-cover" />
              ) : (
                <>
                  <Camera size={28} strokeWidth={1.5} />
                  <p className="text-[14px] font-medium">Unggah Foto Produk</p>
                  <p className="text-[12px]">Format JPG, PNG minimal 800x600px</p>
                </>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </section>
        )}

        {/* ── Nama menu ── */}
        <div>
          <label className={labelCls}>
            Nama Menu <span className="text-danger">*</span>
            {isEdit && <span className="float-right text-[12px] font-normal text-bark">Wajib diisi</span>}
          </label>
          <div className="relative">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Es Kopi Susu Tetangga Gula Aren"
              className={`${inputCls} ${isEdit && name ? 'pr-10' : ''}`}
            />
            {isEdit && name && (
              <CheckCircle2 size={18} className="absolute right-3 top-3.5 text-olive" />
            )}
          </div>
        </div>

        {/* ── Deskripsi ── */}
        <div>
          <label className={labelCls}>
            {isEdit ? 'Deskripsi Rasa & Komposisi' : 'Deskripsi Racikan & Tasting Notes'}
            {isEdit && (
              <span className="float-right text-[12px] font-normal text-bark">
                {desc.length} / {descMax} karakter
              </span>
            )}
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value.slice(0, isEdit ? descMax : 9999))}
            rows={3}
            placeholder="Jelaskan bahan utama, asal biji kopi, notes rasa (misal: manis legit, hint cokelat karamel)..."
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* ── Kategori + Stok (mode Add) ── */}
        {!isEdit && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                Kategori <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MenuCategory)}
                  className={`${inputCls} appearance-none pr-8`}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-bark" />
              </div>
            </div>
            <div>
              <label className={labelCls}>
                Stok / Kuota Harian <span className="text-danger">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className={inputCls}
                />
                <span className="shrink-0 text-[13px] text-bark">Cup / Porsi</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Harga + Stok (mode Edit stepper) ── */}
        {isEdit ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={labelCls}>Harga Jual Pokok</p>
              <div className="flex items-center gap-2 rounded-lg border border-line bg-sand px-4 py-3">
                <span className="text-[13px] font-medium text-bark">Rp</span>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-transparent text-[14px] text-ink outline-none"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className={labelCls}>Stok Harian (Batch Sesi)</p>
                <p className="text-[11px] text-bark">Reset tiap 06.00</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-line bg-sand px-3 py-2">
                <button
                  onClick={() => setStock((s) => Math.max(0, s - 1))}
                  className="grid size-8 place-items-center rounded-md bg-white text-ink hover:bg-line"
                >
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center text-[20px] font-bold text-ink">{stock}</span>
                <button
                  onClick={() => setStock((s) => s + 1)}
                  className="grid size-8 place-items-center rounded-md bg-white text-ink hover:bg-line"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Harga (mode Add) */
          <div>
            <label className={labelCls}>
              Harga Jual POS (Rp) <span className="text-danger">*</span>
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-sand px-4 py-3">
              <span className="text-[13px] font-medium text-bark">Rp</span>
              <input
                type="number"
                min={0}
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="20.000"
                className="w-full bg-transparent text-[14px] text-ink outline-none"
              />
            </div>
          </div>
        )}

        {/* ── Toggle Tersedia (edit only) ── */}
        {isEdit && (
          <div className="flex items-center justify-between rounded-xl border border-line bg-sand px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-[#e8ecd8] text-olive">
                <Coffee size={16} />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-espresso">Tersedia di Katalog Pre-Order</p>
                <p className="text-[12px] text-bark">Pelanggan tetangga dapat langsung memesan online</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={available}
              onClick={() => setAvailable((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition-colors ${available ? 'bg-olive' : 'bg-mist'}`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${available ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        )}

        {/* ── Modifikasi / Varian (edit only) ── */}
        {isEdit && (
          <section>
            <div className="flex items-center justify-between">
              <div>
                <p className={labelCls}>Pilihan Modifikasi &amp; Varian</p>
                <p className="text-[12px] text-bark">Tambahan opsional yang bisa dipilih tetangga</p>
              </div>
              <button
                onClick={() => setNewAddon('+ Tambah Varian')}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12px] font-medium text-espresso hover:bg-sand"
              >
                ⊕ Tambah Varian
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {addons.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-sand px-3 py-1.5 text-[13px] text-ink"
                >
                  {tag}
                  <button onClick={() => removeAddon(tag)} className="text-mist hover:text-danger">
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
            {/* Quick-add field */}
            <div className="mt-2 flex gap-2">
              <input
                value={newAddon}
                onChange={(e) => setNewAddon(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAddonTag()}
                placeholder="Contoh: Oat Milk +5k"
                className={`${inputCls} flex-1 py-2 text-[13px]`}
              />
              <button
                onClick={addAddonTag}
                className="rounded-lg bg-espresso px-3 py-2 text-white hover:bg-espresso/90"
              >
                <Plus size={16} />
              </button>
            </div>
          </section>
        )}

        {/* ── Warning banner (edit only) ── */}
        {isEdit && (
          <div className="rounded-xl border border-peach bg-peach/60 px-4 py-3 text-[13px] text-mocha">
            ℹ Perubahan menu akan langsung diperbarui di portal pemesanan pelanggan untuk sesi pre-order
            berikutnya secara otomatis.
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
        {isEdit ? (
          <p className="text-[12px] text-olive">● Mode Admin Aktif</p>
        ) : (
          <div />
        )}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-sand px-5 py-2.5 text-[14px] font-medium text-ink hover:bg-line"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!name}
            className="flex items-center gap-2 rounded-lg bg-espresso px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-espresso/90 disabled:opacity-50"
          >
            <Check size={16} />
            {isEdit ? 'Simpan Perubahan' : 'Simpan Racikan'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
