'use client'

import React, { useState } from 'react'
import { useSearch } from '@/app/providers'
import { IUser } from '@/models/User'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'

const AdminUserClient = ({usersList: initialUsers}: {usersList: IUser[]}) => {
  const [usersList, setUsersList] = useState<IUser[]>(initialUsers)
  const [filterRole, setFilterRole] = useState<'all' | 'Siswa' | 'Guru' | 'Admin'>('all')
  const { searchQuery } = useSearch()
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState<Partial<IUser>>({})
  const [loading, setLoading] = useState(false)

  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  const refreshData = async () => {
    const res = await fetch('/api/user')
    const data = await res.json()
    if (data.success) setUsersList(data.data)
  }

  const handleOpenAdd = () => {
    setCurrentUser({ role: 'Siswa', status: 'Aktif' })
    setIsEditing(false)
    setShowModal(true)
  }

  const handleOpenEdit = (user: IUser) => {
    setCurrentUser(user)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return
    try {
      const res = await fetch(`/api/user?id=${id}`, { method: 'DELETE' })
      if (res.ok) refreshData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = isEditing ? `/api/user?id=${currentUser._id}` : '/api/user'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser)
      })
      if (res.ok) {
        setShowModal(false)
        refreshData()
      } else {
        const errorData = await res.json()
        alert(errorData.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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
      case 'Siswa': return 'bg-blue-50 text-blue-700'
      case 'Guru': return 'bg-green-50 text-green-700'
      case 'Admin': return 'bg-purple-50 text-purple-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
          onClick={handleOpenAdd}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No. Induk</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Peran</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
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
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(String(user._id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-gray-600">{searchActive ? 'Tidak ada user yang sesuai' : 'Belum ada user'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit User' : 'Tambah User Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  value={currentUser.name || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={currentUser.email || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Induk (NIS/NIP)</label>
                <input
                  required
                  type="text"
                  value={currentUser.noInduk || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, noInduk: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                />
              </div>
              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    required
                    type="password"
                    onChange={(e) => setCurrentUser({ ...currentUser, password_hash: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
                  <select
                    value={currentUser.role || 'Siswa'}
                    onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  >
                    <option value="Siswa">Siswa</option>
                    <option value="Guru">Guru</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={currentUser.status || 'Aktif'}
                    onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserClient