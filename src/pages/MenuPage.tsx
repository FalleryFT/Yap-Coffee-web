import { CirclePlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MenuCard } from '../components/menu/MenuCard'
import { MenuSummary } from '../components/menu/MenuSummary'
import { MenuToolbar } from '../components/menu/MenuToolbar'
import type { CategoryChip } from '../components/menu/MenuToolbar'
import { menuItems } from '../data/dummy'
import { getStockStatus, menuCategories } from '../lib/menu'
import type { MenuCategory, MenuItem, StockStatus } from '../types/admin'

export default function MenuPage() {
  // Popup tambah / edit / hapus menyusul; tombolnya sudah ada tetapi belum melakukan apa-apa.
  const [items] = useState<MenuItem[]>(menuItems)
  const [category, setCategory] = useState<MenuCategory | 'semua'>('semua')
  const [search, setSearch] = useState('')
  const [stock, setStock] = useState<StockStatus | 'semua'>('semua')

  const chips: CategoryChip[] = useMemo(
    () => [
      { value: 'semua', label: 'Semua', count: items.length },
      ...menuCategories.map((c) => ({
        value: c,
        label: c,
        count: items.filter((item) => item.category === c).length,
      })),
    ],
    [items],
  )

  const soldOutCount = useMemo(
    () => items.filter((item) => getStockStatus(item.stock) === 'habis').length,
    [items],
  )

  const visible = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return items.filter(
      (item) =>
        (category === 'semua' || item.category === category) &&
        (stock === 'semua' || getStockStatus(item.stock) === stock) &&
        (!keyword || item.name.toLowerCase().includes(keyword)),
    )
  }, [items, category, stock, search])

  return (
    <main className="flex flex-col gap-6 px-8 py-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-mocha uppercase">
            Katalog &amp; Manajemen Stok
            <span className="text-mist">•</span>
            <span className="font-medium text-bark normal-case">Update Otomatis Kasir POS</span>
          </p>
          <h1 className="mt-2 text-4xl font-bold text-espresso">Daftar Menu &amp; Stok Harian</h1>
        </div>
        <button className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white shadow-card hover:bg-espresso/90">
          <CirclePlus size={18} />
          Tambah Menu Baru
        </button>
      </header>

      <MenuSummary activeCount={items.length} soldOutCount={soldOutCount} />

      <MenuToolbar
        categories={chips}
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
        stock={stock}
        onStockChange={setStock}
      />

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-6 py-14 text-center text-sm text-mist">
          Tidak ada menu yang cocok dengan filter ini.
        </p>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </main>
  )
}