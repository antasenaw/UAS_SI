'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Topbar from '@/components/topbar'
import { ArrowLeft, Download, File } from 'lucide-react'

interface MateriDetail {
  id: string
  judul: string
  deskripsi: string
  konten: string
  tanggal: string
  file?: {
    nama: string
    ukuran: string
    tipe: string
    url: string
  }[]
}

const allMateriDetail: Record<string, MateriDetail> = {
  '1': {
    id: '1',
    judul: 'Bab 1: Konsep Dasar',
    deskripsi: 'Pengenalan konsep fundamental yang akan kita pelajari',
    konten: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    tanggal: '2024-02-28',
    file: [
      { nama: 'Bab1_Slide.pdf', ukuran: '2.4 MB', tipe: 'PDF', url: '#' },
      { nama: 'Bab1_Ringkasan.docx', ukuran: '856 KB', tipe: 'DOCX', url: '#' },
    ],
  },
  '2': {
    id: '2',
    judul: 'Bab 2: Aplikasi Praktis',
    deskripsi: 'Aplikasi konsep dalam kehidupan sehari-hari',
    konten: `Bab ini membahas tentang aplikasi praktis dari konsep-konsep yang telah dipelajari sebelumnya.

Kami akan melihat bagaimana teori dapat diterapkan dalam situasi nyata dan masalah dunia nyata yang memerlukan pemahaman konsep ini.`,
    tanggal: '2024-02-27',
    file: [
      { nama: 'Bab2_Contoh.pdf', ukuran: '3.1 MB', tipe: 'PDF', url: '#' },
    ],
  },
  '3': {
    id: '3',
    judul: 'Catatan Tambahan',
    deskripsi: 'Referensi dan sumber belajar tambahan',
    konten: `Bagian ini menyediakan referensi dan sumber belajar tambahan untuk memperdalam pemahaman tentang topik-topik yang telah dibahas.

Silakan manfaatkan sumber daya ini sebagai bahan tambahan dalam belajar.`,
    tanggal: '2024-02-26',
    file: [
      { nama: 'Referensi.pdf', ukuran: '1.8 MB', tipe: 'PDF', url: '#' },
      { nama: 'Link_Sumber.xlsx', ukuran: '124 KB', tipe: 'XLSX', url: '#' },
    ],
  },
}

export default function MateriDetailPage() {
  const params = useParams()
  const mapelId = params.id as string
  const materiId = params.materiId as string

  const materi = allMateriDetail[materiId]

  if (!materi) {
    return <div className="text-center py-16">Materi tidak ditemukan</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <Topbar />

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
              Diupload: {new Date(materi.tanggal).toLocaleDateString('id-ID', {
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
              {materi.konten}
            </div>
          </div>

          {/* File Attachment */}
          {materi.file && materi.file.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-black mb-6">File Pembelajaran</h2>
              <div className="space-y-3">
                {materi.file.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <File className="text-gray-600" size={24} />
                      <div>
                        <p className="font-medium text-black">{file.nama}</p>
                        <p className="text-xs text-gray-500">
                          {file.tipe} • {file.ukuran}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Download size={18} />
                      <span className="text-sm font-medium">Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
