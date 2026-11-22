'use client'

import { AdminAccountSection } from './AdminAccountSection'

export function ProfileScreen() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-espresso">Profile & Keamanan</h1>
        <p className="mt-2 text-sm">Ubah nama admin dan kata sandi akun yang sedang masuk.</p>
      </header>

      <AdminAccountSection />
    </main>
  )
}