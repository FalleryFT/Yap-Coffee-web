import type { LucideIcon } from 'lucide-react'
import { Card } from './ui'

interface MiniStatProps {
  label: string
  icon: LucideIcon
  value: React.ReactNode
  footer: React.ReactNode
}

export function MiniStat({ label, icon: Icon, value, footer }: MiniStatProps) {
  return (
    <Card className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-bark">{label}</span>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sand text-espresso">
            <Icon size={17} />
          </span>
        </div>
        <div className="whitespace-nowrap text-[26px] font-bold leading-tight text-ink">{value}</div>
      </div>
      <div className="flex items-center gap-2 bg-sand px-5 py-2.5 text-[12px] text-bark">{footer}</div>
    </Card>
  )
}
