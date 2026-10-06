import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toApiError } from '../lib/apiError'
import { tokenStorage } from '../lib/tokenStorage'
import { getAdminProfile } from '../services/authService'
import type { AdminUser } from '../types/auth'

// Halaman sementara untuk membuktikan bahwa token terkirim otomatis oleh interceptor.
export default function DashboardPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<AdminUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getAdminProfile()
      .then((user) => active && setProfile(user))
      .catch((err) => active && setError(toApiError(err).message))
    return () => {
      active = false
    }
  }, [])

  function logout() {
    tokenStorage.clear()
    navigate('/login', { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-espresso">Dashboard</h1>
      {error && <p className="text-sm text-danger">{error}</p>}
      {profile ? (
        <p>
          Halo, <strong className="text-espresso">{profile.name}</strong> ({profile.role})
        </p>
      ) : (
        !error && <p>Memuat profil...</p>
      )}
      <button
        onClick={logout}
        className="mx-auto h-11 rounded-lg bg-espresso px-6 font-semibold text-white hover:bg-espresso/90"
      >
        Keluar
      </button>
    </main>
  )
}
