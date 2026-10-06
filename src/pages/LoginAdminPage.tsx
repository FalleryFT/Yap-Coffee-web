import { ArrowRight, Coffee, Eye, EyeOff, LoaderCircle, Lock, User } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CupIcon } from '../components/CupIcon'
import { Field } from '../components/Field'
import { toApiError } from '../lib/apiError'
import { tokenStorage } from '../lib/tokenStorage'
import { loginAdmin } from '../services/authService'

type FieldErrors = Partial<Record<'username' | 'password', string>>

export default function LoginAdminPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Sudah punya token: langsung ke dashboard.
  if (tokenStorage.get()) return <Navigate to="/dashboard" replace />

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
      navigate('/dashboard', { replace: true })
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

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-8">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-espresso text-white">
            <Coffee size={20} aria-hidden />
          </span>
          <span className="text-[1.75rem] leading-none font-bold tracking-tight text-espresso">Yap Coffee</span>
        </div>
        <p className="mt-2 text-xs font-medium tracking-wide text-bark">ADMIN PORTAL</p>
      </header>

      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <div className="text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-sand text-espresso">
            <CupIcon size={26} />
          </span>
          <p className="mt-4 text-xs font-semibold tracking-wide text-mocha">SISTEM OPERASIONAL TOKO</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-espresso">Masuk Akun Admin</h1>
          <p className="mx-auto mt-2 max-w-72 text-sm leading-normal text-bark">
            Kelola sesi pre-order, katalog menu, dan antrean pesanan kopi.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-6">
          <Field
            id="username"
            label="Username"
            icon={<User size={20} aria-hidden />}
            placeholder="Masukkan username admin"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={fieldErrors.username}
            disabled={loading}
          />

          <Field
            id="password"
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            icon={<Lock size={20} aria-hidden />}
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            disabled={loading}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-pressed={showPassword}
                className="rounded p-1 text-bark hover:text-espresso focus-visible:ring-2 focus-visible:ring-espresso/40 focus-visible:outline-none"
              >
                {showPassword ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
              </button>
            }
          />

          {formError && (
            <p role="alert" className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-espresso text-lg font-semibold text-white shadow-lg shadow-espresso/25 transition hover:bg-espresso/90 focus-visible:ring-2 focus-visible:ring-espresso focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <LoaderCircle size={20} className="animate-spin" aria-hidden />
                Memproses...
              </>
            ) : (
              <>
                Masuk ke Dashboard
                <ArrowRight size={20} aria-hidden />
              </>
            )}
          </button>
        </form>
      </section>

      <footer className="mt-6 text-center text-xs text-bark">
        Yap Coffee © {new Date().getFullYear()} • Khusus Akses Pengelola Gerai
      </footer>
    </main>
  )
}
