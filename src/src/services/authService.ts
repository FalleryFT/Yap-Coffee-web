import { http } from '@/lib/http'
import type { ApiSuccess } from '@/types/api'
import type { AdminLoginPayload, AdminLoginResult, AdminUser, ChangePasswordPayload } from '@/types/auth'

export async function loginAdmin(payload: AdminLoginPayload): Promise<AdminLoginResult> {
  const { data } = await http.post<ApiSuccess<AdminLoginResult>>('/admin/auth/login', payload)
  return data.data
}

export async function getAdminProfile(): Promise<AdminUser> {
  const { data } = await http.get<ApiSuccess<AdminUser>>('/admin/me')
  return data.data
}

/** Mengganti nama tampilan admin. Username (untuk login) tidak ikut berubah. */
export async function updateAdminName(name: string): Promise<AdminUser> {
  const { data } = await http.put<ApiSuccess<AdminUser>>('/admin/me', { name })
  return data.data
}

export async function changeAdminPassword(payload: ChangePasswordPayload): Promise<void> {
  await http.post('/admin/me/change-password', payload)
}
