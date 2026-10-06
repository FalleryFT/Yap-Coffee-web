import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { tokenStorage } from './lib/tokenStorage'
import DashboardPage from './pages/DashboardPage'
import LoginAdminPage from './pages/LoginAdminPage'

function RequireAuth({ children }: { children: ReactElement }) {
  return tokenStorage.get() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginAdminPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
