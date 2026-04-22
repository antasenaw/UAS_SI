'use client'

import Link from "next/link"
import Topbar from "@/components/topbar"
import { Book } from "lucide-react"

interface MataPelajaran {
  id: string
  nama: string
  guru: string
  hari: string
  jam: string
}

// Data semua mata pelajaran
const allMataPelajaran: MataPelajaran[] = [
  { id: '1', nama: 'Matematika', guru: 'Ibu Siti', hari: 'Senin', jam: '08:00-09:30' },
  { id: '2', nama: 'Fisika', guru: 'Pak Ahmad', hari: 'Selasa', jam: '09:45-11:15' },
  { id: '3', nama: 'Bahasa Indonesia', guru: 'Ibu Rina', hari: 'Rabu', jam: '13:00-14:30' },
  { id: '4', nama: 'Kimia', guru: 'Pak Budi', hari: 'Kamis', jam: '10:00-11:30' },
  { id: '5', nama: 'Biologi', guru: 'Ibu Maya', hari: 'Jumat', jam: '11:45-13:15' },
  { id: '6', nama: 'Sejarah', guru: 'Pak Doni', hari: 'Sabtu', jam: '14:30-16:00' },
]

const colorVariants = [
  'bg-red-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-yellow-400',
  'bg-pink-400',
]

export default function MapelPage() {
  return (
    <div className="flex flex-col h-screen">

      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-semibold text-black">Mata Pelajaran</h1>
            <p className="text-gray-600 text-sm mt-1">Semua kelas dan mata pelajaran Anda</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Mata Pelajaran Grid - Classroom Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMataPelajaran.map((mapel, index) => (
              <Link
                key={mapel.id}
                href={`/siswa/mapel/${mapel.id}`}
                className="group cursor-pointer"
              >
                {/* Card Container */}
                <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
                  {/* Header Background */}
                  <div className={`${colorVariants[index % colorVariants.length]} h-32 flex items-center justify-center`}>
                    <Book size={48} className="text-white opacity-80" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-black mb-1 group-hover:text-blue-600 transition-colors">
                      {mapel.nama}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">Guru: {mapel.guru}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{mapel.hari} • {mapel.jam}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {allMataPelajaran.length === 0 && (
            <div className="text-center py-16">
              <Book size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">Belum ada mata pelajaran</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

