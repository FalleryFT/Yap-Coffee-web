'use client'

import { AdminAccountSection } from './AdminAccountSection'
import { MenuOptionsSection } from './MenuOptionsSection'
import { StoreSection } from './StoreSection'

export function SettingsScreen() {
  return (
    <main className="flex flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold text-espresso">Pengaturan</h1>
        <p className="mt-2 max-w-3xl text-sm">
          Nama outlet, kontak penjual, akun admin, serta ukuran dan tingkat manis minuman. Perubahan langsung berlaku
          di aplikasi pelanggan tanpa perlu memperbarui aplikasi.
        </p>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <div className="flex max-w-2xl flex-col gap-6">
          <StoreSection />
          <AdminAccountSection />
        </div>
        <div className="max-w-2xl">
          <MenuOptionsSection />
        </div>
      </div>
    </main>
  )
}
