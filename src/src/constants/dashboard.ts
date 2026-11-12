import type { AvatarTone, HintTone, OrderStatus } from '@/types/admin'
import type { StatusConfig } from '@/types/dashboard'

// pill color untuk dropdown
export const pill: Record<OrderStatus, string> = {
  menunggu: 'bg-peach text-mocha',
  meramu:   'bg-honey text-mocha',
  siap_ambil: 'bg-[#e8ecd8] text-olive',
  selesai:  'bg-sand text-bark',
}

// Satu tempat untuk tampilan tiap status; klik dropdown memajukan status ke `next`.
export const statusConfig: Record<OrderStatus, StatusConfig> = {
  menunggu: {
    label: 'Menunggu',
    badge: 'bg-danger-soft text-danger',
    dot: 'bg-danger',
    next: 'meramu',
  },
  meramu: {
    label: 'Meramu',
    badge: 'bg-honey text-mocha',
    dot: 'bg-mocha',
    next: 'siap_ambil',
  },
  siap_ambil: {
    label: 'Siap Ambil',
    badge: 'bg-sand text-bark',
    dot: 'bg-olive',
    next: 'selesai',
  },
  selesai: {
    label: 'Selesai',
    badge: 'bg-sand text-mist',
    dot: 'bg-mist',
  },
}

export const avatarTone: Record<AvatarTone, string> = {
  peach: 'bg-peach text-mocha',
  sage: 'bg-[#e3e8cf] text-olive',
  gray: 'bg-sand text-bark',
}

export const hintTone: Record<HintTone, string> = {
  danger: 'text-danger',
  olive: 'text-olive',
  muted: 'text-mist',
}

export const flow: OrderStatus[] = ['menunggu', 'meramu', 'siap_ambil', 'selesai']

export const headCell =
  'px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-bark uppercase'
