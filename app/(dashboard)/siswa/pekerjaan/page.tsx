'use client'

import { useState } from 'react'
import Link from 'next/link'
import Topbar from '@/components/topbar'
import { FileText, ArrowLeft } from 'lucide-react'

interface Pekerjaan {
  id: string
  nama: string
  mapelId: string
  mataPelajaran: string
  deadline: string
}

const allPekerjaan: Pekerjaan[] = [
  {
    id: '1',
    nama: 'Soal Latihan Bab 5',
    mapelId: '1',
    mataPelajaran: 'Matematika',
    deadline: '2024-03-02',
  },
  {
    id: '2',
    nama: 'Essay Kebebasan Pers',
    mapelId: '3',
    mataPelajaran: 'Bahasa Indonesia',
    deadline: '2024-03-01',
  },
  {
    id: '3',
    nama: 'Laporan Praktik Fisika',
    mapelId: '2',
    mataPelajaran: 'Fisika',
    deadline: '2024-03-05',
  },
  {
    id: '4',
    nama: 'Ulangan Harian Kimia',
    mapelId: '4',
    mataPelajaran: 'Kimia',
    deadline: '2024-03-03',
  },
  {
    id: '5',
    nama: 'Presentasi Biologi',
    mapelId: '5',
    mataPelajaran: 'Biologi',
    deadline: '2024-03-07',
  },
  {
    id: '6',
    nama: 'Essay Analisis Sejarah',
    mapelId: '6',
    mataPelajaran: 'Sejarah',
    deadline: '2024-02-29',
  },
]

export default function PekerjaanPage() {
  const [sortBy, setSortBy] = useState<'deadline' | 'terbaru'>('deadline')

  const sortedPekerjaan = [...allPekerjaan].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    } else if (sortBy === 'terbaru') {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    }
    return 0
  })

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
            <h1 className="text-3xl font-semibold text-black">Semua Pekerjaan</h1>
            <p className="text-gray-600 text-sm mt-1">Daftar lengkap pekerjaan dari semua mata pelajaran</p>
          </div>
        </div>

        {/* Sorting */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-end mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'deadline' | 'terbaru')}
              className="px-4 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="deadline">Urutkan: Deadline</option>
              <option value="terbaru">Urutkan: Terbaru</option>
            </select>
          </div>

          {/* Pekerjaan List */}
          {sortedPekerjaan.length > 0 ? (
            <div className="space-y-3">
              {sortedPekerjaan.map((pekerjaan) => (
                <Link
                  key={pekerjaan.id}
                  href={`/siswa/mapel/${pekerjaan.mapelId}/pekerjaan/${pekerjaan.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500 p-4 flex items-center gap-4"
                >
                  <FileText className="text-blue-600 flex-shrink-0" size={24} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black">{pekerjaan.nama}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {pekerjaan.mataPelajaran} • Deadline: {new Date(pekerjaan.deadline).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada pekerjaan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
