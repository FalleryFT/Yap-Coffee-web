import { adminJobTitle } from '@/data/dummy'
import type { AdminUser } from '@/types/auth'

export function SidebarProfile({ profile }: { profile: AdminUser | null }) {
  return (
    <div className="mx-4 mb-4 flex items-center gap-3 border-b border-line px-2 pb-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-espresso text-sm font-semibold text-white">
        {profile ? profile.name.charAt(0).toUpperCase() : ''}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold text-espresso">
          {profile ? profile.name : 'Memuat...'}
        </p>
        <p className="truncate text-xs text-mocha">{adminJobTitle}</p>
      </div>
    </div>
  )
}
