import { Clock, History, LayoutDashboard, Receipt, Settings, Utensils } from 'lucide-react'
import type { NavItem } from '@/types/nav'

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pre-Order', href: '/pre-order', icon: Clock },
  { label: 'Menu', href: '/menu', icon: Utensils },
  { label: 'Orders', href: '/orders', icon: Receipt },
  { label: 'History', href: '/history', icon: History },
  { label: 'Pengaturan', href: '/settings', icon: Settings },
]
