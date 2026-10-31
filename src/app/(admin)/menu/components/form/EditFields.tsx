import { Coffee, Minus, Plus } from 'lucide-react'
import { labelCls } from '@/constants/menu'
import type { MenuForm } from '@/hooks/menu/useMenuForm'

// Harga + Stok (mode Edit stepper)
export function EditPriceStock({ form }: { form: MenuForm }) {
  const { price, setPrice, stock, setStock } = form

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className={labelCls}>Harga Jual Pokok</p>
        <div className="flex items-center gap-2 rounded-lg border border-line bg-sand px-4 py-3">
          <span className="text-[13px] font-medium text-bark">Rp</span>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full bg-transparent text-[14px] text-ink outline-none"
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <p className={labelCls}>Stok Harian (Batch Sesi)</p>
          <p className="text-[11px] text-bark">Reset tiap 06.00</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-line bg-sand px-3 py-2">
          <button
            onClick={() => setStock((s) => Math.max(0, s - 1))}
            className="grid size-8 place-items-center rounded-md bg-white text-ink hover:bg-line"
          >
            <Minus size={16} />
          </button>
          <span className="flex-1 text-center text-[20px] font-bold text-ink">{stock}</span>
          <button
            onClick={() => setStock((s) => s + 1)}
            className="grid size-8 place-items-center rounded-md bg-white text-ink hover:bg-line"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Toggle Tersedia
export function AvailabilityToggle({ form }: { form: MenuForm }) {
  const { available, setAvailable } = form

  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-sand px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-[#e8ecd8] text-olive">
          <Coffee size={16} />
        </span>
        <div>
          <p className="text-[14px] font-semibold text-espresso">Tersedia di Katalog Pre-Order</p>
          <p className="text-[12px] text-bark">Pelanggan tetangga dapat langsung memesan online</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={available}
        onClick={() => setAvailable((v) => !v)}
        className={`relative h-7 w-12 rounded-full transition-colors ${available ? 'bg-olive' : 'bg-mist'}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${available ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}
