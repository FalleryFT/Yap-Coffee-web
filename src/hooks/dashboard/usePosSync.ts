import { useState } from 'react'
import { posSyncLabel } from '@/data/dummy'

export function usePosSync() {
  const [syncLabel, setSyncLabel] = useState(posSyncLabel)
  const resync = () => setSyncLabel('Update baru saja')
  return { syncLabel, resync }
}
