'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Topbar from '@/components/topbar'
import { ArrowLeft, Download, File } from 'lucide-react'

import { useState, useEffect } from 'react'

interface MateriDetail {
  _id: string
  judul: string
  deskripsi: string
  konten?: string
  tanggalUpload: string
  file?: string
}

export default function MateriDetailPage() {
  const params = useParams()
  const mapelId = params.id as string
  const materiId = params.materiId as string

  const [materi, setMateri] = useState<MateriDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const res = await fetch(`/api/material?id=${materiId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.success && data.data && data.data.length > 0) {
          setMateri(data.data[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (materiId) {
      fetchMaterial()
    }
  }, [materiId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!materi) {
    return <div className="text-center py-16">Materi tidak ditemukan</div>
  }

  return (
    <div className="flex flex-col h-screen">

      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link
              href={`/siswa/mapel/${mapelId}`}
              className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Kembali
            </Link>
            <h1 className="text-3xl font-semibold text-black">{materi.judul}</h1>
            <p className="text-gray-600 text-sm mt-2">{materi.deskripsi}</p>
            <p className="text-xs text-gray-500 mt-3">
              Diupload: {new Date(materi.tanggalUpload).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Konten Materi */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Konten Materi</h2>
            <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap">
              {materi.konten || materi.deskripsi}
            </div>
          </div>

          {/* File Attachment */}
          {materi.file && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-black mb-6">File Pembelajaran</h2>
              <div className="space-y-3">
                <div
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <File className="text-gray-600" size={24} />
                    <div>
                      <p className="font-medium text-black">{materi.file.split('/').pop() || materi.file}</p>
                      <p className="text-xs text-gray-500">
                        File Lampiran
                      </p>
                    </div>
                  </div>
                  <a
                    href={materi.file}
                    download
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Download size={18} />
                    <span className="text-sm font-medium">Download</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
