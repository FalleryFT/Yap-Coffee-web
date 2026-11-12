import { http } from '@/lib/http'
import type { ApiSuccess } from '@/types/api'
import type { MenuOptions, StoreSettings, StoreSettingsPayload } from '@/types/settings'

const BASE = '/admin/settings'

export async function getStoreSettings(): Promise<StoreSettings> {
  const { data } = await http.get<ApiSuccess<StoreSettings>>(BASE)
  return data.data
}

/** Nilai disimpan dalam bentuk baku oleh backend (lihat backend/src/utils/storeContact.ts). */
export async function updateStoreSettings(payload: StoreSettingsPayload): Promise<StoreSettings> {
  const { data } = await http.put<ApiSuccess<StoreSettings>>(BASE, payload)
  return data.data
}

export async function getMenuOptions(): Promise<MenuOptions> {
  const { data } = await http.get<ApiSuccess<MenuOptions>>(`${BASE}/options`)
  return data.data
}

/** Mengganti seluruh daftar ukuran dan tingkat manis; berlaku seketika di aplikasi pelanggan. */
export async function updateMenuOptions(payload: MenuOptions): Promise<MenuOptions> {
  const { data } = await http.put<ApiSuccess<MenuOptions>>(`${BASE}/options`, payload)
  return data.data
}
