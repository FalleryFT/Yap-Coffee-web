import { useCallback, useMemo, useState } from 'react'
import { menuItems } from '@/data/dummy'
import { getStockStatus } from '@/utils/menu'
import { menuCategories } from '@/constants/menu'
import type { MenuCategory, MenuItem, StockStatus } from '@/types/admin'
import type { CategoryChip, ModalState } from '@/types/menu'

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>(menuItems)
  const [category, setCategory] = useState<MenuCategory | 'semua'>('semua')
  const [search, setSearch] = useState('')
  const [stock, setStock] = useState<StockStatus | 'semua'>('semua')
  const [modal, setModal] = useState<ModalState>({ type: 'none' })

  const closeModal = useCallback(() => setModal({ type: 'none' }), [])

  function handleSave(data: Partial<MenuItem>) {
    if (modal.type === 'add') {
      const newItem: MenuItem = {
        id: Date.now(),
        name: data.name ?? '',
        description: data.description ?? '',
        category: data.category ?? 'Kopi Susu',
        price: data.price ?? 0,
        stock: data.stock ?? 0,
        addons: data.addons ?? [],
        image: data.image,
      }
      setItems((prev) => [...prev, newItem])
    } else if (modal.type === 'edit') {
      setItems((prev) =>
        prev.map((it) => (it.id === modal.item.id ? { ...it, ...data } : it)),
      )
    }
  }

  function handleDelete(item: MenuItem) {
    setItems((prev) => prev.filter((it) => it.id !== item.id))
  }

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

  return {
    items, chips, soldOutCount, visible,
    category, setCategory, search, setSearch, stock, setStock,
    modal, setModal, closeModal, handleSave, handleDelete,
  }
}
