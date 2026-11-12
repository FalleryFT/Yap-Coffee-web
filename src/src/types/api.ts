// Bentuk respons standar dari backend (gaya Laravel).
// Sesuaikan jika backend Anda memakai format lain.

export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}

export interface ApiFailure {
  success: false
  message: string
  /** Galat validasi per kolom, contoh: { username: ["Username wajib diisi."] } */
  errors?: Record<string, string[]>
}
