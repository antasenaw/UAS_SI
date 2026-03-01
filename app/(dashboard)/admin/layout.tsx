'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/topbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Ambil data user dari context/session
  const currentUser = {
    name: 'Admin Sekolah',
    role: 'admin' as const,
    // image: '/avatar-admin.jpg',
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={currentUser.name}
          userRole={currentUser.role}
          userImage={currentUser.image}
        />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
