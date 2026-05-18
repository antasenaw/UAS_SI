'use client'

import GuruProfileCard from '@/components/guruProfileCard'
import { useMemo, useState, useEffect } from 'react'
import { useSearch } from '@/app/providers'
import { currentGuruProfile } from '@/lib/user/mockProfile'
import { BookOpen, Users, TrendingUp, AlertCircle } from 'lucide-react'

interface KelasSummary {
  id: string
  nama: string
  jumlahSiswa: number
  topikTerbaru: string
}

interface SiswaAnalisa {
  id: string
  nama: string
  kelas: string
  rataRataNilai: number
  status: 'baik' | 'cukup' | 'kurang'
}

export default function GuruBeranda() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const res = await fetch("/api/guru/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.success) {
          setDashboardData(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const kelasToShow = useMemo(
    () =>
      (dashboardData?.classes || []).filter((kelas: any) =>
        [kelas.nama, kelas.topikTerbaru]
          .some((value) => value.toLowerCase().includes(normalizedSearch))
      ),
    [normalizedSearch, dashboardData]
  )

  const siswaToShow = useMemo(
    () =>
      (dashboardData?.siswaAnalisa || []).filter((siswa: any) =>
        [siswa.nama, siswa.kelas, siswa.status]
          .some((value) => value.toString().toLowerCase().includes(normalizedSearch))
      ),
    [normalizedSearch, dashboardData]
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'baik':
        return 'bg-green-50 text-green-700'
      case 'cukup':
        return 'bg-yellow-50 text-yellow-700'
      case 'kurang':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const guruProfile = dashboardData?.profile

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Selamat Datang, {guruProfile?.name}</h1>
        <p className="text-gray-600">
          {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Kelola kelas dan pantau perkembangan siswa Anda'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Right Column - Profile Card */}
        <div className="col-span-1">
          <GuruProfileCard
            nama={guruProfile?.name}
            nip={guruProfile?.nip}
            kelasWali={dashboardData?.waliKelasClassName || "-"}
            mataPelajaran={[guruProfile?.bidangStudi]}
          />
        </div>

        {/* Left & Center Column */}
        <div className="col-span-3 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Kelas</p>
                  <p className="text-3xl font-bold text-black mt-2">{dashboardData?.stats?.totalKelas}</p>
                </div>
                <BookOpen size={40} className="text-blue-100" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Siswa</p>
                  <p className="text-3xl font-bold text-black mt-2">{dashboardData?.stats?.totalSiswa}</p>
                </div>
                <Users size={40} className="text-blue-100" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Rata-rata Nilai</p>
                  <p className="text-3xl font-bold text-black mt-2">{dashboardData?.stats?.rataRataNilai}</p>
                </div>
                <TrendingUp size={40} className="text-blue-100" />
              </div>
            </div>
          </div>

          {/* Kelas Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Kelas yang Anda Ajar</h2>
            <div className="grid grid-cols-2 gap-4">
              {kelasToShow.length > 0 ? (
                kelasToShow.map((kelas) => (
                  <div
                    key={kelas.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-black">{kelas.nama}</h3>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {kelas.jumlahSiswa} siswa
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{kelas.topikTerbaru}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 text-gray-600">
                  Tidak ada kelas sesuai pencarian.
                </div>
              )}
            </div>
          </div>

          {/* Analisa Siswa Wali Kelas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Analisa Siswa Kelas Wali ({dashboardData?.waliKelasClassName || "Bukan Wali Kelas"})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-semibold text-gray-600">Nama Siswa</th>
                    <th className="text-center py-3 font-semibold text-gray-600">Nilai Rata-rata</th>
                    <th className="text-center py-3 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {siswaToShow.length > 0 ? (
                  siswaToShow.map((siswa) => (
                    <tr key={siswa.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-medium text-black">{siswa.nama}</td>
                      <td className="py-3 text-center">
                        <span className="font-semibold text-black">{siswa.rataRataNilai}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            siswa.status
                          )}`}
                        >
                          {siswa.status === 'baik' && 'Baik'}
                          {siswa.status === 'cukup' && 'Cukup'}
                          {siswa.status === 'kurang' && 'Perlu Perhatian'}
                        </span>
                      </td>
                    </tr>
                  ))) : (
                    <tr>
                      <td colSpan={3} className="py-16 text-center text-gray-600">
                        Tidak ada data siswa sesuai pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
