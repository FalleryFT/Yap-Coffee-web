import { Clock, History, LayoutDashboard, Receipt, Utensils } from 'lucide-react'
import { pendingOrderCount } from '@/data/dummy'
import type { NavItem } from '@/types/nav'

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pre-Order', href: '/pre-order', icon: Clock },
  { label: 'Menu', href: '/menu', icon: Utensils },
  { label: 'Orders', href: '/orders', icon: Receipt, badge: pendingOrderCount },
  { label: 'History', href: '/history', icon: History },
]
