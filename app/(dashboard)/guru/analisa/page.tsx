'use client'

import { useEffect, useState } from 'react'
import { useSearch } from '@/app/providers'
import { useAuth } from '@/lib/auth/context'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'

interface ClassAnalysisData {
  classData: {
    id: string
    namaKelas: string
    jurusan: string
    angkatan: string
    totalSiswa: number
  }
  classAnalysis: {
    totalStudents: number
    averageGrade: number
    excellentCount: number
    goodCount: number
    fairCount: number
    poorCount: number
    excellentPercentage: number
    goodPercentage: number
    fairPercentage: number
    poorPercentage: number
    studentsNeedingAttention: Array<{
      studentId: string
      studentName: string
      averageGrade: number
      classification: string
      color: string
      recommendations: string[]
      priority: 'high' | 'medium' | 'low'
      actions: Array<{
        id: string
        title: string
        description: string
        type: string
      }>
    }>
    classRecommendations: string[]
  }
}

interface AnalysisData {
  nama: string
  nilai: number
}

interface DistribusiNilai {
  nama: string
  value: number
  percentage: number
  color: string
}

export default function GuruAnalisaPage() {
  const { user } = useAuth()
  const { searchQuery } = useSearch()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<ClassAnalysisData | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('authToken')
        
        // Fetch analysis for the guru's wali kelas (first/primary class)
        const response = await fetch(`/api/guru/dss/kelas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch analysis data')
        }

        const result = await response.json()
        setAnalysisData(result.data)
      } catch (err) {
        console.error('Error fetching analysis:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [user])

  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Memproses data analisis...</p>
        </div>
      </div>
    )
  }

  if (error || !analysisData) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error || 'Data analisis tidak ditemukan'}</p>
        </div>
      </div>
    )
  }

  const classData = analysisData.classData
  const analysis = analysisData.classAnalysis

  // Create bar chart data from recommendation data
  const barChartData = analysis.studentsNeedingAttention
    .map((s) => ({
      nama: s.studentName.split(' ').slice(-1)[0], // Last name for brevity
      nilai: s.averageGrade,
    }))
    .slice(0, 10)

  const distributionData: DistribusiNilai[] = [
    {
      nama: 'Sangat Baik (85-100)',
      value: analysis.excellentCount,
      percentage: analysis.excellentPercentage,
      color: '#10b981',
    },
    {
      nama: 'Baik (75-84)',
      value: analysis.goodCount,
      percentage: analysis.goodPercentage,
      color: '#3b82f6',
    },
    {
      nama: 'Cukup (65-74)',
      value: analysis.fairCount,
      percentage: analysis.fairPercentage,
      color: '#f59e0b',
    },
    {
      nama: 'Kurang (<65)',
      value: analysis.poorCount,
      percentage: analysis.poorPercentage,
      color: '#ef4444',
    },
  ].filter((d) => d.value > 0)

  const filteredStudents = analysisData.classAnalysis.studentsNeedingAttention.filter((item) =>
    item.studentName.toLowerCase().includes(normalizedSearch)
  )
  const studentsToShow = searchActive ? filteredStudents : analysisData.classAnalysis.studentsNeedingAttention
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Analisa {classData.namaKelas}</h1>
        <p className="text-gray-600">
          {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Laporan analisis kemajuan siswa dalam kelas yang Anda dampingi'}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Total Siswa</p>
          <p className="text-3xl font-bold text-black mt-2">{classData.totalSiswa}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Rata-rata Nilai</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{analysis.averageGrade.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Nilai Tertinggi</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {Math.max(...analysisData.classAnalysis.studentsNeedingAttention.map((s) => s.averageGrade), 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Nilai Terendah</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {Math.min(...analysisData.classAnalysis.studentsNeedingAttention.map((s) => s.averageGrade), 0)}
          </p>
        </div>
      </div>

      {/* DSS Recommendations - Class Level */}
      {analysis.classRecommendations.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Rekomendasi Sistem Pendukung Keputusan</h2>
          <ul className="space-y-2">
            {analysis.classRecommendations.map((rec, idx) => (
              <li key={idx} className="text-blue-800 flex items-start">
                <span className="mr-3 text-lg">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Nilai Siswa */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Grafik Nilai Siswa (Top 10)</h2>
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nama" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="nilai" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-600">
              Tidak ada data siswa untuk ditampilkan
            </div>
          )}
        </div>

        {/* Pie Chart - Distribusi Nilai */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Distribusi Nilai</h2>
          {distributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nama, percentage }: any) => `${nama}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-600">
              Tidak ada data untuk ditampilkan
            </div>
          )}
        </div>
      </div>

      {/* Students Needing Attention */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-black mb-4">
          Siswa yang Memerlukan Perhatian ({studentsToShow.length})
        </h2>
        {studentsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentsToShow.map((student) => (
              <div
                key={student.studentId}
                className="bg-white rounded-lg shadow-md p-6 border-l-4"
                style={{ borderColor: student.color }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-black">{student.studentName}</h3>
                    <p className="text-sm text-gray-600">
                      Rata-rata: <span className="font-semibold" style={{ color: student.color }}>
                        {student.averageGrade} ({student.classification})
                      </span>
                    </p>
                  </div>
                  {student.priority === 'high' && (
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      ⚠️ Urgent
                    </span>
                  )}
                  {student.priority === 'medium' && (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      ⚡ Perhatian
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Rekomendasi:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {student.recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {student.actions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Tindakan Rekomendasi:</p>
                    <div className="space-y-2">
                      {student.actions.slice(0, 2).map((action) => (
                        <div
                          key={action.id}
                          className="bg-gray-50 p-2 rounded text-xs border-l-2 border-gray-300"
                        >
                          <p className="font-medium text-gray-800">{action.title}</p>
                          <p className="text-gray-600">{action.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Link
                    href={`/guru/wali-kelas`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 text-center transition"
                  >
                    Lihat Detail Siswa
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-700">
            <p className="font-semibold">✓ Semua Siswa Berkinerja Baik</p>
            <p className="text-sm">Tidak ada siswa yang memerlukan perhatian khusus pada saat ini.</p>
          </div>
        )}
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">Detail Nilai Siswa</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Siswa</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Rata-rata Nilai</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Klasifikasi</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Prioritas</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.classAnalysis.studentsNeedingAttention.length > 0 ? (
                analysisData.classAnalysis.studentsNeedingAttention.map((student, idx) => (
                  <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-black">{student.studentName}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded font-semibold">
                        {student.averageGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="inline-block px-3 py-1 rounded font-semibold text-white"
                        style={{ backgroundColor: student.color }}
                      >
                        {student.classification}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          student.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : student.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {student.priority === 'high'
                          ? '⚠️ Urgent'
                          : student.priority === 'medium'
                            ? '⚡ Perhatian'
                            : '✓ Baik'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-600">
                    Tidak ada data siswa untuk ditampilkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
