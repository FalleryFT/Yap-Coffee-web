'use client'

import { StoreSection } from './StoreSection'

export function OutletScreen() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-espresso">Outlet & Kontak Penjual</h1>
        <p className="mt-2 text-sm">
          Nama outlet serta kontak WhatsApp dan Instagram. Perubahan langsung berlaku di aplikasi pelanggan.
        </p>
      </header>

      <StoreSection />
    </main>
  )
}