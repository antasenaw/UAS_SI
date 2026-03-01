'use client'

import { Save } from 'lucide-react'
import { useState } from 'react'

export default function GuruPengaturanPage() {
  const [formData, setFormData] = useState({
    nama: 'Ibu Siti Nurhaliza, S.Pd',
    email: 'siti.nurhaliza@email.com',
    telepon: '081234567890',
    alamat: 'Jl. Pendidikan No. 123, Jakarta',
    nip: '197503051998032001',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle submit
    console.log('Form submitted:', formData)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Pengaturan Akun</h1>
        <p className="text-gray-600">Kelola informasi profil dan pengaturan akun Anda</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Dasar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-black mb-6 border-b pb-4">
              Informasi Dasar
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  NIP
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Alamat
                </label>
                <textarea
                  rows={3}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Keamanan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-black mb-6 border-b pb-4">
              Keamanan
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Password Lama
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan password lama Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan password baru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Konfirmasi password baru"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Save size={18} />
              Simpan Perubahan
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
