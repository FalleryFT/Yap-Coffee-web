// Kunci cache. Awalan ('orders:', 'dashboard:', 'history:') dipakai untuk invalidateCache.
export const CACHE_KEYS = {
  adminProfile: 'admin:profile',
  storeSettings: 'outlet:settings',
  menuItems: 'menu:items',
  menuCategories: 'menu:categories',
  schedules: 'schedules',
  orderStats: 'orders:stats',
  ordersList: (id: string) => `orders:list:${id}`,
  dashboard: (search: string) => `dashboard:${search}`,
  historyList: (id: string) => `history:list:${id}`,
  historyStats: (month: string) => `history:stats:${month}`,
  historyRevenue: (month: string) => `history:revenue:${month}`,
} as const