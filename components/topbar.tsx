'use client'

import { useState } from 'react'
import { Bell, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface TopbarProps {
  userName?: string
  userRole?: 'siswa' | 'guru' | 'admin'
  userImage?: string
  onLogout?: () => void
}

export default function Topbar({
  userName = 'User',
  userRole = 'siswa',
  userImage,
  onLogout,
}: TopbarProps) {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const roleColors: Record<string, string> = {
    siswa: 'bg-blue-50 text-blue-700',
    guru: 'bg-green-50 text-green-700',
    admin: 'bg-indigo-50 text-indigo-700',
  }

  const notifications = [
    {
      id: 1,
      title: 'Nilai Baru',
      message: 'Nilai Matematika telah diupdate',
      time: '10 menit lalu',
      read: false,
    },
    {
      id: 2,
      title: 'Tugas Baru',
      message: 'Tugas Bahasa Indonesia deadline besok',
      time: '1 jam lalu',
      read: false,
    },
    {
      id: 3,
      title: 'Pengumuman',
      message: 'Pengumuman penting dari kepala sekolah',
      time: '3 jam lalu',
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between gap-6">
        {/* Search Bar */}
        <div className="flex-1 max-w">
          <div className="flex items-center gap-2 px-4  py-3 rounded-full border border-gray-300 bg-gray-50 hover:bg-white transition-colors">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari materi, tugas, nilai..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent outline-none text-black text-sm w-full placeholder-gray-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-bold text-black text-sm">Notifikasi</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${!notif.read ? 'text-blue-600' : 'text-black'}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Lihat Semua
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt="User"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{userName.charAt(0)}</span>
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-black">{userName}</p>
                  <p className={`text-xs px-2 py-0.5 rounded capitalize ${roleColors[userRole]}`}>
                    {userRole === 'siswa' && 'Siswa'}
                    {userRole === 'guru' && 'Guru'}
                    {userRole === 'admin' && 'Admin'}
                  </p>
                </div>
              </div>
              <ChevronDown size={16} className="text-gray-600" />
            </button>

            {/* User Menu Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-black">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userRole === 'siswa' && 'Siswa'}
                    {userRole === 'guru' && 'Guru'}
                    {userRole === 'admin' && 'Administrator'}
                  </p>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50">
                    <User size={16} />
                    Profil Saya
                  </button>
                  <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings size={16} />
                    Pengaturan
                  </button>
                </div>
                <div className="border-t border-gray-200 p-2">
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}