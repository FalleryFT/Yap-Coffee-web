import { CheckCircle2 } from 'lucide-react'
import { descMax, inputCls, labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'

export function NameField({ form }: { form: MenuForm }) {
  const { isEdit, name, setName } = form

  return (
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
        {isEdit && name && <CheckCircle2 size={18} className="absolute right-3 top-3.5 text-olive" />}
      </div>
    </div>
  )
}

export function DescField({ form }: { form: MenuForm }) {
  const { isEdit, desc, setDesc } = form

  return (
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
  )
}
