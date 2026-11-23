import { describeDate, parseIsoDate } from '@/lib/format'

// Batas pesan berlaku H-1: tanggal cut-off = sehari sebelum tanggal pengambilan.
export function cutOffDateIso(pickupDateIso: string): string {
  const d = parseIsoDate(pickupDateIso)
  d.setDate(d.getDate() - 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function cutOffDateLabel(pickupDateIso: string): string {
  return describeDate(cutOffDateIso(pickupDateIso)).dateLong
}