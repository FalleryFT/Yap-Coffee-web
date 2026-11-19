import { Camera, Trash2 } from 'lucide-react'
import { labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'

export function PhotoAdd({ form }: { form: MenuForm }) {
  const { fileRef, imgPreview, setImgPreview, handleFile } = form

  function removePhoto() {
    setImgPreview(undefined)
    // Reset input agar file yang sama bisa dipilih lagi setelah dihapus.
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    // Tinggi kolom foto mengikuti kolom nama + deskripsi (sejajar di bagian bawah).
    <section className="flex w-full shrink-0 flex-col sm:w-48">
      <p className={labelCls}>Foto Menu</p>
      <div className="relative min-h-44 flex-1">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex size-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-line bg-sand p-3 text-center text-bark hover:border-mocha/50 hover:bg-line"
        >
          {imgPreview ? (
            <img src={imgPreview} alt="preview" className="size-full rounded-lg object-cover" />
          ) : (
            <>
              <Camera size={28} strokeWidth={1.5} />
              <p className="text-[14px] font-medium">Unggah Foto Produk</p>
              <p className="text-[12px]">Rekomendasi rasio 1:1 format JPG/PNG</p>
            </>
          )}
        </button>
        {imgPreview && (
          <button
            type="button"
            onClick={removePhoto}
            aria-label="Hapus foto"
            title="Hapus foto"
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-peach text-danger shadow hover:bg-danger-soft"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </section>
  )
}