import { http } from '@/lib/http'
import { toImageUrl } from '@/utils/menu'
import type { ApiSuccess } from '@/types/api'
import type { MenuItem, MenuSize, MenuSugar, MenuType } from '@/types/admin'
import type { AddonPayload } from '@/utils/menu'

// Bentuk menu dari backend (backend/src/controllers/adminMenuController.ts → toMenuDto).
interface ApiMenuItem {
  id: number
  name: string
  description: string
  category: MenuItem['category']
  price: number
  stock: number
  image?: string
  available: boolean
  menuType: MenuType
  hasOptions: boolean
  addons: (AddonPayload & { id: number })[]
  sizes: (MenuSize & { detail?: string })[]
  sugarLevels: MenuSugar[]
}

export interface MenuPayload {
  name: string
  description: string
  category: string
  price: number
  stock: number
  image?: string | null
  available: boolean
  addons: AddonPayload[]
  /** Hanya dikirim saat membuat menu; jenis menu terkunci setelahnya. */
  menuType: MenuType
  sizes: MenuSize[]
  sugarLevels: MenuSugar[]
}

/** Payload ubah menu: tanpa menuType (terkunci). */
export type MenuUpdatePayload = Partial<Omit<MenuPayload, 'menuType'>>

function toMenuItem(row: ApiMenuItem): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    price: row.price,
    stock: row.stock,
    image: toImageUrl(row.image),
    available: row.available,
    menuType: row.menuType,
    hasOptions: row.menuType === 'minuman',
    addons: row.addons.map(({ label, extra_price }) => ({ label, extra_price })),
    sizes: (row.sizes ?? []).map(({ label, oz, extraPrice, isDefault }) => ({ label, oz, extraPrice, isDefault })),
    sugarLevels: (row.sugarLevels ?? []).map(({ label, isDefault }) => ({ label, isDefault })),
  }
}

/** Data form (Partial<MenuItem>) → badan permintaan tambah menu. */
export function toCreatePayload(data: Partial<MenuItem>): MenuPayload {
  return {
    name: data.name ?? '',
    description: data.description ?? '',
    category: data.category ?? 'Kopi Susu',
    price: data.price ?? 0,
    stock: data.stock ?? 0,
    // Berisi nama berkas hasil uploadMenuImage; blob: lokal tidak boleh ikut terkirim.
    image: data.image && !data.image.startsWith('blob:') ? data.image : null,
    available: data.available ?? true,
    addons: data.addons ?? [],
    menuType: data.menuType ?? 'minuman',
    // Makanan tidak punya pilihan ukuran dan manis.
    sizes: data.menuType === 'makanan' ? [] : (data.sizes ?? []),
    sugarLevels: data.menuType === 'makanan' ? [] : (data.sugarLevels ?? []),
  }
}

/** Mengirim hanya kolom yang berubah dibanding `original`. */
export function toUpdatePayload(data: Partial<MenuItem>, original: MenuItem): MenuUpdatePayload {
  const payload: MenuUpdatePayload = {}
  if (data.name !== undefined && data.name !== original.name) payload.name = data.name
  if (data.description !== undefined && data.description !== original.description)
    payload.description = data.description
  if (data.category != null && data.category !== original.category) payload.category = data.category
  if (data.price !== undefined && data.price !== original.price) payload.price = data.price
  if (data.stock !== undefined && data.stock !== original.stock) payload.stock = data.stock
  if (data.available !== undefined && data.available !== original.available)
    payload.available = data.available
  if (data.addons !== undefined && JSON.stringify(data.addons) !== JSON.stringify(original.addons))
    payload.addons = data.addons
  // Ukuran dan manis hanya untuk minuman; jenis menu tidak pernah ikut dikirim.
  if (original.menuType === 'minuman') {
    if (data.sizes !== undefined && JSON.stringify(data.sizes) !== JSON.stringify(original.sizes))
      payload.sizes = data.sizes
    if (
      data.sugarLevels !== undefined &&
      JSON.stringify(data.sugarLevels) !== JSON.stringify(original.sugarLevels)
    )
      payload.sugarLevels = data.sugarLevels
  }
  // Foto dihapus di form → null; foto baru → nama berkas hasil unggah.
  if (original.image && data.image === undefined) payload.image = null
  else if (data.image && data.image !== original.image && !data.image.startsWith('blob:'))
    payload.image = data.image
  return payload
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data } = await http.get<ApiSuccess<ApiMenuItem[]>>('/admin/menu')
  return data.data.map(toMenuItem)
}

export interface MenuCategoryOption {
  id: number
  name: string
  /** true = kategori minuman, false = kategori makanan. */
  hasOptions: boolean
}

export async function getMenuCategories(): Promise<MenuCategoryOption[]> {
  const { data } = await http.get<ApiSuccess<MenuCategoryOption[]>>('/admin/menu/categories')
  return data.data
}

/** Mengembalikan kategori seperti yang tersimpan (nama sudah di-trim oleh backend). */
export async function createMenuCategory(name: string, hasOptions = true): Promise<MenuCategoryOption> {
  const { data } = await http.post<ApiSuccess<MenuCategoryOption>>('/admin/menu/categories', {
    name,
    hasOptions,
  })
  return data.data
}

/**
 * Menghapus kategori. Tanpa `moveTo`, backend menolak (409) kalau masih dipakai menu;
 * `moveTo` angka memindahkan menu ke kategori itu, `'none'` melepas menunya dari kategori
 * (tetap tampil di filter "Semua"). Tidak ada menu yang ikut terhapus.
 */
export async function deleteMenuCategory(id: number, moveTo?: number | 'none'): Promise<void> {
  await http.delete(
    `/admin/menu/categories/${id}`,
    moveTo === undefined ? undefined : { params: { moveTo } },
  )
}

export async function createMenuItem(payload: MenuPayload): Promise<MenuItem> {
  const { data } = await http.post<ApiSuccess<ApiMenuItem>>('/admin/menu', payload)
  return toMenuItem(data.data)
}

export async function updateMenuItem(id: number, payload: MenuUpdatePayload): Promise<MenuItem> {
  const { data } = await http.put<ApiSuccess<ApiMenuItem>>(`/admin/menu/${id}`, payload)
  return toMenuItem(data.data)
}

export async function deleteMenuItem(id: number): Promise<void> {
  await http.delete(`/admin/menu/${id}`)
}

/** Mengunggah foto menu; hasilnya nama berkas yang dikirim ke create/update lewat field `image`. */
export async function uploadMenuImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('image', file)
  const { data } = await http.post<ApiSuccess<{ image: string; url: string }>>(
    '/admin/menu/image',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data.data.image
}