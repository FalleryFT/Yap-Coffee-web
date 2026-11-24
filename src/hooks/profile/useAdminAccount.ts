import { useCallback, useState } from 'react'
import { CACHE_KEYS } from '@/constants/cacheKeys'
import { useCachedQuery } from '@/hooks/useCachedQuery'
import { TTL } from '@/lib/cache'
import { toApiError } from '@/lib/apiError'
import { changeAdminPassword, getAdminProfile, updateAdminName } from '@/services/authService'

type PasswordErrors = Partial<Record<'current_password' | 'password' | 'password_confirmation', string>>

/** Mengganti nama dan kata sandi admin yang sedang masuk. */
export function useAdminAccount() {
  const query = useCachedQuery(CACHE_KEYS.adminProfile, getAdminProfile, { ttl: TTL.long })
  const admin = query.data ?? null

  const [name, setName] = useState('')
  const [filled, setFilled] = useState(false)
  const [nameSaving, setNameSaving] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [nameNotice, setNameNotice] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({})
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null)

  // Kolom nama diisi sekali saat data pertama tersedia; penyegaran di latar belakang tidak menimpanya.
  if (admin && !filled) {
    setFilled(true)
    setName(admin.name)
  }

  const { set: setAdminCache, reload } = query

  const nameDirty = admin !== null && name.trim() !== admin.name

  const saveName = useCallback(async () => {
    if (nameSaving) return
    setNameNotice(null)
    if (!name.trim()) {
      setNameError('Nama wajib diisi.')
      return
    }
    setNameError(null)
    setNameSaving(true)
    try {
      const user = await updateAdminName(name.trim())
      setAdminCache(user) // sidebar dan topbar memakai cache yang sama, jadi ikut berubah
      setName(user.name)
      setNameNotice('Nama berhasil diperbarui.')
    } catch (err) {
      const apiError = toApiError(err)
      setNameError(apiError.errorFor('name') ?? apiError.message)
    } finally {
      setNameSaving(false)
    }
  }, [name, nameSaving, setAdminCache])

  const savePassword = useCallback(async () => {
    if (passwordSaving) return
    setPasswordNotice(null)
    setPasswordError(null)

    const found: PasswordErrors = {}
    if (!currentPassword) found.current_password = 'Kata sandi saat ini wajib diisi.'
    if (newPassword.length < 8) found.password = 'Kata sandi baru minimal 8 karakter.'
    else if (newPassword.length > 72) found.password = 'Kata sandi baru maksimal 72 karakter.'
    if (confirmPassword !== newPassword) found.password_confirmation = 'Konfirmasi kata sandi tidak sama.'
    setPasswordErrors(found)
    if (Object.keys(found).length > 0) return

    setPasswordSaving(true)
    try {
      await changeAdminPassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordNotice('Kata sandi berhasil diubah. Gunakan yang baru saat masuk berikutnya.')
    } catch (err) {
      const apiError = toApiError(err)
      const hasFieldErrors = Object.keys(apiError.fieldErrors).length > 0
      setPasswordErrors({
        current_password: apiError.errorFor('current_password'),
        password: apiError.errorFor('password'),
        password_confirmation: apiError.errorFor('password_confirmation'),
      })
      setPasswordError(hasFieldErrors ? null : apiError.message)
    } finally {
      setPasswordSaving(false)
    }
  }, [confirmPassword, currentPassword, newPassword, passwordSaving])

  return {
    admin,
    loading: query.isLoading,
    loadError: query.error,
    reload,
    name,
    setName: (value: string) => {
      setName(value)
      setNameNotice(null)
      setNameError(null)
    },
    nameSaving,
    nameError,
    nameNotice,
    nameDirty,
    saveName,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordSaving,
    passwordErrors,
    passwordError,
    passwordNotice,
    savePassword,
  }
}