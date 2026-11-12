import { useState } from 'react'

export function usePage() {
  const [page, setPage] = useState(1)
  return { page, setPage }
}
