import { useId, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { toApiError } from '@/lib/apiError'
import { uploadMenuImage } from '@/services/menuService'
import type { MenuCategory, MenuItem } from '@/types/admin'
import type { MenuFormMode } from '@/types/menu'

export function useMenuForm(
  mode: MenuFormMode,
  item: MenuItem | undefined,
  onSave: (data: Partial<MenuItem>) => Promise<void>,
  onClose: () => void,
  categories: string[],
) {
  const titleId = useId()

  const [name, setName] = useState(item?.name ?? '')
  const [desc, setDesc] = useState(item?.description ?? '')
  // Menu tanpa kategori (kategori asalnya dihapus) sengaja dimulai kosong agar admin
  // wajib memilih kategori sebelum menyimpan.
  const [category, setCategory] = useState<MenuCategory>(
    item ? (item.category ?? '') : (categories[0] ?? ''),
  )
  const [price, setPrice] = useState(item?.price ?? 0)
  const [stock, setStock] = useState(item?.stock ?? 25)
  const [available, setAvailable] = useState(item?.available ?? true)
  const [addons, setAddons] = useState<string[]>(item?.addons ?? [])
  const [newAddon, setNewAddon] = useState('')
  const [imgPreview, setImgPreview] = useState<string | undefined>(item?.image)
  const fileRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = mode === 'edit'
  const skuLabel = item ? `SKU-${String(item.id).padStart(4, '0')}` : ''

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImgPreview(URL.createObjectURL(file))
    }
  }

  function addAddonTag() {
    const t = newAddon.trim()
    if (t && !addons.includes(t)) setAddons((prev) => [...prev, t])
    setNewAddon('')
  }

  function removeAddon(tag: string) {
    setAddons((prev) => prev.filter((a) => a !== tag))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      // Foto baru (preview blob:) diunggah dulu; yang dikirim ke menu hanya nama berkasnya.
      const image =
        imageFile && imgPreview?.startsWith('blob:') ? await uploadMenuImage(imageFile) : imgPreview
      await onSave({ name, description: desc, category, price, stock, addons, image, available })
      onClose()
    } catch (err) {
      const apiError = toApiError(err)
      // Utamakan pesan kolom pertama (contoh: "Harga tidak boleh negatif.") bila ada.
      setError(Object.values(apiError.fieldErrors)[0]?.[0] ?? apiError.message)
      setSaving(false)
    }
  }

  return {
    titleId, isEdit, skuLabel, fileRef, categories,
    name, setName, desc, setDesc, category, setCategory,
    price, setPrice, stock, setStock, available, setAvailable,
    addons, newAddon, setNewAddon, imgPreview, setImgPreview,
    saving, error, handleFile, addAddonTag, removeAddon, handleSave,
  }
}

export type MenuForm = ReturnType<typeof useMenuForm>