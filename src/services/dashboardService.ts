import { http } from '@/lib/http'
import type { ApiSuccess } from '@/types/api'
import type { DashboardData } from '@/types/dashboard'

// Query GET /admin/dashboard (backend/src/validators/dashboardValidators.ts → dashboardQuerySchema).
export interface GetDashboardParams {
  q?: string
  queueLimit?: number
}

export async function getDashboard(params: GetDashboardParams = {}): Promise<DashboardData> {
  const { data } = await http.get<ApiSuccess<DashboardData>>('/admin/dashboard', { params })
  return data.data
}
