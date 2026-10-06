const TOKEN_KEY = 'yap_admin_token'

// Catatan keamanan: localStorage bisa dibaca oleh skrip apa pun di halaman ini.
// Untuk produksi, pertimbangkan cookie httpOnly yang diatur oleh backend.
export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
}
