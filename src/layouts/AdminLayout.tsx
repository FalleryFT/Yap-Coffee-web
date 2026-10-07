import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'

// Sidebar di kiri; topbar dan isi halaman di kanan.
export default function AdminLayout() {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}