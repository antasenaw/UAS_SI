'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearch } from "@/app/providers"
import { Book } from "lucide-react"

interface MataPelajaran {
  id: string
  nama: string
  guru: string
  hari: string
  jam: string
}

const colorVariants = [
  'bg-red-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-yellow-400',
  'bg-pink-400',
]

export default function MapelPage() {
  const [subjects, setSubjects] = useState<MataPelajaran[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const res = await fetch("/api/siswa", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.success) {
          setSubjects(data.subjects || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchActive = normalizedSearch.length > 0

  const filteredMataPelajaran = subjects.filter((mp) => {
    return [mp.nama, mp.guru, mp.hari, mp.jam].some((value) =>
      value?.toLowerCase().includes(normalizedSearch)
    )
  })

  const mataPelajaranToShow = searchActive ? filteredMataPelajaran : subjects

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">

      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-semibold text-black">Mata Pelajaran</h1>
            <p className="text-gray-600 text-sm mt-1">
              {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Semua kelas dan mata pelajaran Anda'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Mata Pelajaran Grid - Classroom Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mataPelajaranToShow.length > 0 ? (
              mataPelajaranToShow.map((mapel, index) => (
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
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <Book size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">
                  {searchActive ? 'Tidak ada mata pelajaran yang sesuai dengan pencarian' : 'Belum ada mata pelajaran'}
                </p>
              </div>
            )}
          </div>

          {/* Empty State */}
          {mataPelajaranToShow.length === 0 && (
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

