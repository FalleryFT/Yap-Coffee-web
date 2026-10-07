import { Coffee, Star } from 'lucide-react'
import { topMenuContribution, topMenuItems } from '../../data/dummy'

export function TopMenuCard() {
  return (
    <section className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card">
      <header className="flex items-start justify-between">
        <h2 className="text-lg font-bold text-espresso">Menu Terlaris</h2>
        <Star size={18} className="text-mocha" />
      </header>
      <p className="mt-2 text-xs">Produk paling sering dipesan tetangga pekan ini.</p>

      <ul className="mt-4 flex flex-1 flex-col gap-3">
        {topMenuItems.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-lg bg-sand p-2">
            {item.image ? (
              <img src={item.image} alt={item.name} className="size-12 rounded-lg object-cover" />
            ) : (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-honey text-mocha">
                <Coffee size={20} strokeWidth={1.75} />
              </span>
            )}
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-bold text-espresso">{item.name}</p>
              <p className="truncate text-xs">{item.description}</p>
            </div>
            <div className="text-right leading-tight">
              <p className="text-xl font-bold text-espresso">{item.sold}</p>
              <p className="text-[11px]">
                {item.share} {item.unit}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-4 flex items-center justify-between text-xs">
        <span>Kontribusi {topMenuItems.length} Menu:</span>
        <span className="font-bold text-olive">{topMenuContribution} Total Penjualan</span>
      </footer>
    </section>
  )
}