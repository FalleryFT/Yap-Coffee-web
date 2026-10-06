import { http } from '../lib/http'
import type { ApiSuccess } from '../types/api'
import type { AdminLoginPayload, AdminLoginResult, AdminUser } from '../types/auth'

export async function loginAdmin(payload: AdminLoginPayload): Promise<AdminLoginResult> {
  const { data } = await http.post<ApiSuccess<AdminLoginResult>>('/admin/auth/login', payload)
  return data.data
}

export async function getAdminProfile(): Promise<AdminUser> {
  const { data } = await http.get<ApiSuccess<AdminUser>>('/admin/me')
  return data.data
}
