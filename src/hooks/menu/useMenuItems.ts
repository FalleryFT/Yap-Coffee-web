import { useCallback, useEffect, useMemo, useState } from 'react'
import { toApiError } from '@/lib/apiError'
import {
  createMenuCategory, createMenuItem, deleteMenuCategory, deleteMenuItem, getMenuCategories, getMenuItems,
  toCreatePayload, toUpdatePayload, updateMenuItem, type MenuCategoryOption,
} from '@/services/menuService'
import { getStockStatus } from '@/utils/menu'
import type { MenuCategory, MenuItem, StockStatus } from '@/types/admin'
import type { CategoryChip, ModalState } from '@/types/menu'

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categoryOptions, setCategoryOptions] = useState<MenuCategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [category, setCategory] = useState<MenuCategory | 'semua'>('semua')
  const [search, setSearch] = useState('')
  const [stock, setStock] = useState<StockStatus | 'semua'>('semua')
  const [modal, setModal] = useState<ModalState>({ type: 'none' })

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(null)
    Promise.all([getMenuItems(), getMenuCategories()])
      .then(([menuItems, options]) => {
        if (!active) return
        setItems(menuItems)
        setCategoryOptions(options)
      })
      .catch((err) => active && setLoadError(toApiError(err).message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])
  const closeModal = useCallback(() => setModal({ type: 'none' }), [])

  // Galat sengaja dilempar ulang (sebagai ApiError) agar modal bisa menampilkannya.
  async function handleSave(data: Partial<MenuItem>) {
    try {
      if (modal.type === 'add') {
        const created = await createMenuItem(toCreatePayload(data))
        setItems((prev) => [...prev, created])
      } else if (modal.type === 'edit') {
        const payload = toUpdatePayload(data, modal.item)
        if (Object.keys(payload).length === 0) return
        const updated = await updateMenuItem(modal.item.id, payload)
        setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
      }
    } catch (err) {
      throw toApiError(err)
    }
  }

  // Galat dilempar ulang (sebagai ApiError) agar modal kategori bisa menampilkannya.
  async function handleAddCategory(name: string, hasOptions: boolean) {
    try {
      const saved = await createMenuCategory(name, hasOptions)
      setCategories((prev) => (prev.includes(saved) ? prev : [...prev, saved]))
      setCategory(saved) // langsung pindah ke kategori baru
      const saved = await createMenuCategory(name)
      setCategoryOptions((prev) => (prev.some((c) => c.id === saved.id) ? prev : [...prev, saved]))
      setCategory(saved.name) // langsung pindah ke kategori baru
    } catch (err) {
      throw toApiError(err)
    }
  }

  // Galat dilempar ulang (sebagai ApiError) agar strip kategori bisa menampilkannya.
  async function handleDeleteCategory(chip: CategoryChip, moveTo?: CategoryChip) {
    if (chip.id === undefined || chip.value === 'semua') return
    try {
      // "Semua" berarti menu dilepas dari kategori (tetap tampil di filter Semua).
      const nextCategory =
        moveTo?.value === 'semua' ? null : (moveTo?.value as MenuCategory | undefined)
      await deleteMenuCategory(chip.id, moveTo?.value === 'semua' ? 'none' : moveTo?.id)
      setCategoryOptions((prev) => prev.filter((c) => c.id !== chip.id))
      // Menu tidak ikut terhapus: samakan kategori barunya di layar tanpa memuat ulang.
      if (nextCategory !== undefined) {
        setItems((prev) =>
          prev.map((it) => (it.category === chip.value ? { ...it, category: nextCategory } : it)),
        )
      }
      // Filter yang sedang aktif ikut dihapus → kembali ke "Semua".
      setCategory((prev) => (prev === chip.value ? 'semua' : prev))
    } catch (err) {
      throw toApiError(err)
    }
  }

  async function handleDelete(item: MenuItem) {
    try {
      await deleteMenuItem(item.id)
      setItems((prev) => prev.filter((it) => it.id !== item.id))
    } catch (err) {
      throw toApiError(err)
    }
  }

  const categories = useMemo(() => categoryOptions.map((c) => c.name), [categoryOptions])

  const chips: CategoryChip[] = useMemo(
    () => [
      { value: 'semua', label: 'Semua', count: items.length },
      ...categoryOptions.map((c) => ({
        id: c.id,
        value: c.name,
        label: c.name,
        count: items.filter((item) => item.category === c.name).length,
      })),
    ],
    [items, categoryOptions],
  )

  // Hanya menu yang tampil di katalog pelanggan yang dihitung "aktif".
  const activeCount = useMemo(() => items.filter((item) => item.available).length, [items])

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
    items, categories, loading, loadError, reload, chips, activeCount, soldOutCount, visible,
    category, setCategory, search, setSearch, stock, setStock,
    modal, setModal, closeModal, handleSave, handleAddCategory, handleDeleteCategory, handleDelete,
  }
}
