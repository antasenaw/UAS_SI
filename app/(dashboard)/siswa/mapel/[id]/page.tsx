'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Topbar from '@/components/topbar'
import { ArrowLeft, BookOpen, FileText } from 'lucide-react'

interface MataPelajaran {
  nama: string
  guru: string
  hari: string
  jam: string
}

interface Materi {
  _id: string
  judul: string
  deskripsi: string
  tanggalUpload: string
}

interface Pekerjaan {
  _id: string
  judul: string
  deskripsi: string
  deadline: string
  status: string
}

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
  const [mapel, setMapel] = useState<MataPelajaran | null>(null)
  const [materiList, setMateriList] = useState<Materi[]>([])
  const [pekerjaanList, setPekerjaanList] = useState<Pekerjaan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const resCS = await fetch(`/api/class-subject?id=${mapelId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const dataCS = await resCS.json()
        if (dataCS.success && dataCS.data && dataCS.data.length > 0) {
          const cs = dataCS.data[0]
          setMapel({
            nama: cs.subjectId?.namaMataPelajaran || "-",
            guru: cs.guruPengajar?.name || "-",
            hari: cs.hari || "-",
            jam: `${cs.hari || ""} ${cs.jamMulai || ""} - ${cs.jamSelesai || ""}`
          })

          const resM = await fetch(`/api/material?subjectId=${cs.subjectId?._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const dataM = await resM.json()
          if (dataM.success) {
            setMateriList(dataM.data || [])
          }

          const resA = await fetch(`/api/assignment?subjectId=${cs.subjectId?._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const dataA = await resA.json()
          if (dataA.success) {
            setPekerjaanList(dataA.data || [])
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (mapelId) {
      fetchData()
    }
  }, [mapelId])

  const colorIndex = typeof mapelId === 'string' ? mapelId.charCodeAt(0) : 0
  const bgColor = colorVariants[colorIndex % colorVariants.length]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
                {materiList.length > 0 ? (
                  materiList.map((materi) => (
                    <Link
                      key={materi._id}
                      href={`/siswa/mapel/${mapelId}/materi/${materi._id}`}
                      className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4 group"
                    >
                      <BookOpen className="text-blue-500 flex-shrink-0 mt-1 group-hover:text-blue-600" size={24} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-black text-lg mb-2 group-hover:text-blue-600 transition-colors">{materi.judul}</h3>
                        <p className="text-gray-600 text-sm mb-3">{materi.deskripsi}</p>
                        <p className="text-xs text-gray-500">
                          Diupload: {new Date(materi.tanggalUpload).toLocaleDateString('id-ID')}
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
                {pekerjaanList.length > 0 ? (
                  pekerjaanList.map((pekerjaan) => (
                    <Link
                      key={pekerjaan._id}
                      href={`/siswa/mapel/${mapelId}/pekerjaan/${pekerjaan._id}`}
                      className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4 group"
                    >
                      <FileText className="text-purple-500 flex-shrink-0 mt-1 group-hover:text-purple-600" size={24} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-black text-lg mb-2 group-hover:text-blue-600 transition-colors">{pekerjaan.judul}</h3>
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
