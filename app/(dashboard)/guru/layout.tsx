'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/topbar'
import { currentGuruProfile } from '@/lib/user/mockProfile'

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = currentGuruProfile

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="guru" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={currentUser.name}
          userRole="guru"
          userImage={currentUser.image}
        />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
