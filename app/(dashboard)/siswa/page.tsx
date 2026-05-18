'use client'

import Link from "next/link"
import ProfileCard from "@/components/profileCard"
import { useSearch } from '@/app/providers'

import { ArrowRight } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from "react"


interface MataPelajaran {
  id: string
  nama: string
  guru: string
  jam: string
}

interface Tugas {
  id: string
  namaPekerjaan: string
  deadline: Date
  mataKuliahId: string
  mataKuliah: string
  status: 'belum' | 'proses' | 'selesai'
}

interface ScoreData {
  nama: string
  score: number
  deadline: string
}

interface AverageData {
  bulan: string
  rataRata: number
}

// Helper: Get random items from array
function getRandomItems<T>(items: T[], limit: number): T[] {
  if (!items) return []
  const shuffled = [...items].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(limit, items.length))
}

function getUpcomingTugas(tugas: Tugas[], limit: number = 3): Tugas[] {
  if (!tugas) return []
  return [...tugas]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, limit)
}

function formatDeadline(date: any): string {
  const d = new Date(date)
  const today = new Date()
  const diffTime = d.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Besok'
  if (diffDays < 0) return 'Terlambat'
  return `${diffDays} hari lagi`
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'belum':
    case 'Missing':
      return 'bg-red-100 text-red-800'
    case 'proses':
    case 'Submitted':
      return 'bg-yellow-100 text-yellow-800'
    case 'selesai':
    case 'Reviewed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function SiswaDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const siswaProfile = dashboardData?.profile

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const res = await fetch("/api/siswa", {
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

  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchActive = normalizedSearch.length > 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const randomMataPelajaran = dashboardData?.subjects || []
  const upcomingTugas = dashboardData?.assignments || []
  const scoreData = dashboardData?.chartData?.scoreData || []
  const averageData = dashboardData?.chartData?.averageData || []

  const filteredMataPelajaran = (dashboardData?.subjects || []).filter((mp: any) => {
    return [mp.nama, mp.jam].some((value) =>
      value?.toLowerCase().includes(normalizedSearch)
    )
  })

  const filteredTugas = (dashboardData?.assignments || []).filter((tugas: any) => {
    return [tugas.namaPekerjaan, tugas.status]
      .some((value) => value?.toLowerCase().includes(normalizedSearch))
  })

  const mataPelajaranToShow = searchActive ? filteredMataPelajaran : randomMataPelajaran
  const tugasToShow = searchActive ? filteredTugas : upcomingTugas

  return (
    <div className="flex flex-col h-screen bg-gray-50">
     

      <div className="grid grid-cols-4 gap-4 p-2 sm:p-4 flex-1 overflow-hidden">

        {/* KIRI - Main Content */}
        <div className="col-span-4 lg:col-span-3 space-y-2 overflow-y-auto pr-2">

          {/* Welcome Section */}
          <div className="bg-white text-black p-4 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-xl sm:text-2xl font-semibold mb-1">
              Selamat Datang, {siswaProfile?.name}
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">Jangan lupa mengerjakan pekerjaan tepat waktu!</p>
          </div>

          {/* Mata Pelajaran Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-black">Mata Pelajaran</h2>
              {searchActive && (
                <p className="text-xs text-gray-500 mt-1">Menampilkan hasil pencarian untuk "{searchQuery}"</p>
              )}
            </div>
            <Link
              href="/siswa/mapel"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
            {mataPelajaranToShow.length > 0 ? (
              mataPelajaranToShow.map((mp: MataPelajaran) => (
                <Link
                  key={mp.id}
                  href={`/siswa/mapel/${mp.id}`}
                  className="bg-white px-4 py-9 gap-2 rounded-lg shadow border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <h3 className="text-sm font-semibold mb-1">{mp.nama}</h3>
                  <p className="text-xs text-gray-600 mb-1">Guru: {mp.guru}</p>
                  <p className="text-xs text-gray-500">Jam: {mp.jam}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-lg shadow border border-gray-200 p-6 text-center text-sm text-gray-600">
                Tidak ada mata pelajaran yang cocok dengan kata kunci pencarian.
              </div>
            )}
          </div>

          {/* Analisa Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-black">Analisa Nilai</h2>
            <Link
              href="/siswa/analisa"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Chart Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Score Pengumpulan Tugas */}
            <div className="bg-white text-black p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-sm font-semibold mb-2">Score Pengumpulan Tugas</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="deadline" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rata-rata Nilai per Bulan */}
            <div className="bg-white text-black p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-sm font-semibold mb-2">Rata-rata Nilai per Bulan</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={averageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rataRata"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Rata-rata"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* KANAN - Sidebar */}
        <div className="col-span-4 lg:col-span-1 space-y-3 lg:self-start overflow-y-auto pr-2">
          {/* Profile Card */}
          <ProfileCard
            nama={siswaProfile?.name}
            nis={siswaProfile?.nis}
            kelas={siswaProfile?.kelas}
            noAbsen={siswaProfile?.noAbsen}
            tahunMasuk={siswaProfile?.tahunMasuk}
            waliKelas={siswaProfile?.waliKelas}
          />

          {/* Pekerjaan Mendatang Header */}
          <div className="flex items-center justify-between px-4 pt-2">
            <h3 className="font-semibold text-sm text-black">Pekerjaan Mendatang</h3>
            <Link
              href="/siswa/pekerjaan"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
            >
              Lihat Semua
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pekerjaan Mendatang */}
          <div className="bg-white text-black p-3 rounded-lg shadow">
            <div className="flex flex-col gap-2">
              {tugasToShow.length > 0 ? (
                tugasToShow.map((pekerjaan: Tugas) => (
                  <Link
                    key={pekerjaan.id}
                    href="/siswa/mapel/tugas"
                    className="bg-gray-50 p-3 rounded border border-gray-200 hover:shadow-sm hover:border-blue-300 transition-all"
                  >
                    <h4 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2">{pekerjaan.namaPekerjaan}</h4>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-1">{pekerjaan.mataKuliah}</p>
                    <div className="text-xs font-medium text-red-600">
                      {formatDeadline(pekerjaan.deadline)}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 text-center">
                  Tidak ada tugas yang cocok dengan kata kunci pencarian.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}