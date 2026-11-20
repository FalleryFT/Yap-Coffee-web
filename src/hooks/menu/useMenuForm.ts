import { useId, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { toApiError } from '@/lib/apiError'
import { uploadMenuImage } from '@/services/menuService'
import type { MenuAddon, MenuCategory, MenuItem } from '@/types/admin'
import type { MenuFormMode } from '@/types/menu'

/** Baris varian di form; `key` hanya untuk React & tidak dikirim ke backend. */
export interface AddonRow extends MenuAddon {
  key: number
}

let nextAddonKey = 0

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
  const [addons, setAddons] = useState<AddonRow[]>(() =>
    (item?.addons ?? []).map((a) => ({ ...a, key: nextAddonKey++ })),
  )
  const [imgPreview, setImgPreview] = useState<string | undefined>(item?.image)
  const fileRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Pesan "Harga wajib diisi" baru muncul setelah kolom harga disentuh.
  const [priceTouched, setPriceTouched] = useState(false)

  const isEdit = mode === 'edit'
  const skuLabel = item ? `SKU-${String(item.id).padStart(4, '0')}` : ''

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImgPreview(URL.createObjectURL(file))
    }
  }

  function addAddon() {
    setAddons((prev) => [...prev, { key: nextAddonKey++, label: '', extra_price: 0 }])
  }

  function updateAddon(key: number, patch: Partial<MenuAddon>) {
    setAddons((prev) => prev.map((a) => (a.key === key ? { ...a, ...patch } : a)))
  }

  function removeAddon(key: number) {
    setAddons((prev) => prev.filter((a) => a.key !== key))
  }

  const priceError = priceTouched && price <= 0
  const touchPrice = () => setPriceTouched(true)

  async function handleSave() {
    if (price <= 0) {
      setPriceTouched(true)
      return
    }
    // Baris varian yang benar-benar kosong dibuang; baris berharga tapi tanpa nama ditolak.
    if (addons.some((a) => !a.label.trim() && a.extra_price > 0)) {
      setError('Nama varian wajib diisi untuk varian yang sudah diberi harga.')
      return
    }
    const cleanAddons: MenuAddon[] = addons
      .filter((a) => a.label.trim())
      .map((a) => ({ label: a.label.trim(), extra_price: a.extra_price}))

    setSaving(true)
    setError(null)
    try {
      // Foto baru (preview blob:) diunggah dulu; yang dikirim ke menu hanya nama berkasnya.
      const image =
        imageFile && imgPreview?.startsWith('blob:') ? await uploadMenuImage(imageFile) : imgPreview
      await onSave({ name, description: desc, category, price, stock, addons: cleanAddons, image, available })
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
    price, setPrice, priceError, touchPrice, stock, setStock, available, setAvailable,
    addons, addAddon, updateAddon, removeAddon, imgPreview, setImgPreview,
    saving, error, handleFile, handleSave,
  }
}

export type MenuForm = ReturnType<typeof useMenuForm>