import { ApiError } from '@/lib/apiError'
import { http } from '@/lib/http'
import { tokenStorage } from '@/lib/tokenStorage'
import type { ApiSuccess } from '@/types/api'
import type {
  HistoryPage,
  HistoryStatsData,
  RevenueData,
  StatusFilter,
} from '@/types/history'
import type { ReceiptData } from '@/types/receipt'

// Query daftar riwayat (backend/src/validators/historyValidators.ts → listHistoryQuerySchema).
export interface GetHistoryParams {
  status?: StatusFilter
  month?: string // 'YYYY-MM' | 'semua'
  q?: string
  page?: number
  limit?: number
}

const BASE = '/admin/history'

export async function getHistory(params: GetHistoryParams): Promise<HistoryPage> {
  const { data } = await http.get<ApiSuccess<HistoryPage>>(BASE, { params })
  return data.data
}

export async function getHistoryStats(month: string): Promise<HistoryStatsData> {
  const { data } = await http.get<ApiSuccess<HistoryStatsData>>(`${BASE}/stats`, {
    params: { month },
  })
  return data.data
}

export async function getHistoryRevenue(month: string): Promise<RevenueData> {
  const { data } = await http.get<ApiSuccess<RevenueData>>(`${BASE}/revenue`, {
    params: { month },
  })
  return data.data
}

export async function getReceipt(id: string): Promise<ReceiptData> {
  const { data } = await http.get<ApiSuccess<ReceiptData>>(`${BASE}/${id}/receipt`)
  return data.data
}

export type ExportFormat = 'csv' | 'xlsx'

export interface ExportHistoryParams {
  status?: StatusFilter
  month?: string
  q?: string
  format: ExportFormat
}

/**
 * Mengunduh laporan sebagai Blob. Respons galat dari server berupa JSON, tetapi karena
 * responseType 'blob' isinya ikut menjadi Blob, jadi dibaca manual agar pesan aslinya tampil.
 */
export async function downloadHistoryExport(params: ExportHistoryParams): Promise<Blob> {
  const res = await http.get<Blob>(`${BASE}/export`, {
    params,
    responseType: 'blob',
    validateStatus: () => true,
  })

  if (res.status >= 400) {
    // validateStatus melewati interceptor galat, jadi sesi berakhir ditangani di sini.
    if (res.status === 401) {
      tokenStorage.clear()
      window.location.replace('/login')
    }
    let message: string | undefined
    try {
      message = (JSON.parse(await res.data.text()) as { message?: string }).message
    } catch {
      // bukan JSON: pakai pesan bawaan
    }
    throw new ApiError(message ?? 'Gagal mengunduh laporan. Coba lagi.', res.status)
  }
  return res.data
}
