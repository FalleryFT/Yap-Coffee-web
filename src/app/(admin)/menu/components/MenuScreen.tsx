'use client'

import { useMenuItems } from '@/hooks/menu/useMenuItems'
import { MenuCard } from './MenuCard'
import { MenuDeleteModal } from './MenuDeleteModal'
import { MenuFormModal } from './MenuFormModal'
import { MenuHeader } from './MenuHeader'
import { MenuSummary } from './MenuSummary'
import { MenuToolbar } from './MenuToolbar'

export function MenuScreen() {
  const menu = useMenuItems()
  const { modal, setModal, closeModal } = menu

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <MenuHeader onAdd={() => setModal({ type: 'add' })} />

      <MenuSummary activeCount={menu.items.length} soldOutCount={menu.soldOutCount} />

      <MenuToolbar
        categories={menu.chips}
        category={menu.category}
        onCategoryChange={menu.setCategory}
        search={menu.search}
        onSearchChange={menu.setSearch}
        stock={menu.stock}
        onStockChange={menu.setStock}
      />

      {menu.visible.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-6 py-14 text-center text-sm text-mist">
          Tidak ada menu yang cocok dengan filter ini.
        </p>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menu.visible.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onEdit={(it) => setModal({ type: 'edit', item: it })}
              onDelete={(it) => setModal({ type: 'delete', item: it })}
            />
          ))}
        </section>
      )}

      {/* ── Modals ── */}
      {modal.type === 'add' && (
        <MenuFormModal mode="add" onClose={closeModal} onSave={menu.handleSave} />
      )}
      {modal.type === 'edit' && (
        <MenuFormModal mode="edit" item={modal.item} onClose={closeModal} onSave={menu.handleSave} />
      )}
      {modal.type === 'delete' && (
        <MenuDeleteModal item={modal.item} onClose={closeModal} onConfirm={menu.handleDelete} />
      )}
    </main>
  )
}
