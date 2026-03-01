'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

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

const dataAnalisis: AnalysisData[] = [
  { nama: 'Ahmad Rizki', nilai: 85 },
  { nama: 'Siti Rahayu', nilai: 78 },
  { nama: 'M. Fajar', nilai: 72 },
  { nama: 'Dewi Kusuma', nilai: 92 },
  { nama: 'Eka Putra', nilai: 65 },
  { nama: 'Nur Hidayah', nilai: 88 },
  { nama: 'Riko Pratama', nilai: 76 },
  { nama: 'Nia Salsabila', nilai: 94 },
  { nama: 'Randa Rizky', nilai: 68 },
  { nama: 'Lisa Anggreni', nilai: 81 },
]

const distribusiNilai: DistribusiNilai[] = [
  { nama: 'Sangat Baik (85-100)', value: 4, percentage: 40, color: '#10b981' },
  { nama: 'Baik (75-84)', value: 4, percentage: 40, color: '#3b82f6' },
  { nama: 'Cukup (65-74)', value: 2, percentage: 20, color: '#f59e0b' },
]

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

export default function GuruAnalisaPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Analisa Kelas XII MIPA 4</h1>
        <p className="text-gray-600">Laporan analisis kemajuan siswa dalam kelas yang Anda dampingi</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Total Siswa</p>
          <p className="text-3xl font-bold text-black mt-2">32</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Rata-rata Nilai</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">79.5</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Nilai Tertinggi</p>
          <p className="text-3xl font-bold text-green-600 mt-2">94</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Nilai Terendah</p>
          <p className="text-3xl font-bold text-red-600 mt-2">65</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Nilai Siswa */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Grafik Nilai Siswa</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataAnalisis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nama" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="nilai" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Distribusi Nilai */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Distribusi Nilai</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribusiNilai}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nama, percentage }) => `${nama}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distribusiNilai.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analisis Tabel */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">Detail Nilai Siswa</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  No.
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nama Siswa
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Nilai
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Grade
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {dataAnalisis.map((item, idx) => {
                let grade = ''
                let gradeColor = ''
                let status = ''
                let statusColor = ''

                if (item.nilai >= 85) {
                  grade = 'A'
                  gradeColor = 'bg-green-50 text-green-700'
                  status = 'Excellent'
                  statusColor = 'bg-green-100 text-green-800'
                } else if (item.nilai >= 75) {
                  grade = 'B'
                  gradeColor = 'bg-blue-50 text-blue-700'
                  status = 'Good'
                  statusColor = 'bg-blue-100 text-blue-800'
                } else if (item.nilai >= 65) {
                  grade = 'C'
                  gradeColor = 'bg-yellow-50 text-yellow-700'
                  status = 'Fair'
                  statusColor = 'bg-yellow-100 text-yellow-800'
                } else {
                  grade = 'D'
                  gradeColor = 'bg-red-50 text-red-700'
                  status = 'Poor'
                  statusColor = 'bg-red-100 text-red-800'
                }

                return (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-black">{item.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded font-semibold">
                        {item.nilai}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded font-semibold ${gradeColor}`}>
                        {grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
