'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { currentAdminProfile } from '@/lib/user/mockProfile'

export default function AdminPengaturanPage() {
  const [formData, setFormData] = useState({
    nama: currentAdminProfile.name,
    nip: currentAdminProfile.nip,
    posisi: currentAdminProfile.posisi,
    email: currentAdminProfile.email,
    telepon: currentAdminProfile.telepon,
    alamat: currentAdminProfile.alamat,
  })
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    app: true,
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
        <h1 className="text-3xl font-bold text-black mb-2">Pengaturan Akun & Notifikasi</h1>
        <p className="text-gray-600">Kelola informasi profil admin dan pengaturan sistem.</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-black mb-6">Profil Administrator</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">NIP</label>
                <input
                  type="text"
                  value={formData.nip}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Posisi</label>
                <input
                  type="text"
                  value={formData.posisi}
                  onChange={(e) => setFormData({ ...formData, posisi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Alamat</label>
                <textarea
                  rows={3}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-black mb-6">Pengaturan Notifikasi</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-black">Notifikasi Email</p>
                  <p className="text-xs text-gray-500">Dapatkan pemberitahuan melalui email.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.email}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, email: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-black">Notifikasi SMS</p>
                  <p className="text-xs text-gray-500">Terima ringkasan lewat pesan singkat.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.sms}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, sms: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-black">Notifikasi Aplikasi</p>
                  <p className="text-xs text-gray-500">Dapatkan update langsung di dashboard.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.app}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, app: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              <Save size={18} />
              Simpan Perubahan
            </button>
            {saveStatus === 'saving' && (
              <p className="text-sm text-gray-600">Menyimpan perubahan...</p>
            )}
            {saveStatus === 'success' && (
              <p className="text-sm text-indigo-600">Perubahan tersimpan.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
