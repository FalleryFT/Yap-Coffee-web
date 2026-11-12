import { useCallback, useEffect, useState } from 'react'
import { emitSettingsChanged } from '@/lib/appEvents'
import { toApiError } from '@/lib/apiError'
import { getStoreSettings, updateStoreSettings } from '@/services/settingsService'
import type { StoreSettings } from '@/types/settings'

type FieldErrors = Partial<Record<'outletName' | 'whatsapp' | 'instagram', string>>

/** Nama outlet, WhatsApp, dan Instagram toko. */
export function useStoreSettings() {
  const [saved, setSaved] = useState<StoreSettings | null>(null)
  const [outletName, setOutletName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(null)
    getStoreSettings()
      .then((data) => {
        if (!active) return
        setSaved(data)
        setOutletName(data.outletName)
        setWhatsapp(data.whatsapp)
        setInstagram(data.instagram)
      })
      .catch((err) => active && setLoadError(toApiError(err).message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

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
      setSaved(result)
      setOutletName(result.outletName)
      setWhatsapp(result.whatsapp)
      setInstagram(result.instagram)
      setNotice('Tersimpan. Aplikasi pelanggan langsung memakai data yang baru.')
      emitSettingsChanged() // Topbar ikut memperbarui nama outlet
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
  }, [instagram, outletName, saving, whatsapp])

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
    loading,
    loadError,
    reload,
    saving,
    errors,
    submitError,
    notice,
    dirty,
    save,
  }
}
