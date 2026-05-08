'use client'

import React, { useState } from 'react'
import { useSearch } from '@/app/providers'
import { IUser } from '@/models/User'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'

const AdminUserClient = ({usersList}: {usersList: IUser[]}) => {
  const [filterRole, setFilterRole] = useState<'all' | 'Siswa' | 'Guru' | 'Admin'>('all')
  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  const filteredUsers = usersList.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch)
    const matchRole = filterRole === 'all' || user.role === filterRole
    return matchSearch && matchRole
  })

  const usersToShow = searchActive ? filteredUsers : usersList.filter(u => filterRole === 'all' || u.role === filterRole)

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Siswa':
        return 'bg-blue-50 text-blue-700'
      case 'Guru':
        return 'bg-green-50 text-green-700'
      case 'Admin':
        return 'bg-purple-50 text-purple-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'Aktif'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Manajemen User</h1>
          <p className="text-gray-600">
            {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Kelola data pengguna sistem (Siswa, Guru, Admin)'}
          </p>
        </div>
        <button 
          onClick={() => alert('Fitur tambah user sedang dikembangkan. Silakan hubungi administrator.')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          <Plus size={20} />
          Tambah User Baru
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Filter Peran
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as "Siswa" | "Guru" | "Admin" | "all")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Peran</option>
              <option value="Siswa">Siswa</option>
              <option value="Guru">Guru</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600">Gunakan search di topbar untuk mencari user</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  No. Induk
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Peran
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {usersToShow.length > 0 ? (
                usersToShow.map((user) => (
                <tr key={String(user._id)} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-black">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{user.noInduk}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        user.status
                      )}`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-600 text-lg">
                        {searchActive ? 'Tidak ada user yang sesuai dengan pencarian' : 'Belum ada user'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {filteredUsers.length} dari {usersList.length} data
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Sebelumnya
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminUserClient