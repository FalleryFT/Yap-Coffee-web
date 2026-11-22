import { http } from '@/lib/http'
import type { ApiSuccess } from '@/types/api'
import type { StoreSettings, StoreSettingsPayload } from '@/types/outlet'

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