import { Plus, X } from 'lucide-react'
import { inputCls, labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'

export function AddonsEditor({ form }: { form: MenuForm }) {
  const { addons, newAddon, setNewAddon, addAddonTag, removeAddon } = form

  return (
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
  )
}
