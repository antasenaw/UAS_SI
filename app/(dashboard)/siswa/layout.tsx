'use client'

import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/topbar'
import { useAuth } from '@/lib/auth/context'

export default function SiswaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const currentUser = {
    name: user?.name || 'User',
    image: '/src/logo.png'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="siswa" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={currentUser.name}
          userRole="siswa"
          userImage={currentUser.image}
        />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
