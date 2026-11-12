import { useEffect, useState } from 'react'
import { onSettingsChanged } from '@/lib/appEvents'
import { getStoreSettings } from '@/services/settingsService'

/** Nama outlet yang diatur di halaman Pengaturan; kosong selama belum termuat. */
export function useOutletName(): string {
  const [name, setName] = useState('')

  useEffect(() => {
    let active = true
    const load = () =>
      getStoreSettings()
        .then((settings) => active && setName(settings.outletName))
        .catch(() => {})
    load()
    const stopListening = onSettingsChanged(load)
    return () => {
      active = false
      stopListening()
    }
  }, [])

  return name
}
