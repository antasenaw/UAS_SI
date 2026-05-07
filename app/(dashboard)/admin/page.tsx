'use client'

import { useMemo } from 'react'
import { useSearch } from '@/app/providers'
import { Users, BookOpen, Layers, Calendar, TrendingUp, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const dataGrafikSiswa = [
  { kelas: 'X IPA', jumlah: 95 },
  { kelas: 'X IPS', jumlah: 88 },
  { kelas: 'XI IPA', jumlah: 102 },
  { kelas: 'XI IPS', jumlah: 96 },
  { kelas: 'XII IPA', jumlah: 122 },
  { kelas: 'XII IPS', jumlah: 108 },
]

const dataPerkembanganNilai = [
  { bulan: 'Januari', rata: 72 },
  { bulan: 'Februari', rata: 74 },
  { bulan: 'Maret', rata: 76 },
  { bulan: 'April', rata: 75 },
  { bulan: 'Mei', rata: 78 },
  { bulan: 'Juni', rata: 80 },
]

export default function AdminDashboard() {
  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  const filteredGrafikSiswa = useMemo(
    () =>
      dataGrafikSiswa.filter((item) =>
        item.kelas.toLowerCase().includes(normalizedSearch)
      ),
    [normalizedSearch]
  )

  const filteredPerkembanganNilai = useMemo(
    () =>
      dataPerkembanganNilai.filter((item) =>
        item.bulan.toLowerCase().includes(normalizedSearch)
      ),
    [normalizedSearch]
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard Admin</h1>
        <p className="text-gray-600">
          {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Ringkasan statistik sistem informasi akademik'}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Siswa</p>
              <p className="text-2xl font-bold text-black mt-2">611</p>
            </div>
            <Users size={32} className="text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Guru</p>
              <p className="text-2xl font-bold text-black mt-2">48</p>
            </div>
            <BookOpen size={32} className="text-green-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Kelas</p>
              <p className="text-2xl font-bold text-black mt-2">18</p>
            </div>
            <Layers size={32} className="text-purple-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Mata Pelajaran</p>
              <p className="text-2xl font-bold text-black mt-2">24</p>
            </div>
            <Calendar size={32} className="text-yellow-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rata-rata Nilai</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">76.8</p>
            </div>
            <TrendingUp size={32} className="text-indigo-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Kehadiran</p>
              <p className="text-2xl font-bold text-green-600 mt-2">94.2%</p>
            </div>
            <Activity size={32} className="text-red-100" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Distribusi Siswa */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Distribusi Siswa per Kelas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredGrafikSiswa}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="kelas" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Perkembangan Nilai */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Perkembangan Rata-rata Nilai</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredPerkembanganNilai}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rata"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Info Box */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Periode Akademik Aktif</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Tahun Ajaran</span>
              <span className="font-bold text-black">2025/2026</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Semester</span>
              <span className="font-bold text-black">Genap</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Status</span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Update Terbaru */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Update Terbaru Sistem</h2>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
              <p className="text-sm font-medium text-gray-700">Backup Data Automatik</p>
              <p className="text-xs text-gray-600 mt-1">Jumat, 28 Februari 2026 23:00</p>
            </div>
            <div className="p-3 border-l-4 border-green-500 bg-green-50">
              <p className="text-sm font-medium text-gray-700">Sinkronisasi LDAP Server</p>
              <p className="text-xs text-gray-600 mt-1">Jumat, 28 Februari 2026 18:30</p>
            </div>
            <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
              <p className="text-sm font-medium text-gray-700">Update Nilai Sudah Selesai</p>
              <p className="text-xs text-gray-600 mt-1">Jumat, 28 Februari 2026 15:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
