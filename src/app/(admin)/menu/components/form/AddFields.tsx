import { inputCls, labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'
import { CategorySelect } from './CategorySelect'

// Kategori + Stok (mode Add)
export function AddCategoryStock({ form }: { form: MenuForm }) {
  const { category, setCategory, stock, setStock } = form

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>
          Kategori <span className="text-danger">*</span>
        </label>
        <CategorySelect value={category} onChange={setCategory} />
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
  )
}

// Harga (mode Add)
export function AddPrice({ form }: { form: MenuForm }) {
  const { price, setPrice } = form

  return (
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
  )
}
