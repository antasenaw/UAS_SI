'use client'

import Link from 'next/link'
import Topbar from '@/components/topbar'
import { FileText, ArrowLeft } from 'lucide-react'

interface Pekerjaan {
  id: string
  nama: string
  deadline: string
}

const dummyPekerjaan: Pekerjaan[] = [
  {
    id: '1',
    nama: 'Soal Latihan Bab 5',
    deadline: '2024-03-02',
  },
  {
    id: '2',
    nama: 'Quiz Online Bab 4',
    deadline: '2024-02-28',
  },
  {
    id: '3',
    nama: 'Diskusi Forum Topik X',
    deadline: '2024-03-05',
  },
]

export default function MapelTugasPage() {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />

      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link
              href="/siswa"
              className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Kembali
            </Link>
            <h1 className="text-3xl font-semibold text-black">Pekerjaan</h1>
            <p className="text-gray-600 text-sm mt-1">Daftar pekerjaan mata pelajaran</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Pekerjaan List */}
          {dummyPekerjaan.length > 0 ? (
            <div className="space-y-3">
              {dummyPekerjaan.map((pekerjaan) => (
                <Link
                  key={pekerjaan.id}
                  href="/siswa/mapel/tugas"
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500 p-4 flex items-center gap-4"
                >
                  <FileText className="text-blue-600 flex-shrink-0" size={24} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black">{pekerjaan.nama}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Deadline: {new Date(pekerjaan.deadline).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Belum ada pekerjaan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

