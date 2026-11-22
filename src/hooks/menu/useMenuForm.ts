import { useId, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { toApiError } from '@/lib/apiError'
import { uploadMenuImage, type MenuCategoryOption } from '@/services/menuService'
import type { MenuAddon, MenuCategory, MenuItem, MenuSize, MenuSugar, MenuType } from '@/types/admin'
import type { MenuFormMode } from '@/types/menu'

/** Maksimal pilihan ukuran / tingkat manis per menu (sama dengan batas di backend). */
export const MAX_OPTIONS = 6

/** Baris varian di form; `key` hanya untuk React & tidak dikirim ke backend. */
export interface AddonRow extends MenuAddon {
  key: number
}

/** Baris ukuran gelas di form. `oz` 0 = kosong (tanpa keterangan). */
export interface SizeRow {
  key: number
  label: string
  oz: number
  extraPrice: number
  isDefault: boolean
}

export interface SugarRow {
  key: number
  label: string
  isDefault: boolean
}

let nextRowKey = 0

/** Bila yang bawaan hilang, baris pertama menjadi bawaan; daftar kosong dibiarkan kosong. */
function ensureDefault<T extends { isDefault: boolean }>(rows: T[]): T[] {
  if (rows.length === 0 || rows.some((r) => r.isDefault)) return rows
  return rows.map((r, i) => ({ ...r, isDefault: i === 0 }))
}

function hasDuplicate(labels: string[]): boolean {
  return new Set(labels.map((l) => l.toLowerCase())).size !== labels.length
}

export function useMenuForm(
  mode: MenuFormMode,
  item: MenuItem | undefined,
  onSave: (data: Partial<MenuItem>) => Promise<void>,
  onClose: () => void,
  categoryOptions: MenuCategoryOption[],
) {
  const titleId = useId()
  const isEdit = mode === 'edit'

  const [name, setName] = useState(item?.name ?? '')
  const [desc, setDesc] = useState(item?.description ?? '')
  // Jenis menu dipilih saat menambah; saat mengedit terkunci (tidak ada setter yang dipakai).
  const [menuType, setMenuType] = useState<MenuType>(item?.menuType ?? 'minuman')

  // Kategori yang tampil hanya yang sejenis dengan menu: minuman → kategori minuman, makanan → kategori makanan.
  const categories = useMemo(
    () => categoryOptions.filter((c) => c.hasOptions === (menuType === 'minuman')).map((c) => c.name),
    [categoryOptions, menuType],
  )

  // Menu tanpa kategori (kategori asalnya dihapus) sengaja dimulai kosong agar admin
  // wajib memilih kategori sebelum menyimpan.
  const [category, setCategory] = useState<MenuCategory>(
    item ? (item.category ?? '') : (categories[0] ?? ''),
  )
  const [price, setPrice] = useState(item?.price ?? 0)
  const [stock, setStock] = useState(item?.stock ?? 25)
  const [available, setAvailable] = useState(item?.available ?? true)
  const [addons, setAddons] = useState<AddonRow[]>(() =>
    (item?.addons ?? []).map((a) => ({ ...a, key: nextRowKey++ })),
  )
  const [sizes, setSizes] = useState<SizeRow[]>(() =>
    (item?.sizes ?? []).map((s) => ({
      key: nextRowKey++,
      label: s.label,
      oz: s.oz ?? 0,
      extraPrice: s.extraPrice,
      isDefault: s.isDefault,
    })),
  )
  const [sugars, setSugars] = useState<SugarRow[]>(() =>
    (item?.sugarLevels ?? []).map((s) => ({ key: nextRowKey++, label: s.label, isDefault: s.isDefault })),
  )
  const [imgPreview, setImgPreview] = useState<string | undefined>(item?.image)
  const fileRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Pesan "Harga wajib diisi" baru muncul setelah kolom harga disentuh.
  const [priceTouched, setPriceTouched] = useState(false)

  const skuLabel = item ? `SKU-${String(item.id).padStart(4, '0')}` : ''

  /** Ganti jenis menu (hanya saat tambah). Kategori dipilih ulang karena daftarnya ikut berganti. */
  function selectMenuType(next: MenuType) {
    if (isEdit || next === menuType) return
    setMenuType(next)
    setCategory(
      categoryOptions.find((c) => c.hasOptions === (next === 'minuman'))?.name ?? '',
    )
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImgPreview(URL.createObjectURL(file))
    }
  }

  // ── Varian ──
  function addAddon() {
    setAddons((prev) => [...prev, { key: nextRowKey++, label: '', extra_price: 0 }])
  }
  function updateAddon(key: number, patch: Partial<MenuAddon>) {
    setAddons((prev) => prev.map((a) => (a.key === key ? { ...a, ...patch } : a)))
  }
  function removeAddon(key: number) {
    setAddons((prev) => prev.filter((a) => a.key !== key))
  }

  // ── Ukuran gelas (hanya minuman) ──
  function addSize() {
    setSizes((prev) =>
      prev.length >= MAX_OPTIONS
        ? prev
        : [...prev, { key: nextRowKey++, label: '', oz: 0, extraPrice: 0, isDefault: prev.length === 0 }],
    )
  }
  function updateSize(key: number, patch: Partial<SizeRow>) {
    setSizes((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  }
  function setDefaultSize(key: number) {
    setSizes((prev) => prev.map((r) => ({ ...r, isDefault: r.key === key })))
  }
  function removeSize(key: number) {
    setSizes((prev) => ensureDefault(prev.filter((r) => r.key !== key)))
  }

  // ── Tingkat manis (hanya minuman) ──
  function addSugar() {
    setSugars((prev) =>
      prev.length >= MAX_OPTIONS
        ? prev
        : [...prev, { key: nextRowKey++, label: '', isDefault: prev.length === 0 }],
    )
  }
  function updateSugar(key: number, label: string) {
    setSugars((prev) => prev.map((r) => (r.key === key ? { ...r, label } : r)))
  }
  function setDefaultSugar(key: number) {
    setSugars((prev) => prev.map((r) => ({ ...r, isDefault: r.key === key })))
  }
  function removeSugar(key: number) {
    setSugars((prev) => ensureDefault(prev.filter((r) => r.key !== key)))
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
      .map((a) => ({ label: a.label.trim(), extra_price: a.extra_price }))

    // Ukuran dan manis hanya untuk minuman dan boleh dikosongkan; baris yang sama sekali kosong dibuang.
    let cleanSizes: MenuSize[] = []
    let cleanSugars: MenuSugar[] = []
    if (menuType === 'minuman') {
      if (sizes.some((s) => !s.label.trim() && (s.oz > 0 || s.extraPrice > 0))) {
        setError('Nama ukuran wajib diisi untuk ukuran yang sudah diberi ukuran (oz) atau harga.')
        return
      }
      const sizeRows = sizes.filter((s) => s.label.trim())
      const sugarRows = sugars.filter((s) => s.label.trim())
      if (hasDuplicate(sizeRows.map((s) => s.label.trim()))) {
        setError('Nama ukuran tidak boleh kembar.')
        return
      }
      if (hasDuplicate(sugarRows.map((s) => s.label.trim()))) {
        setError('Nama tingkat manis tidak boleh kembar.')
        return
      }
      // Urutan kunci sengaja sama dengan bentuk dari backend agar perubahan terdeteksi dengan benar.
      cleanSizes = ensureDefault(sizeRows).map((s) => ({
        label: s.label.trim(),
        oz: s.oz > 0 ? s.oz : null,
        extraPrice: s.extraPrice,
        isDefault: s.isDefault,
      }))
      cleanSugars = ensureDefault(sugarRows).map((s) => ({
        label: s.label.trim(),
        isDefault: s.isDefault,
      }))
    }

    setSaving(true)
    setError(null)
    try {
      // Foto baru (preview blob:) diunggah dulu; yang dikirim ke menu hanya nama berkasnya.
      const image =
        imageFile && imgPreview?.startsWith('blob:') ? await uploadMenuImage(imageFile) : imgPreview
      await onSave({
        name,
        description: desc,
        category,
        menuType,
        price,
        stock,
        addons: cleanAddons,
        sizes: cleanSizes,
        sugarLevels: cleanSugars,
        image,
        available,
      })
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
    menuType, selectMenuType,
    price, setPrice, priceError, touchPrice, stock, setStock, available, setAvailable,
    addons, addAddon, updateAddon, removeAddon,
    sizes, addSize, updateSize, setDefaultSize, removeSize,
    sugars, addSugar, updateSugar, setDefaultSugar, removeSugar,
    imgPreview, setImgPreview,
    saving, error, handleFile, handleSave,
  }
}

export type MenuForm = ReturnType<typeof useMenuForm>