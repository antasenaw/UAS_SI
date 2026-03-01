'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Download, CheckCircle, Clock } from 'lucide-react'

interface Siswa {
  id: string
  nama: string
  status: 'submitted' | 'pending'
  submittedAt?: string
  file?: {
    nama: string
    ukuran: string
  }[]
  nilai?: number
}

const siswaSubmissions: Siswa[] = [
  {
    id: '1',
    nama: 'Ahmad Rizki Pratama',
    status: 'submitted',
    submittedAt: '28 Februari 2026',
    file: [{ nama: 'Jawaban_Quiz_01.pdf', ukuran: '2.3 MB' }],
    nilai: 85,
  },
  {
    id: '2',
    nama: 'Siti Rahayu Nurdin',
    status: 'submitted',
    submittedAt: '27 Februari 2026',
    file: [{ nama: 'Jawaban_Quiz_Siti.pdf', ukuran: '1.8 MB' }],
    nilai: 78,
  },
  {
    id: '3',
    nama: 'Muhammad Fajar Rizky',
    status: 'submitted',
    submittedAt: '28 Februari 2026',
    file: [{ nama: 'Quiz_Fajar.pdf', ukuran: '2.1 MB' }],
    nilai: 72,
  },
  {
    id: '4',
    nama: 'Dewi Kusuma Wardhani',
    status: 'submitted',
    submittedAt: '26 Februari 2026',
    file: [{ nama: 'Jawaban_Dewi.pdf', ukuran: '2.5 MB' }],
    nilai: 92,
  },
  {
    id: '5',
    nama: 'Eka Putra Wijaya',
    status: 'pending',
    nilai: undefined,
  },
]

export default function GuruPekerjaanDetailPage() {
  const [nilaiEdit, setNilaiEdit] = useState<Record<string, number>>({})

  const handleNilaiChange = (siswaId: string, nilai: number) => {
    setNilaiEdit({ ...nilaiEdit, [siswaId]: nilai })
  }

  const handleSimpanNilai = (siswaId: string) => {
    // Handle save nilai
    console.log(`Nilai untuk siswa ${siswaId} disimpan: ${nilaiEdit[siswaId]}`)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/guru/kelas/1"
          className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Kembali ke Detail Kelas
        </Link>
        <h1 className="text-3xl font-bold text-black">Soal Latihan Termodinamika</h1>
        <p className="text-gray-600 mt-1">Kelola pengumpulan dan nilai siswa</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Total Siswa</p>
          <p className="text-3xl font-bold text-black mt-2">32</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Sudah Submit</p>
          <p className="text-3xl font-bold text-green-600 mt-2">27</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Belum Submit</p>
          <p className="text-3xl font-bold text-red-600 mt-2">5</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nama Siswa
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  File / Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nilai
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {siswaSubmissions.map((siswa) => (
                <tr key={siswa.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-black">{siswa.nama}</td>
                  <td className="px-6 py-4">
                    {siswa.status === 'submitted' ? (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Sudah Dikumpulkan</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-700">
                        <Clock size={16} />
                        <span className="text-sm font-medium">Belum Dikumpulkan</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {siswa.status === 'submitted' ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{siswa.submittedAt}</p>
                        {siswa.file?.map((f, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-blue-600 text-sm font-medium cursor-pointer hover:underline"
                          >
                            <FileText size={14} />
                            {f.nama}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">-</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {siswa.status === 'submitted' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          value={nilaiEdit[siswa.id] !== undefined ? nilaiEdit[siswa.id] : siswa.nilai || ''}
                          onChange={(e) => handleNilaiChange(siswa.id, parseInt(e.target.value) || 0)}
                        />
                        <span className="text-sm text-gray-600">/ 100</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">-</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {siswa.status === 'submitted' && (
                      <button
                        onClick={() => handleSimpanNilai(siswa.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Simpan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
