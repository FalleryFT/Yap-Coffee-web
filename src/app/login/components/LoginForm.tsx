import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, User } from 'lucide-react'
import type { LoginState } from '@/hooks/login/useLogin'
import { Field } from './Field'

export function LoginForm({ login }: { login: LoginState }) {
  const { username, setUsername, password, setPassword, showPassword, toggleShowPassword } = login
  const { loading, formError, fieldErrors, handleSubmit } = login

  return (
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
            onClick={toggleShowPassword}
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
  )
}
