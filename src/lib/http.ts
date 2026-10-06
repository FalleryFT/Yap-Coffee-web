import axios from 'axios'
import { toApiError } from './apiError'
import { tokenStorage } from './tokenStorage'

// Endpoint publik: tidak perlu token dan tidak memicu "sesi berakhir" saat 401.
const isPublic = (url?: string) => url?.includes('/auth/login') ?? false

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Setiap permintaan: sisipkan token jika ada.
http.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token && !isPublic(config.url)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Setiap respons: ubah galat menjadi ApiError, dan tangani sesi yang berakhir.
http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error)

    // Backend membalas 401 untuk token yang hilang, tidak valid, maupun kedaluwarsa
    // (lihat backend-api/src/middlewares/auth.ts).
    if (apiError.status === 401 && axios.isAxiosError(error) && !isPublic(error.config?.url)) {
      tokenStorage.clear()
      window.location.replace('/login')
    }

    return Promise.reject(apiError)
  },
)
