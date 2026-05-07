'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/topbar'

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Ambil data user dari context/session
  const currentUser = {
    name: 'Budi Santoso',
    role: 'guru' as const,
    image: undefined,
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="guru" />
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
