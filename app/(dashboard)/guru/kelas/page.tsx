'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { BookOpen, Users, FileText } from 'lucide-react'
import { useSearch } from '@/app/providers'

interface Kelas {
  id: string
  nama: string
  tingkat: string
  jumlahSiswa: number
  mataPelajaran: string
  jumlahMateri: number
  jumlahPekerjaan: number
}

const kelasList: Kelas[] = [
  {
    id: '1',
    nama: 'XII MIPA 1',
    tingkat: 'Kelas XII',
    jumlahSiswa: 32,
    mataPelajaran: 'Fisika',
    jumlahMateri: 8,
    jumlahPekerjaan: 5,
  },
  {
    id: '2',
    nama: 'XII MIPA 2',
    tingkat: 'Kelas XII',
    jumlahSiswa: 30,
    mataPelajaran: 'Fisika',
    jumlahMateri: 8,
    jumlahPekerjaan: 5,
  },
  {
    id: '3',
    nama: 'XII MIPA 3',
    tingkat: 'Kelas XII',
    jumlahSiswa: 31,
    mataPelajaran: 'Fisika',
    jumlahMateri: 7,
    jumlahPekerjaan: 4,
  },
  {
    id: '4',
    nama: 'XII MIPA 4',
    tingkat: 'Kelas XII',
    jumlahSiswa: 29,
    mataPelajaran: 'Fisika',
    jumlahMateri: 8,
    jumlahPekerjaan: 6,
  },
]

export default function GuruKelasPage() {
  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  const filteredKelas = kelasList.filter((kelas) =>
    [kelas.nama, kelas.mataPelajaran, kelas.tingkat].some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    )
  )

  const kelasToShow = searchActive ? filteredKelas : kelasList

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Kelas yang Saya Ajar</h1>
        <p className="text-gray-600">
          {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Kelola materi dan pekerjaan untuk setiap kelas'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kelasToShow.length > 0 ? (
          kelasToShow.map((kelas) => (
          <Link
            key={kelas.id}
            href={`/guru/kelas/${kelas.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="h-24 bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <BookOpen size={40} className="text-white opacity-80" />
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-black mb-1">{kelas.nama}</h2>
              <p className="text-sm text-gray-500 mb-4">{kelas.mataPelajaran}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={18} className="text-blue-500" />
                  <span className="text-sm"><strong>{kelas.jumlahSiswa}</strong> siswa</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FileText size={18} className="text-green-500" />
                  <span className="text-sm">
                    <strong>{kelas.jumlahMateri}</strong> materi • <strong>{kelas.jumlahPekerjaan}</strong> tugas
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm">
                Lihat Kelas →
              </button>
            </div>
          </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {searchActive ? 'Tidak ada kelas yang sesuai dengan pencarian' : 'Belum ada kelas'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
