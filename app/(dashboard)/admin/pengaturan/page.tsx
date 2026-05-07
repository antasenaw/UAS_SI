'use client'

import { useState } from 'react'
import { Save, AlertCircle, CheckCircle2, Settings, Database, Shield, Bell, Palette } from 'lucide-react'

export default function AdminPengaturanPage() {
  const [activeTab, setActiveTab] = useState<'umum' | 'keamanan' | 'notifikasi' | 'backup'>('umum')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const handleSave = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }, 1000)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Pengaturan Sistem</h1>
        <p className="text-gray-600">Kelola konfigurasi dan preferensi sistem</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {[
          { id: 'umum', label: 'Umum', icon: Settings },
          { id: 'keamanan', label: 'Keamanan', icon: Shield },
          { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
          { id: 'backup', label: 'Backup & Sync', icon: Database },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as 'umum' | 'keamanan' | 'notifikasi' | 'backup')}
            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* UMUM Tab */}
        {activeTab === 'umum' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Pengaturan Umum Sistem</h2>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Nama Institusi</label>
              <input
                type="text"
                defaultValue="SMA Negeri 1 Jakarta"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Email Institusi</label>
                <input
                  type="email"
                  defaultValue="admin@sman1jkt.sch.id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  defaultValue="(021) 1234-5678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Alamat</label>
              <textarea
                defaultValue="Jl. Diponegoro No. 45, Jakarta Pusat 10130"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Website</label>
                <input
                  type="url"
                  defaultValue="https://sman1jkt.sch.id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">NPSN</label>
                <input
                  type="text"
                  defaultValue="20105007"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Zona Waktu</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Asia/Jakarta (UTC+7)</option>
                  <option>Asia/Bangkok (UTC+7)</option>
                  <option>Asia/Singapore (UTC+8)</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-black mb-3">Tampilan Sistem</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Aktifkan mode gelap otomatis</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Tampilkan portofolio kelas</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Aktifkan notifikasi desktop</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* KEAMANAN Tab */}
        {activeTab === 'keamanan' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Pengaturan Keamanan</h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-yellow-900">Perhatian Keamanan</p>
                  <p className="text-yellow-800 text-sm mt-1">
                    Ubah pengaturan keamanan dengan hati-hati. Pengaturan salah dapat membatasi akses pengguna.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-black mb-3">Kebijakan Password</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Panjang minimum password"
                    defaultValue="8"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Hari berlaku password"
                    defaultValue="90"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Wajib kombinasi huruf, angka, dan simbol</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Aktifkan autentikasi dua faktor (2FA)</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-black mb-3">Pencatatan (Logging)</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Catat semua aktivitas login</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Catat perubahan data master</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Catat input & perubahan nilai</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-black mb-3">Akses IP</h3>
              <p className="text-gray-600 text-sm mb-2">Batasi akses dari IP tertentu (opsional)</p>
              <textarea
                placeholder="Masukkan IP yang diizinkan, satu per baris (cth: 192.168.1.1)"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* NOTIFIKASI Tab */}
        {activeTab === 'notifikasi' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Pengaturan Notifikasi</h2>

            <div>
              <h3 className="text-sm font-bold text-black mb-3">Email Notifikasi</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Notifikasi login baru</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Laporan harian aktivitas</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Peringatan penyimpanan disk</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Notifikasi error sistem</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-black mb-3">Notifikasi Pengguna</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Notifikasi ketika ada nilai baru</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Notifikasi tugas/pekerjaan baru</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-700">Notifikasi pengumuman</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Email untuk Notifikasi Sistem</label>
              <input
                type="email"
                defaultValue="admin@sman1jkt.sch.id"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* BACKUP & SYNC Tab */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Backup & Sinkronisasi</h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-bold text-blue-900">Informasi Database</p>
              <p className="text-blue-800 text-sm mt-2">Terakhir dibackup: 25 Jan 2025, 23:55 WIB</p>
              <p className="text-blue-800 text-sm">Ukuran database: 2.4 GB</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-black mb-3">Backup Otomatis</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Aktifkan backup otomatis</span>
                </label>
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Jadwal Backup</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Setiap hari pukul 00:00</option>
                      <option>Setiap hari pukul 02:00</option>
                      <option>Setiap Minggu Minggu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Penyimpanan Backup</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Server Lokal</option>
                      <option>Cloud Storage</option>
                      <option>Eksternal HDD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-black mb-3">Backup Manual</h3>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                Backup Sekarang
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-black mb-3">Sinkronisasi dengan Sistem Lain</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-700">Sinkron dengan Dapodik</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-700">Sinkron dengan LTMPT</span>
                </label>
              </div>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Sinkronisasi Sekarang
              </button>
            </div>
          </div>
        )}

        {/* Save Status */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          {saveStatus !== 'idle' && (
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                saveStatus === 'success' ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              {saveStatus === 'success' && <CheckCircle2 size={18} />}
              {saveStatus === 'saving' && <div className="animate-spin">⚙️</div>}
              <span>
                {saveStatus === 'success'
                  ? 'Pengaturan berhasil disimpan'
                  : saveStatus === 'saving'
                    ? 'Menyimpan...'
                    : ''}
              </span>
            </div>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Save size={18} />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  )
}
