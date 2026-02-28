'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Topbar from '@/components/topbar'
import { ArrowLeft, FileText, Download } from 'lucide-react'

interface PekerjaanDetail {
  id: string
  nama: string
  deskripsi: string
  deadline: string
  status: 'belum' | 'sudah'
  file?: {
    nama: string
    ukuran: string
    tipe: string
    url: string
  }[]
}

const allPekerjaanDetail: Record<string, PekerjaanDetail> = {
  '1': {
    id: '1',
    nama: 'Soal Latihan Bab 1',
    deskripsi: `Kerjakan latihan soal yang ada pada halaman 10-15 buku paket. Jawaban harus ditulis dengan jelas dan rapi.

Perhatian:
- Kerjakan semua soal yang tersedia
- Tunjukkan cara/proses pengerjaan
- Kumpulkan dalam format PDF atau foto yang jelas
- Batas waktu pengumpulan: sesuai deadline`,
    deadline: '2024-03-05',
    status: 'belum',
    file: [
      { nama: 'Soal_Latihan_Bab1.pdf', ukuran: '1.2 MB', tipe: 'PDF', url: '#' },
    ],
  },
  '2': {
    id: '2',
    nama: 'Essay Pemahaman Konsep',
    deskripsi: `Tulislah essay dengan panjang minimal 500 kata tentang pemahaman Anda mengenai konsep-konsep yang telah dipelajari.

Struktur essay:
1. Pendahuluan (mengenalkan topik)
2. Isi (penjelasan konsep dan pemahaman Anda)
3. Kesimpulan (rangkuman pemahaman)

Format:
- Font: Arial, 12pt
- Spasi: 1.5
- Upload dalam format DOCX atau PDF`,
    deadline: '2024-03-08',
    status: 'belum',
  },
  '3': {
    id: '3',
    nama: 'Quiz Online',
    deskripsi: `Ikuti quiz online yang telah disiapkan untuk menguji pemahaman Anda tentang materi yang telah diajarkan.

Informasi Quiz:
- Durasi: 30 menit
- Jumlah soal: 20 pertanyaan
- Jenis: Pilihan ganda
- Nilai minimum: 70 untuk lulus`,
    deadline: '2024-03-03',
    status: 'sudah',
  },
}

function getStatusColor(status: string): string {
  return status === 'belum'
    ? 'bg-red-100 text-red-800'
    : 'bg-green-100 text-green-800'
}

function getStatusText(status: string): string {
  return status === 'belum' ? 'Belum Dikerjakan' : 'Sudah Dikerjakan'
}

export default function PekerjaanDetailPage() {
  const params = useParams()
  const mapelId = params.id as string
  const pekerjaaanId = params.pekerjaaanId as string

  const pekerjaan = allPekerjaanDetail[pekerjaaanId]

  if (!pekerjaan) {
    return <div className="text-center py-16">Pekerjaan tidak ditemukan</div>
  }

  const deadlineDate = new Date(pekerjaan.deadline)
  const isOverdue = new Date() > deadlineDate && pekerjaan.status === 'belum'

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-black">{pekerjaan.nama}</h1>
                <p className="text-gray-600 text-sm mt-2">
                  Deadline: {deadlineDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(pekerjaan.status)}`}>
                {getStatusText(pekerjaan.status)}
              </span>
            </div>
            {isOverdue && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                ⚠️ Deadline telah berlalu. Pengumpulan terlambat.
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Deskripsi Pekerjaan */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Deskripsi Pekerjaan</h2>
            <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap">
              {pekerjaan.deskripsi}
            </div>
          </div>

          {/* File Lampiran */}
          {pekerjaan.file && pekerjaan.file.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-xl font-semibold text-black mb-6">File Lampiran Pekerjaan</h2>
              <div className="space-y-3">
                {pekerjaan.file.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="text-gray-600" size={24} />
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

          {/* Upload Section - akan diganti dengan komponen upload nantinya */}
          {pekerjaan.status === 'belum' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-black mb-4">Kumpulkan Pekerjaan</h2>
              <p className="text-gray-700 mb-6">
                Silakan upload file pekerjaan Anda di sini. Komponen upload akan ditambahkan segera.
              </p>
              <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-2">Area untuk upload pekerjaan</p>
                <p className="text-sm text-gray-500">(Komponen upload akan disediakan nanti)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
