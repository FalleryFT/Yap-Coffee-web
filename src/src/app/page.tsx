import { redirect } from 'next/navigation'

// Tidak ada tampilan untuk "/" itu sendiri — selalu diarahkan ke /dashboard,
// yang lalu diperiksa oleh guard auth di app/(admin)/layout.tsx.
export default function RootPage() {
  redirect('/dashboard')
}
