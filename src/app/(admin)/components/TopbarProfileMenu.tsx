'use client'

import { useEffect, useRef, useState } from 'react'
import { User } from 'lucide-react'
import { adminJobTitle } from '@/data/dummy'
import type { AdminUser } from '@/types/auth'

// Avatar bulat berisi huruf awal nama admin. Bila diklik, muncul kartu menu di bawahnya
// (gaya menu profil GitHub). Isi menunya belum ada selain identitas admin; item lain
// (Profil, Pengaturan, dst.) tinggal ditambahkan di bawah garis pemisah.
export function TopbarProfileMenu({ profile }: { profile: AdminUser | null }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Tutup saat klik di luar atau menekan Esc.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const initial = profile ? profile.name.charAt(0).toUpperCase() : ''

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu profil"
        className="flex size-9 items-center justify-center rounded-full bg-espresso text-sm font-semibold text-white transition hover:bg-espresso/90 focus-visible:ring-2 focus-visible:ring-espresso focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:outline-none"
      >
        {initial || <User size={18} strokeWidth={1.75} aria-hidden />}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Menu profil"
          className="absolute top-[calc(100%+10px)] right-0 z-30 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-white shadow-card"
        >
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-espresso text-sm font-semibold text-white">
              {initial || <User size={18} strokeWidth={1.75} aria-hidden />}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-espresso">
                {profile ? profile.name : 'Memuat...'}
              </p>
              <p className="truncate text-xs text-mocha">{adminJobTitle}</p>
            </div>
          </div>
          <div className="border-t border-line" />
          {/* Item menu (Profil, Pengaturan, dll.) ditambahkan di sini nanti. */}
        </div>
      )}
    </div>
  )
}