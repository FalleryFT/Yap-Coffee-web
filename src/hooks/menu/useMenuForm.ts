import { useId, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { MenuCategory, MenuItem } from '@/types/admin'
import type { MenuFormMode } from '@/types/menu'

export function useMenuForm(
  mode: MenuFormMode,
  item: MenuItem | undefined,
  onSave: (data: Partial<MenuItem>) => void,
  onClose: () => void,
) {
  const titleId = useId()

  const [name, setName] = useState(item?.name ?? '')
  const [desc, setDesc] = useState(item?.description ?? '')
  const [category, setCategory] = useState<MenuCategory>(item?.category ?? 'Kopi Susu')
  const [price, setPrice] = useState(item?.price ?? 0)
  const [stock, setStock] = useState(item?.stock ?? 25)
  const [available, setAvailable] = useState(true)
  const [addons, setAddons] = useState<string[]>(item?.addons ?? [])
  const [newAddon, setNewAddon] = useState('')
  const [imgPreview, setImgPreview] = useState<string | undefined>(item?.image)
  const fileRef = useRef<HTMLInputElement>(null)

  const isEdit = mode === 'edit'
  const skuLabel = item ? `SKU-${String(item.id).padStart(4, '0')}` : ''

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setImgPreview(URL.createObjectURL(file))
  }

  function addAddonTag() {
    const t = newAddon.trim()
    if (t && !addons.includes(t)) setAddons((prev) => [...prev, t])
    setNewAddon('')
  }

  function removeAddon(tag: string) {
    setAddons((prev) => prev.filter((a) => a !== tag))
  }

  function handleSave() {
    onSave({ name, description: desc, category, price, stock, addons, image: imgPreview })
    onClose()
  }

  return {
    titleId, isEdit, skuLabel, fileRef,
    name, setName, desc, setDesc, category, setCategory,
    price, setPrice, stock, setStock, available, setAvailable,
    addons, newAddon, setNewAddon, imgPreview, setImgPreview,
    handleFile, addAddonTag, removeAddon, handleSave,
  }
}

export type MenuForm = ReturnType<typeof useMenuForm>
