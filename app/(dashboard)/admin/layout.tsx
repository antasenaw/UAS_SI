'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/topbar'
import { currentAdminProfile } from '@/lib/user/mockProfile'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = currentAdminProfile

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={currentUser.name}
          userRole="admin"
          userImage={currentUser.image}
        />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
