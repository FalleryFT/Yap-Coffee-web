import { http } from '@/lib/http'
import { formatAddon, parseAddon, toImageUrl } from '@/utils/menu'
import type { ApiSuccess } from '@/types/api'
import type { MenuItem } from '@/types/admin'
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
  addons: (AddonPayload & { id: number })[]
}

export interface MenuPayload {
  name: string
  description: string
  category: string
  price: number
  stock: number
  image?: string | null
  addons: AddonPayload[]
}

function toMenuItem(row: ApiMenuItem): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    price: row.price,
    stock: row.stock,
    image: toImageUrl(row.image),
    addons: row.addons.map(formatAddon),
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
    addons: (data.addons ?? []).map(parseAddon),
  }
}

/** Mengirim hanya kolom yang berubah dibanding `original`. */
export function toUpdatePayload(data: Partial<MenuItem>, original: MenuItem): Partial<MenuPayload> {
  const payload: Partial<MenuPayload> = {}
  if (data.name !== undefined && data.name !== original.name) payload.name = data.name
  if (data.description !== undefined && data.description !== original.description)
    payload.description = data.description
  if (data.category !== undefined && data.category !== original.category)
    payload.category = data.category
  if (data.price !== undefined && data.price !== original.price) payload.price = data.price
  if (data.stock !== undefined && data.stock !== original.stock) payload.stock = data.stock
  if (data.addons !== undefined && data.addons.join('|') !== original.addons.join('|'))
    payload.addons = data.addons.map(parseAddon)
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

export async function createMenuItem(payload: MenuPayload): Promise<MenuItem> {
  const { data } = await http.post<ApiSuccess<ApiMenuItem>>('/admin/menu', payload)
  return toMenuItem(data.data)
}

export async function updateMenuItem(id: number, payload: Partial<MenuPayload>): Promise<MenuItem> {
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
