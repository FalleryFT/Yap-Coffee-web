import { Coffee } from 'lucide-react'
import { labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'
import { CategorySelect } from './CategorySelect'

export function PhotoEdit({ form }: { form: MenuForm }) {
  const { fileRef, imgPreview, setImgPreview, handleFile, category, setCategory } = form

  return (
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
          <CategorySelect value={category} onChange={setCategory} />
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </section>
  )
}
