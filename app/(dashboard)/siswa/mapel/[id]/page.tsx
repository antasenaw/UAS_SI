'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Topbar from '@/components/topbar'
import { ArrowLeft, BookOpen, FileText } from 'lucide-react'

interface MataPelajaran {
  id: string
  nama: string
  guru: string
  hari: string
  jam: string
}

interface Materi {
  id: string
  judul: string
  deskripsi: string
  tanggal: string
}

interface Pekerjaan {
  id: string
  nama: string
  deskripsi: string
  deadline: string
  status: 'belum' | 'sudah'
}

const allMataPelajaran: MataPelajaran[] = [
  { id: '1', nama: 'Matematika', guru: 'Ibu Siti', hari: 'Senin', jam: '08:00-09:30' },
  { id: '2', nama: 'Fisika', guru: 'Pak Ahmad', hari: 'Selasa', jam: '09:45-11:15' },
  { id: '3', nama: 'Bahasa Indonesia', guru: 'Ibu Rina', hari: 'Rabu', jam: '13:00-14:30' },
  { id: '4', nama: 'Kimia', guru: 'Pak Budi', hari: 'Kamis', jam: '10:00-11:30' },
  { id: '5', nama: 'Biologi', guru: 'Ibu Maya', hari: 'Jumat', jam: '11:45-13:15' },
  { id: '6', nama: 'Sejarah', guru: 'Pak Doni', hari: 'Sabtu', jam: '14:30-16:00' },
]

const dummyMateri: Materi[] = [
  {
    id: '1',
    judul: 'Bab 1: Konsep Dasar',
    deskripsi: 'Pengenalan konsep fundamental yang akan kita pelajari',
    tanggal: '2024-02-28',
  },
  {
    id: '2',
    judul: 'Bab 2: Aplikasi Praktis',
    deskripsi: 'Aplikasi konsep dalam kehidupan sehari-hari',
    tanggal: '2024-02-27',
  },
  {
    id: '3',
    judul: 'Catatan Tambahan',
    deskripsi: 'Referensi dan sumber belajar tambahan',
    tanggal: '2024-02-26',
  },
]

const dummyPekerjaan: Pekerjaan[] = [
  {
    id: '1',
    nama: 'Soal Latihan Bab 1',
    deskripsi: 'Kerjakan latihan soal halaman 10-15',
    deadline: '2024-03-05',
    status: 'belum',
  },
  {
    id: '2',
    nama: 'Essay Pemahaman Konsep',
    deskripsi: 'Tulis essay tentang pemahaman Anda',
    deadline: '2024-03-08',
    status: 'belum',
  },
  {
    id: '3',
    nama: 'Quiz Online',
    deskripsi: 'Uji pemahaman melalui quiz interaktif',
    deadline: '2024-03-03',
    status: 'sudah',
  },
]

const colorVariants = [
  'bg-red-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-yellow-400',
  'bg-pink-400',
]

export default function MapelDetailPage() {
  const params = useParams()
  const mapelId = params.id as string
  const [activeTab, setActiveTab] = useState<'materi' | 'pekerjaan'>('materi')

  const mapel = allMataPelajaran.find((m) => m.id === mapelId)
  const colorIndex = allMataPelajaran.findIndex((m) => m.id === mapelId)
  const bgColor = colorVariants[colorIndex % colorVariants.length]

  if (!mapel) {
    return <div className="text-center py-16">Mata pelajaran tidak ditemukan</div>
  }

  return (
    <div className="flex flex-col h-screen">
     

      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header Banner */}
        <div className={`${bgColor} text-white`}>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <Link
              href="/siswa/mapel"
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity text-white"
            >
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2">{mapel.nama}</h1>
            <p className="text-white/90">Guru: {mapel.guru} • {mapel.hari} {mapel.jam}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-t-lg border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('materi')}
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-all ${
                  activeTab === 'materi'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  Materi
                </div>
              </button>
              <button
                onClick={() => setActiveTab('pekerjaan')}
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-all ${
                  activeTab === 'pekerjaan'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  Pekerjaan
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-lg shadow-md">
            {/* Materi Tab */}
            {activeTab === 'materi' && (
              <div className="divide-y">
                {dummyMateri.length > 0 ? (
                  dummyMateri.map((materi) => (
                    <Link
                      key={materi.id}
                      href={`/siswa/mapel/${mapelId}/materi/${materi.id}`}
                      className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4 group"
                    >
                      <BookOpen className="text-blue-500 flex-shrink-0 mt-1 group-hover:text-blue-600" size={24} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-black text-lg mb-2 group-hover:text-blue-600 transition-colors">{materi.judul}</h3>
                        <p className="text-gray-600 text-sm mb-3">{materi.deskripsi}</p>
                        <p className="text-xs text-gray-500">
                          Diupload: {new Date(materi.tanggal).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Belum ada materi</p>
                  </div>
                )}
              </div>
            )}

            {/* Pekerjaan Tab */}
            {activeTab === 'pekerjaan' && (
              <div className="divide-y">
                {dummyPekerjaan.length > 0 ? (
                  dummyPekerjaan.map((pekerjaan) => (
                    <Link
                      key={pekerjaan.id}
                      href={`/siswa/mapel/${mapelId}/pekerjaan/${pekerjaan.id}`}
                      className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4 group"
                    >
                      <FileText className="text-purple-500 flex-shrink-0 mt-1 group-hover:text-purple-600" size={24} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-black text-lg mb-2 group-hover:text-blue-600 transition-colors">{pekerjaan.nama}</h3>
                        <p className="text-gray-600 text-sm mb-3">{pekerjaan.deskripsi}</p>
                        <p className="text-xs text-gray-500">
                          Deadline: {new Date(pekerjaan.deadline).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Belum ada pekerjaan</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
