const TOKEN_KEY = 'yap_admin_token'

// Next.js merender komponen client sekali di server sebelum hidrasi di browser.
// localStorage tidak ada di server, jadi setiap akses dijaga dengan pengecekan ini.
const isBrowser = () => typeof window !== 'undefined'

// Catatan keamanan: localStorage bisa dibaca oleh skrip apa pun di halaman ini.
// Untuk produksi, pertimbangkan cookie httpOnly yang diatur oleh backend.
export const tokenStorage = {
  get: (): string | null => (isBrowser() ? localStorage.getItem(TOKEN_KEY) : null),
  set: (token: string): void => {
    if (isBrowser()) localStorage.setItem(TOKEN_KEY, token)
  },
  clear: (): void => {
    if (isBrowser()) localStorage.removeItem(TOKEN_KEY)
  },
}
