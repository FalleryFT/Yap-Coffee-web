import { ChevronDown } from 'lucide-react'
import { inputCls } from '@/constants/menu'
import type { MenuCategory } from '@/types/admin'

interface Props {
  value: MenuCategory
  options: MenuCategory[]
  onChange: (value: MenuCategory) => void
}

export function CategorySelect({ value, options, onChange }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={options.length === 0}
        aria-label="Kategori menu"
        className={`${inputCls} appearance-none pr-8`}
      >
        {value === '' && options.length > 0 && (
          <option value="" disabled>
            Pilih kategori
          </option>
        )}
        {options.length === 0 && <option value="">Belum ada kategori</option>}
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-bark" />
    </div>
  )
}
