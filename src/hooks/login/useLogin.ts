import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toApiError } from '@/lib/apiError'
import { tokenStorage } from '@/lib/tokenStorage'
import { loginAdmin } from '@/services/authService'

type FieldErrors = Partial<Record<'username' | 'password', string>>

export function useLogin() {
  const router = useRouter()

  // Dicek lewat useEffect (bukan langsung saat render) karena localStorage hanya ada
  // di browser: Next.js merender komponen ini sekali di server dulu sebelum hidrasi,
  // dan render pertama di server/klien harus menghasilkan HTML yang sama persis.
  const [checkingSession, setCheckingSession] = useState(true)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    // Sengaja: effect ini SEDANG mensinkronkan dengan sistem eksternal (localStorage),
    // jadi setState di sini bukan anti-pattern meski linter menandainya. Nilainya tidak
    // bisa dihitung langsung saat render karena localStorage tidak ada di server.
    if (tokenStorage.get()) {
      router.replace('/dashboard')
      return
    }
    setCheckingSession(false)
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    // 1) Validasi di sisi klien
    const errors: FieldErrors = {}
    if (!username.trim()) errors.username = 'Username wajib diisi.'
    if (!password) errors.password = 'Kata sandi wajib diisi.'
    setFieldErrors(errors)
    setFormError(null)
    if (Object.keys(errors).length > 0) return

    // 2) Kirim ke API
    setLoading(true)
    try {
      const result = await loginAdmin({ username: username.trim(), password })
      tokenStorage.set(result.token)
      router.replace('/dashboard')
    } catch (err) {
      const apiError = toApiError(err)
      const hasFieldErrors = Object.keys(apiError.fieldErrors).length > 0

      setFieldErrors({
        username: apiError.errorFor('username'),
        password: apiError.errorFor('password'),
      })
      // Galat per kolom tampil di bawah input; selain itu tampil sebagai pesan umum.
      setFormError(hasFieldErrors ? null : apiError.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    checkingSession, username, setUsername, password, setPassword,
    showPassword, toggleShowPassword: () => setShowPassword((v) => !v),
    loading, formError, fieldErrors, handleSubmit,
  }
}

export type LoginState = ReturnType<typeof useLogin>
