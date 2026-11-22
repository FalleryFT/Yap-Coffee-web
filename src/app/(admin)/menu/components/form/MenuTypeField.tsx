import { Lock } from 'lucide-react'
import { labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'
import type { MenuType } from '@/types/admin'

const OPTIONS: { value: MenuType; title: string; hint: string }[] = [
  { value: 'minuman', title: 'Minuman', hint: 'Pelanggan memilih ukuran dan tingkat manis' },
  { value: 'makanan', title: 'Makanan', hint: 'Tanpa pilihan ukuran dan manis' },
]

/**
 * Jenis menu: pilihan kartu seperti di popup Tambah Kategori. Menentukan kategori yang tampil dan
 * apakah ukuran gelas + tingkat manis muncul. Terkunci saat mengedit.
 */
export function MenuTypeField({ form }: { form: MenuForm }) {
  const { menuType, selectMenuType, isEdit, titleId } = form

  return (
    <fieldset>
      <legend className={`${labelCls} flex items-center gap-2`}>
        Jenis Menu <span className="text-danger">*</span>
        {isEdit && (
          <span className="flex items-center gap-1 text-[12px] font-normal text-bark">
            <Lock size={12} /> Terkunci, tidak bisa diubah
          </span>
        )}
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const checked = menuType === option.value
          return (
            <label
              key={option.value}
              className={`flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 ${
                checked ? 'border-espresso bg-peach/40' : 'border-line bg-white'
              } ${
                isEdit
                  ? `cursor-not-allowed ${checked ? '' : 'opacity-50'}`
                  : `cursor-pointer ${checked ? '' : 'hover:bg-sand'}`
              }`}
            >
              <span className="flex items-center gap-2 text-[14px] font-semibold text-espresso">
                <input
                  type="radio"
                  name={`${titleId}-menu-type`}
                  checked={checked}
                  disabled={isEdit}
                  onChange={() => selectMenuType(option.value)}
                />
                {option.title}
              </span>
              <span className="text-[12px] text-bark">{option.hint}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}