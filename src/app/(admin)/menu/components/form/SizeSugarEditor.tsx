import { Plus, Trash2 } from 'lucide-react'
import { NumericInput } from '@/app/components/NumericInput'
import { labelCls } from '@/constants/menu'
import { MAX_OPTIONS, type MenuForm } from '@/hooks/menu/useMenuForm'

const fieldCls =
  'rounded-lg border border-line bg-sand px-3 py-2 text-[13px] text-ink placeholder:text-mist outline-none focus:ring-2 focus:ring-mocha/30'
const headCls = 'text-[12px] font-medium text-bark'
const addBtn =
  'mt-3 flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12px] font-medium text-espresso hover:bg-sand disabled:opacity-50'
const iconBtn =
  'grid size-8 shrink-0 place-items-center rounded-lg text-mist hover:bg-danger-soft hover:text-danger'

/**
 * Ukuran Gelas dan Tingkat Manis per menu. Hanya tampil untuk menu Minuman dan boleh dikosongkan
 * (sama seperti Pilihan Modifikasi & Varian). Satu pilihan ditandai "Bawaan".
 */
export function SizeSugarEditor({ form }: { form: MenuForm }) {
  const {
    sizes, addSize, updateSize, setDefaultSize, removeSize,
    sugars, addSugar, updateSugar, setDefaultSugar, removeSugar,
    titleId,
  } = form

  return (
    <div className="space-y-5">
      {/* ── Ukuran Gelas ── */}
      <section>
        <p className={labelCls}>Ukuran Gelas</p>
        <p className="text-[12px] text-bark">
          Opsional. Pilih satu sebagai bawaan; harga adalah tambahan per gelas.
        </p>

        {sizes.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <div className="min-w-[520px] space-y-2">
              <div className="grid grid-cols-[minmax(0,1fr)_96px_132px_76px_32px] items-center gap-2">
                <span className={headCls}>Nama Ukuran</span>
                <span className={headCls}>Ukuran (oz)</span>
                <span className={headCls}>Harga</span>
                <span />
                <span />
              </div>
              {sizes.map((row) => (
                <div
                  key={row.key}
                  className="grid grid-cols-[minmax(0,1fr)_96px_132px_76px_32px] items-center gap-2"
                >
                  <input
                    value={row.label}
                    maxLength={32}
                    onChange={(e) => updateSize(row.key, { label: e.target.value })}
                    placeholder="Contoh: Reguler"
                    aria-label="Nama ukuran"
                    className={`${fieldCls} min-w-0`}
                  />
                  <label className={`${fieldCls} flex items-center gap-1.5`}>
                    <NumericInput
                      value={row.oz}
                      onValueChange={(oz) => updateSize(row.key, { oz })}
                      maxDigits={3}
                      placeholder="16"
                      aria-label="Ukuran dalam oz"
                      className="w-full min-w-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-mist"
                    />
                    <span className="text-[12px] font-medium text-bark">oz</span>
                  </label>
                  <label className={`${fieldCls} flex items-center gap-1.5`}>
                    <span className="text-[12px] font-medium text-bark">Rp</span>
                    <NumericInput
                      value={row.extraPrice}
                      onValueChange={(extraPrice) => updateSize(row.key, { extraPrice })}
                      placeholder="0"
                      aria-label="Harga tambahan ukuran (Rp)"
                      className="w-full min-w-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-mist"
                    />
                  </label>
                  <label className="flex items-center gap-1.5 text-[12px] text-bark">
                    <input
                      type="radio"
                      name={`${titleId}-size-default`}
                      checked={row.isDefault}
                      onChange={() => setDefaultSize(row.key)}
                    />
                    Bawaan
                  </label>
                  <button
                    type="button"
                    onClick={() => removeSize(row.key)}
                    aria-label="Hapus ukuran"
                    className={iconBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="button" onClick={addSize} disabled={sizes.length >= MAX_OPTIONS} className={addBtn}>
          <Plus size={14} /> Tambah Ukuran
        </button>
      </section>

      {/* ── Tingkat Manis ── */}
      <section>
        <p className={labelCls}>Tingkat Manis</p>
        <p className="text-[12px] text-bark">Opsional. Pilih satu sebagai bawaan.</p>

        {sugars.length > 0 && (
          <div className="mt-3 space-y-2">
            <span className={`${headCls} block`}>Tingkat Manis</span>
            {sugars.map((row) => (
              <div key={row.key} className="grid grid-cols-[minmax(0,1fr)_76px_32px] items-center gap-2">
                <input
                  value={row.label}
                  maxLength={32}
                  onChange={(e) => updateSugar(row.key, e.target.value)}
                  placeholder="Contoh: Less Sugar"
                  aria-label="Nama tingkat manis"
                  className={`${fieldCls} min-w-0`}
                />
                <label className="flex items-center gap-1.5 text-[12px] text-bark">
                  <input
                    type="radio"
                    name={`${titleId}-sugar-default`}
                    checked={row.isDefault}
                    onChange={() => setDefaultSugar(row.key)}
                  />
                  Bawaan
                </label>
                <button
                  type="button"
                  onClick={() => removeSugar(row.key)}
                  aria-label="Hapus tingkat manis"
                  className={iconBtn}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="button" onClick={addSugar} disabled={sugars.length >= MAX_OPTIONS} className={addBtn}>
          <Plus size={14} /> Tambah Tingkat Manis
        </button>
      </section>
    </div>
  )
} 