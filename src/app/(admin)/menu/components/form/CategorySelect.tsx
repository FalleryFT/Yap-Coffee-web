import { ChevronDown } from 'lucide-react'
import { menuCategories, inputCls } from '@/constants/menu'
import type { MenuCategory } from '@/types/admin'

interface Props {
  value: MenuCategory
  onChange: (value: MenuCategory) => void
}

export function CategorySelect({ value, onChange }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as MenuCategory)}
        className={`${inputCls} appearance-none pr-8`}
      >
        {menuCategories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-bark" />
    </div>
  )
}
