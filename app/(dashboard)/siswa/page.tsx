'use client'

import Link from "next/link"
import ProfileCard from "@/components/profileCard"
import Topbar from "@/components/topbar"
import { ArrowRight } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

interface SiswaProfile {
  nama: string
  nis: string
  kelas: string
  noAbsen: string
  tahunMasuk: string
  waliKelas: string
  fotoUrl?: string
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

// Data dummy mata pelajaran - lengkap
const allMataPelajaran: MataPelajaran[] = [
  { id: '1', nama: 'Matematika', guru: 'Ibu Siti', jam: '08:00-09:30' },
  { id: '2', nama: 'Fisika', guru: 'Pak Ahmad', jam: '09:45-11:15' },
  { id: '3', nama: 'Bahasa Indonesia', guru: 'Ibu Rina', jam: '13:00-14:30' },
  { id: '4', nama: 'Kimia', guru: 'Pak Budi', jam: '10:00-11:30' },
  { id: '5', nama: 'Biologi', guru: 'Ibu Maya', jam: '11:45-13:15' },
  { id: '6', nama: 'Sejarah', guru: 'Pak Doni', jam: '14:30-16:00' },
]

// Data dummy untuk score pengumpulan tugas
const dummyScoreData: ScoreData[] = [
  { nama: 'Tugas 1', score: 85, deadline: 'Jan' },
  { nama: 'Tugas 2', score: 90, deadline: 'Feb' },
  { nama: 'Tugas 3', score: 78, deadline: 'Mar' },
  { nama: 'Tugas 4', score: 92, deadline: 'Apr' },
  { nama: 'Tugas 5', score: 88, deadline: 'May' },
  { nama: 'Tugas 6', score: 95, deadline: 'Jun' },
]

// Data dummy untuk rata-rata nilai per bulan
const dummyAverageData: AverageData[] = [
  { bulan: 'Jan', rataRata: 85 },
  { bulan: 'Feb', rataRata: 87 },
  { bulan: 'Mar', rataRata: 82 },
  { bulan: 'Apr', rataRata: 89 },
  { bulan: 'May', rataRata: 88 },
  { bulan: 'Jun', rataRata: 91 },
]

// Data dummy pekerjaan - semua
const allTugas: Tugas[] = [
  {
    id: '1',
    namaPekerjaan: 'Soal Latihan Bab 5',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    mataKuliahId: '1',
    mataKuliah: 'Matematika',
    status: 'belum'
  },
  {
    id: '2',
    namaPekerjaan: 'Essay Kebebasan Pers',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    mataKuliahId: '3',
    mataKuliah: 'Bahasa Indonesia',
    status: 'proses'
  },
  {
    id: '3',
    namaPekerjaan: 'Laporan Praktik Fisika',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    mataKuliahId: '2',
    mataKuliah: 'Fisika',
    status: 'belum'
  },
  {
    id: '4',
    namaPekerjaan: 'Ulangan Harian Kimia',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    mataKuliahId: '4',
    mataKuliah: 'Kimia',
    status: 'belum'
  },
  {
    id: '5',
    namaPekerjaan: 'Presentasi Biologi',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    mataKuliahId: '5',
    mataKuliah: 'Biologi',
    status: 'proses'
  },
]

// Data dummy profil siswa
const dummySiswaProfile: SiswaProfile = {
  nama: 'Yogi Nugraha',
  nis: '247006111067',
  kelas: 'XII MIPA 4',
  noAbsen: '12',
  tahunMasuk: '2023/2024',
  waliKelas: 'Budi Santoso',
}

// Helper: Get random items from array
function getRandomItems<T>(items: T[], limit: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(limit, items.length))
}

function getUpcomingTugas(tugas: Tugas[], limit: number = 3): Tugas[] {
  return tugas
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, limit)
}

function formatDeadline(date: Date): string {
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Besok'
  if (diffDays < 0) return 'Terlambat'
  return `${diffDays} hari lagi`
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'belum':
      return 'bg-red-100 text-red-800'
    case 'proses':
      return 'bg-yellow-100 text-yellow-800'
    case 'selesai':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function calculateAverageScore(data: ScoreData[]): number {
  const total = data.reduce((sum, item) => sum + item.score, 0)
  return Math.round(total / data.length)
}

export default function SiswaDashboard() {
  const randomMataPelajaran = getRandomItems(allMataPelajaran, 3)
  const upcomingTugas = getUpcomingTugas(allTugas)
  const averageScore = calculateAverageScore(dummyScoreData)

  return (
    <div className="flex flex-col h-screen">
     

      <div className="grid grid-cols-4 gap-4 p-2 sm:p-4 flex-1 overflow-hidden">

        {/* KIRI - Main Content */}
        <div className="col-span-4 lg:col-span-3 space-y-2 overflow-y-auto pr-2">

          {/* Welcome Section */}
          <div className="bg-white text-black p-4 rounded-lg shadow border">
            <h1 className="text-xl sm:text-2xl font-semibold mb-1">
              Selamat Datang, {dummySiswaProfile.nama}
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">Jangan lupa mengerjakan pekerjaan tepat waktu!</p>
          </div>

          {/* Mata Pelajaran Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-black">Mata Pelajaran</h2>
            <Link
              href="/siswa/mapel"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mata Pelajaran Grid - Random 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
            {randomMataPelajaran.map((mp) => (
              <Link
                key={mp.id}
                href={`/siswa/mapel/${mp.id}`}
                className="bg-white px-4 py-9 gap-2 rounded-lg shadow border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
              >
                <h3 className="text-sm font-semibold mb-1">{mp.nama}</h3>
                <p className="text-xs text-gray-600 mb-1">Guru: {mp.guru}</p>
                <p className="text-xs text-gray-500">Jam: {mp.jam}</p>
              </Link>
            ))}
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
                <BarChart data={dummyScoreData}>
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
                <LineChart data={dummyAverageData}>
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
            nama={dummySiswaProfile.nama}
            nis={dummySiswaProfile.nis}
            kelas={dummySiswaProfile.kelas}
            noAbsen={dummySiswaProfile.noAbsen}
            tahunMasuk={dummySiswaProfile.tahunMasuk}
            waliKelas={dummySiswaProfile.waliKelas}
          />

          {/* Pekerjaan Mendatang Header */}
          <div className="flex items-center justify-between px-3">
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
              {upcomingTugas.map((pekerjaan) => (
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
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}