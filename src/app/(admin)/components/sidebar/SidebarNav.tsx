import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from '@/constants/navItems'

export function SidebarNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-1 flex-col gap-1 px-4" aria-label="Menu utama">
      {navItems.map(({ label, href, icon: Icon, badge }) => {
        const isActive = pathname === href
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
                  'flex size-6 items-center justify-center rounded-full text-xs font-semibold',
                  isActive ? 'bg-white/20 text-white' : 'bg-mocha text-white',
                ].join(' ')}
              >
                {badge}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
