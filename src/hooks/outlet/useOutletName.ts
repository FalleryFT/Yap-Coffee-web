import { useEffect, useState } from 'react'
import { onAdminDataChanged } from '@/lib/appEvents'
import { getStoreSettings } from '@/services/outletService'

/** Nama outlet untuk Topbar (diatur di halaman Outlet & Kontak Penjual); kosong selama belum termuat. */
export function useOutletName(): string {
  const [name, setName] = useState('')

  useEffect(() => {
    let active = true
    const load = () =>
      getStoreSettings()
        .then((settings) => active && setName(settings.outletName))
        .catch(() => {}) // gagal memuat: Topbar tetap tampil dengan tulisan "Outlet"
    load()
    const stopListening = onAdminDataChanged(load)
    return () => {
      active = false
      stopListening()
    }
  }, [])

  return name
}