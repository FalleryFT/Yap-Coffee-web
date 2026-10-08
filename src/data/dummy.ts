// Data dummy untuk tampilan admin. Nanti diganti data dari API.
import type { DashboardOrder, MenuItem, PreOrderSchedule, TopMenuItem } from '../types/admin'

// ---------- Umum (sidebar & topbar) ----------

// Jabatan belum ada di backend (/admin/me hanya mengirim name, username, role).
export const adminJobTitle = 'Head Barista / Admin'

export const outlet = {
  name: 'Warung Senopati (Outlet 01)',
  isOpen: true,
  hours: '07:00 - 22:00',
}

export const today = 'Kamis, 24 Oktober 2024'

// Lencana di menu Orders
export const pendingOrderCount = 4

// ---------- Dashboard ----------

export const shift = { label: 'Shift Pagi', hours: '07:00 - 15:30' }
export const posSyncLabel = 'Update 12 dtk lalu'

export const newOrderAlert = {
  count: 3,
  pickupTime: '09:30 WIB',
  customers: ['Bu Dian', 'Pak Hendra', 'Rayhan'],
}

export const todaySummary = {
  totalOrders: 42,
  trendPercent: 14,
  readyForPickup: 15,
  completed: 27,
  onTimePercent: 100,
  revenue: 1042000,
  averagePerOrder: 24800,
}

export const preOrderSchedules: PreOrderSchedule[] = [
  {
    id: 1,
    name: 'Kloter Pagi Kampus',
    date: '2024-10-25',
    location: 'Gedung Sipil UB',
    locationDetail: 'Drop Box Gazebo Tengah Lantai 1',
    pickupTime: '08:30 - 11:30 WIB',
    cutOff: '07:00 WIB',
    cutOffUrgent: true,
    status: 'aktif',
  },
  {
    id: 2,
    name: 'Kloter Senja Perumahan',
    date: '2024-10-25',
    location: 'Komplek Asri Bintaro',
    locationDetail: 'Pos Satpam Utama Blok C-10',
    pickupTime: '16:00 - 18:30 WIB',
    cutOff: '14:00 WIB',
    cutOffUrgent: false,
    status: 'aktif',
  },
  {
    id: 3,
    name: 'Kloter Weekend Belajar',
    date: '2024-10-26',
    location: 'Kantin Fakultas Hukum',
    locationDetail: 'Area Meja Kayu Nomor 14-16',
    pickupTime: '09:00 - 12:00 WIB',
    cutOff: '25 Okt 21:00 WIB',
    cutOffUrgent: false,
    status: 'mendatang',
  },
  {
    id: 4,
    name: 'Kloter Monday Booster',
    date: '2024-10-28',
    location: 'Kantor Bappeda Wil. 2',
    locationDetail: 'Lobi Gedung Resepsionis',
    pickupTime: '07:45 - 09:30 WIB',
    cutOff: '27 Okt 20:00 WIB',
    cutOffUrgent: false,
    status: 'mendatang',
  },
  {
    id: 5,
    name: 'Kloter Siang Kantor Pusat',
    date: '2024-10-29',
    location: 'Gedung Graha Utama Lt. 3',
    locationDetail: 'Ruang Rapat 3A – Meja Resepsionis',
    pickupTime: '11:30 - 13:00 WIB',
    cutOff: '28 Okt 22:00 WIB',
    cutOffUrgent: false,
    status: 'mendatang',
  },
  {
    id: 6,
    name: 'Kloter Sore Komunitas',
    date: '2024-10-30',
    location: 'Taman Kota Blok M',
    locationDetail: 'Dekat Panggung Utama – Pintu Barat',
    pickupTime: '15:00 - 17:30 WIB',
    cutOff: '29 Okt 18:00 WIB',
    cutOffUrgent: false,
    status: 'mendatang',
  },
]

export const topMenuItems: TopMenuItem[] = [
  {
    id: 1,
    name: 'Es Kopi Susu Tetangga',
    description: 'Espresso + Gula Aren Murni',
    sold: 128,
    share: '46.7%',
    unit: 'cup',
  },
  {
    id: 2,
    name: 'Iced Americano',
    description: 'House Blend Arabica-Robusta',
    sold: 45,
    share: '16.4%',
    unit: 'cup',
  },
  {
    id: 3,
    name: 'Uji Matcha Latte',
    description: 'Non-Coffee Special',
    sold: 38,
    share: '13.8%',
    unit: 'cup',
  },
  {
    id: 4,
    name: 'Pisang Goreng',
    description: 'Camilan Tradisional',
    sold: 31,
    share: '11.3%',
    unit: 'porsi',
  },
]

export const topMenuContribution = '88.2%'

export const dashboardOrders: DashboardOrder[] = [
  {
    id: '#ORD-9021',
    time: '09:12 WIB',
    customerName: 'Bu Dian',
    customerInitials: 'DN',
    customerPhone: '0812-9811-XXXX',
    avatarTone: 'peach',
    items: '2x Es Kopi Susu Tetangga',
    notes: 'Less Sugar (50%), Oatmilk',
    pickupTime: '09:30 WIB',
    pickupHint: '(18 mnt lagi)',
    pickupHintTone: 'danger',
    status: 'menunggu',
  },
  {
    id: '#ORD-9020',
    time: '09:05 WIB',
    customerName: 'Pak Hendra',
    customerInitials: 'HN',
    customerPhone: '0818-4421-XXXX',
    avatarTone: 'peach',
    items: '1x Americano Hot, 1x Croissant',
    notes: 'Beans: Flores Bajawa Single Origin',
    pickupTime: '09:30 WIB',
    pickupHint: 'Slot Reguler',
    pickupHintTone: 'muted',
    status: 'meramu',
  },
  {
    id: '#ORD-9018',
    time: '08:52 WIB',
    customerName: 'Rayhan Malik',
    customerInitials: 'RY',
    customerPhone: '0857-1100-XXXX',
    avatarTone: 'sage',
    items: '3x Kopi Susu Aren Literan',
    notes: 'Botol 1000ml • Dingin',
    pickupTime: '09:15 WIB',
    pickupHint: 'Customer Tiba',
    pickupHintTone: 'olive',
    status: 'siap_ambil',
  },
  {
    id: '#ORD-9016',
    time: '08:30 WIB',
    customerName: 'Siti Nurhaliza',
    customerInitials: 'SN',
    customerPhone: '0813-2299-XXXX',
    avatarTone: 'gray',
    items: '1x Matcha Latte Oat',
    notes: 'Normal Sweetness',
    pickupTime: '08:45 WIB',
    pickupHint: 'Selesai 08:42',
    pickupHintTone: 'muted',
    status: 'selesai',
  },
]

// ---------- Menu & Stok Harian ----------

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Es Kopi Susu Gula Aren',
    description: 'Double shot house blend robusta-arabika dipadu susu segar lokal dan gula aren organik.',
    category: 'Kopi Susu',
    price: 20000,
    stock: 24,
    addons: ['Less Sugar', 'Oat Milk +5k', 'Extra Shot +4k'],
  },
  {
    id: 2,
    name: 'V60 Gayo Winey Process',
    description: 'Arabika Aceh Gayo fermentasi anaerobik 48 jam. Tasting notes: anggur merah, floral.',
    category: 'Manual Brew',
    price: 28000,
    stock: 3,
    addons: ['Hot / Ice', 'Japanese Drip +2k'],
  },
  {
    id: 3,
    name: 'Kerinci Honey Process V60',
    description: 'Arabika Kerinci proses honey. Tasting notes: madu, jeruk mandarin, body ringan.',
    category: 'Manual Brew',
    price: 30000,
    stock: 3,
    addons: ['Hot / Ice', 'Japanese Drip +2k'],
  },
  {
    id: 4,
    name: 'Pisang Goreng Madu Wijen',
    description: 'Pisang raja pilihan digoreng karamel madu hutan dengan taburan wijen sangrai.',
    category: 'Makanan Ringan',
    price: 18000,
    stock: 15,
    addons: ['Keju Parut +4k', 'Dip Saus Karamel +3k'],
  },
  {
    id: 5,
    name: 'Croissant Almond Panggang',
    description: 'Pastry renyah mentega Prancis berisi pasta almond manis dan taburan almond slice.',
    category: 'Makanan Ringan',
    price: 24000,
    stock: 0,
    addons: ['Warm Up / Hangatkan'],
  },
  {
    id: 6,
    name: 'Kopi Susu Pandan Wangi',
    description: 'Ekstrak daun suji pandan wangi asli disatukan dengan racikan espresso dan susu segar.',
    category: 'Kopi Susu',
    price: 22000,
    stock: 19,
    addons: ['Less Sweet', 'Extra Shot +4k', 'Grass Jelly +3k'],
  },
  {
    id: 7,
    name: 'Uji Matcha Latte',
    description: 'Matcha Uji ceremonial grade whisk manual dengan susu segar, manis seimbang.',
    category: 'Non-Coffee',
    price: 26000,
    stock: 12,
    addons: ['Oat Milk +5k', 'Less Sugar'],
  },
  {
    id: 8,
    name: 'Cold Brew Tetangga 250ml',
    description: 'Seduh dingin 18 jam house blend, botol kaca 250ml siap bawa pulang.',
    category: 'Kopi Susu',
    price: 35000,
    stock: 0,
    addons: ['Cold Bottled'],
  },
]