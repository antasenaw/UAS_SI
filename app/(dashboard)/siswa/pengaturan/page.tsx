'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

export default function SiswaPengaturanPage() {
  const [formData, setFormData] = useState({
    nama: 'Muhammad Rizki',
    nis: '247006111067',
    kelas: 'XII MIPA 4',
    email: 'rizki.siswa@email.com',
    telepon: '081234567890',
    alamat: 'Jl. Merdeka No. 10, Jakarta',
  })
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }, 800)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Pengaturan Akun</h1>
        <p className="text-gray-600">Perbarui informasi profil dan preferensi akun Anda</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-black mb-6">Profil Siswa</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">NIS</label>
                <input
                  type="text"
                  value={formData.nis}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Kelas</label>
                <input
                  type="text"
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Alamat</label>
                <textarea
                  rows={3}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Save size={18} />
              Simpan Perubahan
            </button>
            {saveStatus === 'saving' && (
              <p className="text-sm text-gray-600">Menyimpan perubahan...</p>
            )}
            {saveStatus === 'success' && (
              <p className="text-sm text-green-600">Perubahan tersimpan.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
