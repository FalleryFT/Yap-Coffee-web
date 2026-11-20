import { ChevronDown, ChevronUp } from 'lucide-react'
import { NumericInput } from '@/app/components/NumericInput'
import { inputCls, labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'
import { CategorySelect } from './CategorySelect'

const MAX_STOCK = 999_999

// Kategori + Stok + Harga dalam satu baris (mode Add, tata letak landscape)
export function AddCategoryStockPrice({ form }: { form: MenuForm }) {
  const { category, setCategory, categories, stock, setStock, price, setPrice, priceError, touchPrice } = form

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label className={labelCls}>
          Kategori <span className="text-danger">*</span>
        </label>
        <CategorySelect value={category} options={categories} onChange={setCategory} />
      </div>
      <div>
        <label className={labelCls}>
          Stok / Kuota Harian <span className="text-danger">*</span>
        </label>
        <div className="flex items-center gap-2">
          {/* Kosong = 0 (placeholder abu-abu, bukan teks sungguhan) agar mengetik 50 tidak jadi "050". */}
          <div className="relative min-w-0 flex-1">
            <NumericInput
              value={stock}
              onValueChange={(v) => setStock(Math.min(v, MAX_STOCK))}
              maxDigits={6}
              placeholder="0"
              aria-label="Stok harian"
              className={`${inputCls} pr-9`}
            />
            <div className="absolute inset-y-1 right-1 flex w-7 flex-col overflow-hidden rounded-md bg-white">
              <button
                type="button"
                aria-label="Tambah stok 1"
                onClick={() => setStock((s) => Math.min(MAX_STOCK, s + 1))}
                className="grid flex-1 place-items-center text-bark hover:bg-line"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                aria-label="Kurangi stok 1"
                disabled={stock <= 0}
                onClick={() => setStock((s) => Math.max(0, s - 1))}
                className="grid flex-1 place-items-center text-bark hover:bg-line disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <span className="shrink-0 text-[13px] text-bark">Cup / Porsi</span>
        </div>
      </div>
      <div>
        <label className={labelCls}>
          Harga Jual <span className="text-danger">*</span>
        </label>
        <div
          className={`flex items-center gap-2 rounded-lg border bg-sand px-4 py-3 ${priceError ? 'border-danger' : 'border-line'}`}
        >
          <span className="text-[13px] font-medium text-bark">Rp</span>
          <NumericInput
            value={price}
            onValueChange={(v) => {
              setPrice(v)
              touchPrice()
            }}
            onBlur={touchPrice}
            placeholder="0"
            aria-label="Harga jual"
            aria-invalid={priceError}
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-mist"
          />
        </div>
        {priceError && <p className="mt-1 text-[12px] text-danger">Harga wajib diisi</p>}
      </div>
    </div>
  )
}