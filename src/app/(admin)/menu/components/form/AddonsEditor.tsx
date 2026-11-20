import { Plus, Trash2 } from 'lucide-react'
import { NumericInput } from '@/app/components/NumericInput'
import { labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'

const fieldCls =
  'rounded-lg border border-line bg-sand px-3 py-2 text-[13px] text-ink placeholder:text-mist outline-none focus:ring-2 focus:ring-mocha/30'

export function AddonsEditor({ form }: { form: MenuForm }) {
  const { addons, addAddon, updateAddon, removeAddon } = form

  return (
    <section>
      <p className={labelCls}>Pilihan Modifikasi &amp; Varian</p>
      <p className="text-[12px] text-bark">Tambahan opsional yang bisa dipilih tetangga</p>

      {addons.length > 0 && (
        <ul className="mt-3 space-y-2">
          {addons.map((addon) => (
            <li key={addon.key} className="flex items-center gap-2">
              <input
                value={addon.label}
                onChange={(e) => updateAddon(addon.key, { label: e.target.value })}
                maxLength={64}
                placeholder="Nama varian, contoh: Oat Milk"
                aria-label="Nama varian"
                className={`${fieldCls} min-w-0 flex-1`}
              />
              <label className={`${fieldCls} flex w-[140px] shrink-0 items-center gap-1.5`}>
                <span className="text-[12px] font-medium text-bark">Rp</span>
                <NumericInput
                  value={addon.extra_price}
                  onValueChange={(extra_price) => updateAddon(addon.key, { extra_price })}
                  placeholder="0"
                  aria-label="Harga tambahan varian (Rp)"
                  className="w-full min-w-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-mist"
                />
              </label>
              <button
                type="button"
                onClick={() => removeAddon(addon.key)}
                aria-label="Hapus varian"
                className="grid size-8 shrink-0 place-items-center rounded-lg text-mist hover:bg-danger-soft hover:text-danger"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={addAddon}
        className="mt-3 flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12px] font-medium text-espresso hover:bg-sand"
      >
        <Plus size={14} /> Tambah Varian
      </button>
    </section>
  )
}
