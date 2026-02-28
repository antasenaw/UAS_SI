'use client'

import Link from 'next/link'
import Topbar from '@/components/topbar'
import { ArrowLeft } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ScoreData {
  nama: string
  score: number
  deadline: string
}

interface AverageData {
  bulan: string
  rataRata: number
}

interface MataPelajaranScore {
  nama: string
  nilai: number
}

const dummyScoreData: ScoreData[] = [
  { nama: 'Tugas 1', score: 85, deadline: 'Jan' },
  { nama: 'Tugas 2', score: 90, deadline: 'Feb' },
  { nama: 'Tugas 3', score: 78, deadline: 'Mar' },
  { nama: 'Tugas 4', score: 92, deadline: 'Apr' },
  { nama: 'Tugas 5', score: 88, deadline: 'May' },
  { nama: 'Tugas 6', score: 95, deadline: 'Jun' },
]

const dummyAverageData: AverageData[] = [
  { bulan: 'Jan', rataRata: 85 },
  { bulan: 'Feb', rataRata: 87 },
  { bulan: 'Mar', rataRata: 82 },
  { bulan: 'Apr', rataRata: 89 },
  { bulan: 'May', rataRata: 88 },
  { bulan: 'Jun', rataRata: 91 },
]

const dummyMataPelajaranScore: MataPelajaranScore[] = [
  { nama: 'Matematika', nilai: 88 },
  { nama: 'Fisika', nilai: 85 },
  { nama: 'Bahasa Indonesia', nilai: 92 },
  { nama: 'Kimia', nilai: 80 },
  { nama: 'Biologi', nilai: 87 },
  { nama: 'Sejarah', nilai: 90 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

function calculateAverageScore(data: ScoreData[]): number {
  const total = data.reduce((sum, item) => sum + item.score, 0)
  return Math.round(total / data.length)
}

export default function AnalisaPage() {
  const averageScore = calculateAverageScore(dummyScoreData)
  const maxScore = Math.max(...dummyScoreData.map((d) => d.score))
  const minScore = Math.min(...dummyScoreData.map((d) => d.score))

  return (
    <div className="flex flex-col h-screen">
      <Topbar />

      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Link
              href="/siswa"
              className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Kembali
            </Link>
            <h1 className="text-3xl font-semibold text-black">Analisa Nilai</h1>
            <p className="text-gray-600 text-sm mt-1">Laporan lengkap performa akademik Anda</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Rata-rata Nilai</h3>
              <p className="text-3xl font-bold text-blue-600">{averageScore}</p>
              <p className="text-xs text-gray-500 mt-2">Dari semua pekerjaan</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Nilai Tertinggi</h3>
              <p className="text-3xl font-bold text-green-600">{maxScore}</p>
              <p className="text-xs text-gray-500 mt-2">Prestasi terbaik</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Nilai Terendah</h3>
              <p className="text-3xl font-bold text-red-600">{minScore}</p>
              <p className="text-xs text-gray-500 mt-2">Area untuk ditingkatkan</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Pekerjaan</h3>
              <p className="text-3xl font-bold text-purple-600">{dummyScoreData.length}</p>
              <p className="text-xs text-gray-500 mt-2">Sudah dikerjakan</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Score Pengumpulan Tugas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Score Pengumpulan Tugas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dummyScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="deadline" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rata-rata Nilai per Bulan */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Rata-rata Nilai per Bulan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dummyAverageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rataRata"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Rata-rata"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Nilai per Mata Pelajaran - Bar Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Nilai per Mata Pelajaran</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dummyMataPelajaranScore}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nama" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="nilai" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribusi Nilai - Pie Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Distribusi Nilai per Mata Pelajaran</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dummyMataPelajaranScore}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nama, nilai }) => `${nama}: ${nilai}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="nilai"
                  >
                    {dummyMataPelajaranScore.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detail Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-black">Detail Pekerjaan</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pekerjaan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bulan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {dummyScoreData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.nama}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.deadline}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {item.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
