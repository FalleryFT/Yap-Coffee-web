import { Camera } from 'lucide-react'
import { labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'

export function PhotoAdd({ form }: { form: MenuForm }) {
  const { fileRef, imgPreview, handleFile } = form

  return (
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
  )
}
