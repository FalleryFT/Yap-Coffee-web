import { useCallback, useEffect, useRef, useState } from 'react'
import { toApiError } from '@/lib/apiError'
import { getMenuOptions, updateMenuOptions } from '@/services/settingsService'
import type { MenuOptions } from '@/types/settings'

export const MAX_OPTIONS = 6

// Baris di layar: harga disimpan sebagai teks supaya kolom boleh dikosongkan saat mengetik.
export interface SizeRow {
  key: number
  label: string
  detail: string
  extraPrice: string
  isDefault: boolean
}

export interface SugarRow {
  key: number
  label: string
  isDefault: boolean
}

/** Ukuran gelas dan tingkat manis yang dipilih pelanggan di aplikasi. */
export function useMenuOptions() {
  const nextKey = useRef(1)
  const [sizes, setSizes] = useState<SizeRow[]>([])
  const [sugars, setSugars] = useState<SugarRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [dirty, setDirty] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const apply = useCallback((options: MenuOptions) => {
    setSizes(
      options.sizes.map((s) => ({
        key: nextKey.current++,
        label: s.label,
        detail: s.detail,
        extraPrice: String(s.extraPrice),
        isDefault: s.isDefault,
      })),
    )
    setSugars(options.sugarLevels.map((s) => ({ key: nextKey.current++, label: s.label, isDefault: s.isDefault })))
    setDirty(false)
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(null)
    getMenuOptions()
      .then((options) => active && apply(options))
      .catch((err) => active && setLoadError(toApiError(err).message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [apply, reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  const change = () => {
    setDirty(true)
    setNotice(null)
    setError(null)
  }

  const updateSize = (key: number, patch: Partial<SizeRow>) => {
    setSizes((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)))
    change()
  }
  const setDefaultSize = (key: number) => {
    setSizes((rows) => rows.map((r) => ({ ...r, isDefault: r.key === key })))
    change()
  }
  const addSize = () => {
    setSizes((rows) =>
      rows.length >= MAX_OPTIONS
        ? rows
        : [...rows, { key: nextKey.current++, label: '', detail: '', extraPrice: '0', isDefault: false }],
    )
    change()
  }
  const removeSize = (key: number) => {
    setSizes((rows) => {
      const left = rows.filter((r) => r.key !== key)
      // Bila yang bawaan dihapus, yang pertama menjadi bawaan.
      return left.length > 0 && !left.some((r) => r.isDefault) ? left.map((r, i) => ({ ...r, isDefault: i === 0 })) : left
    })
    change()
  }

  const updateSugar = (key: number, label: string) => {
    setSugars((rows) => rows.map((r) => (r.key === key ? { ...r, label } : r)))
    change()
  }
  const setDefaultSugar = (key: number) => {
    setSugars((rows) => rows.map((r) => ({ ...r, isDefault: r.key === key })))
    change()
  }
  const addSugar = () => {
    setSugars((rows) =>
      rows.length >= MAX_OPTIONS ? rows : [...rows, { key: nextKey.current++, label: '', isDefault: false }],
    )
    change()
  }
  const removeSugar = (key: number) => {
    setSugars((rows) => {
      const left = rows.filter((r) => r.key !== key)
      return left.length > 0 && !left.some((r) => r.isDefault) ? left.map((r, i) => ({ ...r, isDefault: i === 0 })) : left
    })
    change()
  }

  const save = useCallback(async () => {
    if (saving) return
    setNotice(null)

    const hasDuplicate = (labels: string[]) => new Set(labels.map((l) => l.trim().toLowerCase())).size !== labels.length
    if (sizes.length === 0) return setError('Minimal satu ukuran.')
    if (sugars.length === 0) return setError('Minimal satu tingkat manis.')
    if (sizes.some((s) => !s.label.trim())) return setError('Nama ukuran tidak boleh kosong.')
    if (sugars.some((s) => !s.label.trim())) return setError('Nama tingkat manis tidak boleh kosong.')
    if (sizes.some((s) => !/^\d+$/.test(s.extraPrice.trim()))) {
      return setError('Tambahan harga ukuran harus berupa angka bulat (isi 0 bila tanpa tambahan).')
    }
    if (hasDuplicate(sizes.map((s) => s.label))) return setError('Nama ukuran tidak boleh kembar.')
    if (hasDuplicate(sugars.map((s) => s.label))) return setError('Nama tingkat manis tidak boleh kembar.')

    setError(null)
    setSaving(true)
    try {
      const result = await updateMenuOptions({
        sizes: sizes.map((s) => ({
          label: s.label.trim(),
          detail: s.detail.trim(),
          extraPrice: Number(s.extraPrice),
          isDefault: s.isDefault,
        })),
        sugarLevels: sugars.map((s) => ({ label: s.label.trim(), isDefault: s.isDefault })),
      })
      apply(result)
      setNotice('Tersimpan. Pilihan baru langsung tampil di aplikasi pelanggan.')
    } catch (err) {
      const apiError = toApiError(err)
      setError(Object.values(apiError.fieldErrors)[0]?.[0] ?? apiError.message)
    } finally {
      setSaving(false)
    }
  }, [apply, saving, sizes, sugars])

  return {
    sizes,
    sugars,
    loading,
    loadError,
    reload,
    dirty,
    saving,
    error,
    notice,
    save,
    updateSize,
    setDefaultSize,
    addSize,
    removeSize,
    updateSugar,
    setDefaultSugar,
    addSugar,
    removeSugar,
  }
}
