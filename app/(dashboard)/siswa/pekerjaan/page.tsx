'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearch } from '@/app/providers'
import { FileText, ArrowLeft } from 'lucide-react'

interface Pekerjaan {
  id: string
  nama: string
  mapelId: string
  mataPelajaran: string
  deadline: string
}

export default function PekerjaanPage() {
  const { searchQuery } = useSearch()
  const [sortBy, setSortBy] = useState<'deadline' | 'terbaru'>('deadline')
  const [allPekerjaan, setAllPekerjaan] = useState<Pekerjaan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const res = await fetch("/api/assignment", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success && data.data) {
          const mapped = data.data.map((item: any) => ({
            id: item._id,
            nama: item.judul,
            mapelId: item.mataPelajaran?._id || "-",
            mataPelajaran: item.mataPelajaran?.namaMataPelajaran || "-",
            deadline: item.deadline
          }))
          setAllPekerjaan(mapped)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAssignments()
  }, [])

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchActive = normalizedSearch.length > 0

  const filteredPekerjaan = allPekerjaan.filter((p) => {
    return [p.nama, p.mataPelajaran, p.deadline].some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    )
  })

  const pekerjaanToShow = searchActive ? filteredPekerjaan : allPekerjaan

  const sortedPekerjaan = [...pekerjaanToShow].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    } else if (sortBy === 'terbaru') {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    }
    return 0
  })

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
            <Link
              href="/siswa"
              className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Kembali
            </Link>
            <h1 className="text-3xl font-semibold text-black">Semua Pekerjaan</h1>
            <p className="text-gray-600 text-sm mt-1">
              {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Daftar lengkap pekerjaan dari semua mata pelajaran'}
            </p>
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
                  <FileText className="text-blue-600 shrink-0" size={24} />
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
              <p className="text-gray-500 text-lg">
                {searchActive ? 'Tidak ada pekerjaan yang sesuai dengan pencarian' : 'Tidak ada pekerjaan'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
