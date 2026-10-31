import type { Order, OrderKloter, PickupPoint } from '@/types/orders'

const kloter: OrderKloter = {
  name: 'Kloter Siang Kampus',
  date: '2024-10-24',
  hours: '11.00 - 14.00',
}

const pickup: PickupPoint = {
  name: 'Gedung Sipil UB – Gazebo Tengah Lantai 1',
  detail: 'Drop Box Gazebo Tengah Lantai 1',
  area: 'Area Kampus Universitas Brawijaya',
  mapsQuery: 'Gazebo Sipil UB, Malang',
  route:
    'Masuk via Gerbang Veteran UB, lurus ke arah Gedung FT Sipil, gazebo tepat di taman tengah lantai 1 samping kantin.',
}

export const seed: Order[] = [
  {
    id: '1042',
    code: '#ORD-1042',
    date: '2024-10-24',
    time: '12:10 WIB',
    name: 'Dimas Aryasatya',
    phone: '+62 812-8921-9921',
    items: [
      { qty: 2, name: 'Es Kopi Susu Tetangga', price: 48000, mods: ['+ Oatmilk Sub (x2)', 'Less Sweet (50%)'] },
      { qty: 1, name: 'Cinnamon Roll', price: 20000, mods: [] },
    ],
    window: '12:30 - 12:45',
    kloter,
    pickup,
    total: 68000,
    pay: 'QRIS Lunas',
    status: 'Siap Ambil',
  },
  {
    id: '1043',
    code: '#ORD-1043',
    date: '2024-10-24',
    time: '12:15 WIB',
    name: 'Nadia Saraswati',
    phone: '+62 878-1120-4491',
    items: [
      { qty: 1, name: 'Pandan Latte Dingin', price: 28000, mods: ['+ Double Shot (+Rp 6k)', 'Normal Sweet'] },
      { qty: 1, name: 'Butter Croissant', price: 20000, mods: [] },
    ],
    window: '12:45 - 13:00',
    kloter,
    pickup,
    note: 'Croissant tolong dipisah dari minuman.',
    total: 54000,
    pay: 'QRIS Lunas',
    status: 'Diproses',
  },
  {
    id: '1044',
    code: '#ORD-1044',
    date: '2024-10-24',
    time: '12:22 WIB',
    name: 'Fahri Alamsyah',
    phone: '+62 856-7819-2039',
    items: [
      { qty: 4, name: 'Es Kopi Susu Tetangga', price: 80000, mods: ['Regular Creamer', 'Normal 100% Sugar'] },
      { qty: 2, name: 'Risoles Rogout', price: 32000, mods: [] },
    ],
    window: '13:00 - 13:15',
    kloter,
    pickup,
    total: 112000,
    pay: 'QRIS Lunas',
    status: 'Baru Masuk',
  },
  {
    id: '1041',
    code: '#ORD-1041',
    date: '2024-10-24',
    time: '11:45 WIB',
    name: 'Siti Rahma',
    phone: '+62 813-9002-1822',
    items: [{ qty: 1, name: 'Cold Brew Classic 250ml', price: 35000, mods: ['Cold Bottled'] }],
    window: '12:00 - 12:15',
    kloter,
    pickup,
    total: 35000,
    pay: 'Tunai Terbayar',
    status: 'Selesai',
  },
]