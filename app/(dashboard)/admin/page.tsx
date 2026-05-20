'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSearch } from '@/app/providers'
import { Users, BookOpen, Layers, Calendar, TrendingUp, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setError(null)
        const res = await fetch("/api/admin/dashboard")
        const data = await res.json()
        if (!res.ok || !data.success) {
          setError(data.error || 'Gagal memuat statistik dashboard')
          setDashboardData(null)
        } else {
          setDashboardData(data)
        }
      } catch (err: any) {
        console.error(err)
        setError(err?.message || 'Terjadi kesalahan saat memuat dashboard')
        setDashboardData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const filteredGrafikSiswa = useMemo(
    () =>
      (dashboardData?.distribution || []).filter((item: any) =>
        item.kelas.toLowerCase().includes(normalizedSearch)
      ),
    [normalizedSearch, dashboardData]
  )

  const filteredPerkembanganNilai = useMemo(
    () =>
      (dashboardData?.progress || []).filter((item: any) =>
        item.bulan.toLowerCase().includes(normalizedSearch)
      ),
    [normalizedSearch, dashboardData]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stats = dashboardData?.stats

  if (!dashboardData && error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md border border-red-100 p-8">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Dashboard tidak dapat dimuat</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Periksa koneksi database atau jalankan ulang server.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
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
              <p className="text-2xl font-bold text-black mt-2">{stats?.totalSiswa ?? '-'}</p>
            </div>
            <Users size={32} className="text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Guru</p>
              <p className="text-2xl font-bold text-black mt-2">{stats?.totalGuru ?? '-'}</p>
            </div>
            <BookOpen size={32} className="text-green-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Kelas</p>
              <p className="text-2xl font-bold text-black mt-2">{stats?.totalKelas ?? '-'}</p>
            </div>
            <Layers size={32} className="text-purple-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Mata Pelajaran</p>
              <p className="text-2xl font-bold text-black mt-2">{stats?.totalMapel ?? '-'}</p>
            </div>
            <Calendar size={32} className="text-yellow-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rata-rata Nilai</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{stats?.rataRataNilai ?? '-'}</p>
            </div>
            <TrendingUp size={32} className="text-indigo-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Kehadiran</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{stats?.kehadiran != null ? `${stats.kehadiran}%` : '-'}</p>
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
              <span className="font-bold text-black">{dashboardData?.activePeriod?.tahunAjaran || "2024/2025"}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Semester</span>
              <span className="font-bold text-black">{dashboardData?.activePeriod?.semester || "Ganjil"}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Status</span>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${dashboardData?.activePeriod?.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {dashboardData?.activePeriod?.status || "Aktif"}
              </span>
            </div>
          </div>
        </div>

        {/* Update Terbaru */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Update Terbaru Sistem</h2>
          <div className="space-y-3">
            {dashboardData?.recentActivities?.map((activity: any, i: number) => (
              <div key={i} className={`p-3 border-l-4 ${activity.type === 'submission' ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50'}`}>
                <p className="text-sm font-medium text-gray-700">{activity.title}</p>
                <p className="text-xs text-gray-600 mt-1">{activity.user} • {activity.time}</p>
              </div>
            ))}
            {(!dashboardData?.recentActivities || dashboardData.recentActivities.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada aktivitas terbaru</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
