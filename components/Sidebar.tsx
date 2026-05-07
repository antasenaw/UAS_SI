'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  BookOpen,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  Award,
  CheckSquare,
} from 'lucide-react'

interface SidebarProps {
  role: 'siswa' | 'guru' | 'admin'
}

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ size: number; className: string }>
  section: string
}

const menuConfig: Record<string, MenuItem[]> = {
  siswa: [
    {
      name: 'Beranda',
      href: '/siswa',
      icon: Home,
      section: 'main',
    },
    {
      name: 'Mata Pelajaran',
      href: '/siswa/mapel',
      icon: BookOpen,
      section: 'main',
    },
    {
      name: 'Tugas & Pekerjaan',
      href: '/siswa/pekerjaan',
      icon: ClipboardList,
      section: 'main',
    },
    {
      name: 'Analisa Nilai',
      href: '/siswa/analisa',
      icon: BarChart3,
      section: 'main',
    },
    {
      name: 'Pengaturan',
      href: '/siswa/pengaturan',
      icon: Settings,
      section: 'settings',
    },
  ],
  guru: [
    {
      name: 'Beranda',
      href: '/guru',
      icon: Home,
      section: 'main',
    },
    {
      name: 'Kelas yang Diajar',
      href: '/guru/kelas',
      icon: GraduationCap,
      section: 'main',
    },
    {
      name: 'Wali Kelas',
      href: '/guru/wali-kelas',
      icon: Users,
      section: 'main',
    },
    {
      name: 'Analisa',
      href: '/guru/analisa',
      icon: BarChart3,
      section: 'main',
    },
    {
      name: 'Pengaturan',
      href: '/guru/pengaturan',
      icon: Settings,
      section: 'settings',
    },
  ],
  admin: [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      section: 'main',
    },
    {
      name: 'Manajemen User',
      href: '/admin/user',
      icon: Users,
      section: 'main',
    },
    {
      name: 'Manajemen Kelas',
      href: '/admin/kelas',
      icon: GraduationCap,
      section: 'main',
    },
    {
      name: 'Mata Pelajaran',
      href: '/admin/mata-pelajaran',
      icon: BookOpen,
      section: 'main',
    },
    {
      name: 'Periode Akademik',
      href: '/admin/periode',
      icon: Award,
      section: 'main',
    },
    {
      name: 'Pengaturan Sistem',
      href: '/admin/pengaturan',
      icon: Settings,
      section: 'settings',
    },
  ],
}

const roleColors: Record<string, { bgGradient: string; textColor: string; accentColor: string }> = {
  siswa: {
    bgGradient: 'from-blue-50 to-blue-100',
    textColor: 'text-blue-600',
    accentColor: 'bg-blue-600',
  },
  guru: {
    bgGradient: 'from-green-50 to-green-100',
    textColor: 'text-green-600',
    accentColor: 'bg-green-600',
  },
  admin: {
    bgGradient: 'from-indigo-50 to-indigo-100',
    textColor: 'text-indigo-600',
    accentColor: 'bg-indigo-600',
  },
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const menu = menuConfig[role] || []
  const colors = roleColors[role] || roleColors.siswa

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/login')
  }

  const mainMenu = menu.filter((item) => item.section === 'main')
  const settingsMenu = menu.filter((item) => item.section === 'settings')

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className={`bg-gradient-to-r ${colors.bgGradient} p-6 border-b border-gray-200`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-lg ${colors.accentColor} flex items-center justify-center`}>
            <GraduationCap className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-black">SIAKAD</h1>
        </div>
        <p className="text-xs text-gray-600">Sistem Informasi Akademik</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {/* Main Menu */}
        {mainMenu.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                active
                  ? `${colors.accentColor} text-white font-semibold`
                  : `text-gray-700 hover:bg-gray-100`
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}

        {/* Separator */}
        {settingsMenu.length > 0 && (
          <div className="my-4 border-t border-gray-200"></div>
        )}

        {/* Settings Menu */}
        {settingsMenu.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                active
                  ? `${colors.accentColor} text-white font-semibold`
                  : `text-gray-700 hover:bg-gray-100`
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  )
}