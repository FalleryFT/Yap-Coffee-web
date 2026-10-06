import axios from 'axios'
import type { ApiFailure } from '../types/api'

// Sengaja tanpa "parameter properties" karena tsconfig memakai erasableSyntaxOnly.
export class ApiError extends Error {
  status?: number
  fieldErrors: Record<string, string[]>

  constructor(message: string, status?: number, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }

  /** Pesan galat pertama untuk sebuah kolom, atau undefined bila tidak ada. */
  errorFor(field: string): string | undefined {
    return this.fieldErrors[field]?.[0]
  }
}

/** Mengubah galat Axios apa pun menjadi ApiError dengan pesan berbahasa Indonesia. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError<ApiFailure>(error)) {
    // Tidak ada respons: server mati, CORS ditolak, atau jaringan putus.
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return new ApiError('Server terlalu lama merespons. Coba lagi sebentar lagi.')
      }
      return new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
    }

    const { status, data } = error.response
    const fallback =
      status === 401 ? 'Username atau kata sandi salah.'
      : status === 403 ? 'Anda tidak punya izin untuk tindakan ini.'
      : status === 422 ? 'Data yang dikirim belum valid.'
      : status === 429 ? 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.'
      : status >= 500 ? 'Server sedang bermasalah. Coba lagi nanti.'
      : 'Terjadi kesalahan. Coba lagi.'

    return new ApiError(data?.message ?? fallback, status, data?.errors ?? {})
  }

  return new ApiError('Terjadi kesalahan yang tidak terduga.')
}
