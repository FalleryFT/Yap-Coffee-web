'use client'

import { CupIcon } from '@/app/components/CupIcon'
import { useLogin } from '@/hooks/login/useLogin'
import { LoginBrand } from './LoginBrand'
import { LoginForm } from './LoginForm'

export function LoginScreen() {
  const login = useLogin()

  if (login.checkingSession) return null

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-8">
      <LoginBrand />

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

        <LoginForm login={login} />
      </section>

      <footer className="mt-6 text-center text-xs text-bark">
        Yap Coffee © {new Date().getFullYear()} • Khusus Akses Pengelola Gerai
      </footer>
    </main>
  )
}
