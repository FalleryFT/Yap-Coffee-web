import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { tokenStorage } from './lib/tokenStorage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import LoginAdminPage from './pages/LoginAdminPage'
import MenuPage from './pages/MenuPage'
import OrdersPage from './pages/OrdersPage'
import PreOrderPage from './pages/PreOrderPage'

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
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pre-order" element={<PreOrderPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
