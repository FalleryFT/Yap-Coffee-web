import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from '@/constants/navItems'
import { usePendingOrderCount } from '@/hooks/orders/usePendingOrderCount'

export function SidebarNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const pendingOrders = usePendingOrderCount()

  return (
    <nav className="flex flex-1 flex-col gap-1 px-4" aria-label="Menu utama">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href
        // Badge Orders = jumlah pesanan Baru Masuk dari server; disembunyikan bila 0.
        const badge = href === '/orders' ? (pendingOrders ?? 0) : 0
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={[
              'flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium transition-colors',
              isActive ? 'bg-espresso text-white' : 'text-bark hover:bg-espresso/5',
            ].join(' ')}
          >
            <Icon size={18} strokeWidth={1.75} />
            <span className="flex-1">{label}</span>
            {badge ? (
              <span
                className={[
                  'flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                  isActive ? 'bg-white/20 text-white' : 'bg-mocha text-white',
                ].join(' ')}
              >
                {badge > 99 ? '99+' : badge}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
