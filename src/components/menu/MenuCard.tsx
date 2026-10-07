import { Coffee, Cookie, Pencil, Trash2 } from 'lucide-react'
import { formatNumber } from '../../lib/format'
import { getStockStatus } from '../../lib/menu'
import type { MenuItem, StockStatus } from '../../types/admin'

const stockBadge: Record<StockStatus, string> = {
  tersedia: 'bg-[#e8ecd8] text-olive',
  menipis: 'bg-peach text-mocha',
  habis: 'bg-danger-soft text-danger',
}

function stockLabel(status: StockStatus, stock: number) {
  if (status === 'habis') return 'Habis Terjual'
  return `${status === 'menipis' ? 'Menipis' : 'Tersedia'} • Sisa ${stock}`
}

interface MenuCardProps {
  item: MenuItem
  onEdit?: (item: MenuItem) => void
  onDelete?: (item: MenuItem) => void
}

export function MenuCard({ item, onEdit, onDelete }: MenuCardProps) {
  const status = getStockStatus(item.stock)
  const soldOut = status === 'habis'
  const PlaceholderIcon = item.category === 'Makanan Ringan' ? Cookie : Coffee

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      {/* Foto + lencana */}
      <div className={`relative m-3 h-44 overflow-hidden rounded-xl ${soldOut ? 'opacity-60' : ''}`}>
        {item.image ? (
          <img src={item.image} alt={item.name} className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center bg-honey text-mocha">
            <PlaceholderIcon size={40} strokeWidth={1.5} />
          </span>
        )}
        <span
          className={`absolute top-2.5 left-2.5 rounded-full px-3 py-1 text-xs font-semibold ${stockBadge[status]}`}
        >
          {stockLabel(status, item.stock)}
        </span>
        <span className="absolute top-2.5 right-2.5 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-espresso">
          {item.category}
        </span>
      </div>

      {/* Isi */}
      <div className={`flex flex-1 flex-col px-4 pb-4 ${soldOut ? 'opacity-70' : ''}`}>
        <h3 className="text-lg font-bold text-espresso">{item.name}</h3>
        <p className="mt-1 line-clamp-3 text-sm">{item.description}</p>

        {item.addons.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {item.addons.map((addon) => (
              <li key={addon} className="rounded bg-sand px-2.5 py-1 text-xs text-bark">
                {addon}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Harga + aksi */}
      <footer className="mt-auto flex items-end justify-between border-t border-line bg-sidebar px-4 py-3">
        <div className="leading-tight">
          <p className="text-xs">Harga Jual</p>
          <p className="mt-0.5 text-xl font-bold text-mocha">Rp {formatNumber(item.price)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(item)}
            className="flex size-9 items-center justify-center rounded-lg bg-sand text-bark hover:bg-line"
            aria-label={`Edit ${item.name}`}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete?.(item)}
            className="flex size-9 items-center justify-center rounded-lg bg-sand text-bark hover:bg-danger-soft hover:text-danger"
            aria-label={`Hapus ${item.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </footer>
    </article>
  )
}