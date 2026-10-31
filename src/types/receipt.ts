export type ReceiptLine = {
  label: string
  value: string
  extra?: number // biaya tambahan, mis. 8000
}

export type ReceiptItem = {
  qty: number
  name: string
  unitPrice: number
  lines: ReceiptLine[]
}

export type ReceiptData = {
  store: { name: string; branch: string; address: string; whatsapp: string }
  receiptNo: string
  preOrderNo: string
  transactionAt: string // "2024-10-24T09:15:00"
  customer: { name: string; phone: string }
  items: ReceiptItem[]
  baristaNote?: string
  subtotal: number
  packagingFee: number
  serviceFee: number
  total: number
  paymentStatus: string // "Lunas via QRIS"
  payment: {
    channel: string
    rrn: string
    pickupSlot: string
    handover: string
  }
}
