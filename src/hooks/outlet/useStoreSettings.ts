import { useCallback, useState } from 'react'
import { CACHE_KEYS } from '@/constants/cacheKeys'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { TTL } from '@/lib/cache'
import { toApiError } from '@/lib/apiError'
import { getStoreSettings, updateStoreSettings } from '@/services/outletService'

type FieldErrors = Partial<Record<'outletName' | 'whatsapp' | 'instagram', string>>

/** Nama outlet, WhatsApp, dan Instagram toko. */
export function useStoreSettings() {
  const query = useCachedQuery(CACHE_KEYS.storeSettings, getStoreSettings, { ttl: TTL.long })
  const saved = query.data ?? null

  const [outletName, setOutletName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [filled, setFilled] = useState(false)

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Form diisi sekali saat data pertama tersedia (dari cache atau server). Penyegaran di latar
  // belakang hanya memperbarui `saved`, tidak menimpa ketikan yang sedang berjalan.
  if (saved && !filled) {
    setFilled(true)
    setOutletName(saved.outletName)
    setWhatsapp(saved.whatsapp)
    setInstagram(saved.instagram)
  }

  const { set: setSavedCache, reload } = query

  const dirty =
    saved !== null &&
    (outletName.trim() !== saved.outletName ||
      whatsapp.trim() !== saved.whatsapp ||
      instagram.trim() !== saved.instagram)

  const save = useCallback(async () => {
    if (saving) return
    const nextErrors: FieldErrors = {}
    if (!outletName.trim()) nextErrors.outletName = 'Nama outlet wajib diisi.'
    if (!whatsapp.trim()) nextErrors.whatsapp = 'Nomor WhatsApp wajib diisi.'
    if (!instagram.trim()) nextErrors.instagram = 'Akun Instagram wajib diisi.'
    setErrors(nextErrors)
    setSubmitError(null)
    setNotice(null)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const result = await updateStoreSettings({
        outletName: outletName.trim(),
        whatsapp: whatsapp.trim(),
        instagram: instagram.trim(),
      })
      // Form diisi ulang dengan nilai baku dari server (mis. parameter pelacak pada tautan sudah dibuang).
      // Cache ikut diperbarui, sehingga nama outlet di Topbar langsung berubah.
      setSavedCache(result)
      setOutletName(result.outletName)
      setWhatsapp(result.whatsapp)
      setInstagram(result.instagram)
      setNotice('Tersimpan. Aplikasi pelanggan langsung memakai data yang baru.')
    } catch (err) {
      const apiError = toApiError(err)
      const hasFieldErrors = Object.keys(apiError.fieldErrors).length > 0
      setErrors({
        outletName: apiError.errorFor('outletName'),
        whatsapp: apiError.errorFor('whatsapp'),
        instagram: apiError.errorFor('instagram'),
      })
      setSubmitError(hasFieldErrors ? null : apiError.message)
    } finally {
      setSaving(false)
    }
  }, [instagram, outletName, saving, setSavedCache, whatsapp])

  const touch = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setNotice(null)
  }

  return {
    saved,
    outletName,
    whatsapp,
    instagram,
    setOutletName: touch(setOutletName),
    setWhatsapp: touch(setWhatsapp),
    setInstagram: touch(setInstagram),
    loading: query.isLoading,
    loadError: query.error,
    reload,
    saving,
    errors,
    submitError,
    notice,
    dirty,
    save,
  }
}