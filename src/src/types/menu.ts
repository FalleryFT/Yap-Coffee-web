import type { MenuItem, MenuCategory } from '@/types/admin'

export type MenuFormMode = 'add' | 'edit'

export type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; item: MenuItem }
  | { type: 'delete'; item: MenuItem }
  | { type: 'category' }

export interface CategoryChip {
  value: MenuCategory | 'semua'
  label: string
  count: number
}
