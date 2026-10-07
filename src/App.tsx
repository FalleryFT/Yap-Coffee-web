import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import { tokenStorage } from './lib/tokenStorage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import LoginAdminPage from './pages/LoginAdminPage'
import PlaceholderPage from './pages/PlaceholderPage'
import PreOrderPage from './pages/PreOrderPage'
import MenuPage from './pages/MenuPage'


function RequireAuth({ children }: { children: ReactElement }) {
  return tokenStorage.get() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginAdminPage />} />
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pre-order" element={<PreOrderPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/orders" element={<PlaceholderPage title="Orders" />} />
        <Route path="/history" element={<PlaceholderPage title="History" />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}