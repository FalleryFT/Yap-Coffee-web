import { MONTH_ABBR, MONTH_NAMES } from '@/constants/months'
import type { ReceiptData } from '@/types/receipt'

import type { HistoryRow } from '@/types/history'

export function shortDate(iso: string): string {
  const [y = '', m = '1', d = '1'] = iso.split('-')
  return `${Number(d)} ${MONTH_ABBR[Number(m) - 1]} ${y}`
}

export function toReceipt(r: HistoryRow): ReceiptData {
  const total = Number(r.total.replace(/\./g, ''))

  // "2x Americano + Croissant" -> dua item; tanpa angka di depan dianggap 1
  const parsed = r.item.split(' + ').map((part) => {
    const m = part.match(/^(\d+)x\s+(.*)$/)
    return { qty: m ? Number(m[1]) : 1, name: m ? (m[2] ?? part) : part }
  })
  const totalQty = parsed.reduce((sum, p) => sum + p.qty, 0)
  const unitPrice = total / totalQty // perkiraan: data riwayat belum punya harga per item

  const isQris = r.pay === 'QRIS Instan'

  return {
    store: {
      name: 'Yap Coffee',
      branch: 'Kaftek Area Kampus UB',
      address: 'Jl. MT Haryono No. 167, Dinoyo, Lowokwaru, Malang',
      whatsapp: '+62 812-8921-9921',
    },
    receiptNo: `STRUK-${r.date.replace(/-/g, '')}-${r.id}`,
    preOrderNo: `ORD-${r.id}`,
    transactionAt: `${r.date}T${r.time}:00`,
    customer: { name: r.name, phone: r.ph },
    items: parsed.map((p, i) => ({
      qty: p.qty,
      name: p.name,
      unitPrice,
      // kustomisasi ditaruh di item pertama
      lines: i === 0 ? r.mod.split(', ').map((value) => ({ label: 'Opsi', value })) : [],
    })),
    subtotal: total,
    packagingFee: 0,
    serviceFee: 0,
    total,
    paymentStatus: isQris ? 'Lunas via QRIS' : 'Lunas via Tunai',
    payment: {
      channel: r.pay,
      rrn: '-', // belum ada di data
      pickupSlot: `${r.spot} (08:30 - 10:00)`,
      handover: 'Selesai',
    },
  }
}

// value: 'YYYY-MM' atau 'semua'
export function formatMonthLabel(value: string, currentValue: string): string {
  if (value === 'semua') return 'Semua Bulan'
  const [year = '', month = '1'] = value.split('-')
  const label = `${MONTH_NAMES[Number(month) - 1]} ${year}`
  return value === currentValue ? `Bulan Ini - ${label}` : label
}
