/** Kontak toko seperti yang diterima aplikasi pelanggan (GET /api/home → store). */
export interface StoreContactPreview {
  whatsapp: string // '+6281231242277'
  whatsappUrl: string // 'https://wa.me/6281231242277'
  instagram: string // 'https://www.instagram.com/yap_coffee_/'
  instagramHandle: string // '@yap_coffee_'
}

/** Respons GET dan PUT /admin/settings. */
export interface StoreSettings {
  outletName: string
  whatsapp: string // bentuk lokal untuk form, contoh '081231242277'
  instagram: string // tautan profil
  preview: StoreContactPreview
}

export interface StoreSettingsPayload {
  outletName: string
  whatsapp: string
  instagram: string
}

/** Ukuran gelas yang dipilih pelanggan, contoh Reguler (16 oz) atau Large (22 oz, +5.000). */
export interface SizeOption {
  label: string
  detail: string
  extraPrice: number
  isDefault: boolean
}

export interface SugarOption {
  label: string
  isDefault: boolean
}

/** Respons GET dan PUT /admin/settings/options. */
export interface MenuOptions {
  sizes: SizeOption[]
  sugarLevels: SugarOption[]
}
