'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, FileText, BookOpen, X } from 'lucide-react'

interface Materi {
  id: string
  judul: string
  deskripsi: string
  uploadedAt: string
  file?: string
}

interface Pekerjaan {
  id: string
  judul: string
  deskripsi: string
  deadline: string
  uploadedAt: string
}

const materiList: Materi[] = [
  {
    id: '1',
    judul: 'Pengenalan Termodinamika',
    deskripsi: 'Konsep dasar hukum pertama dan kedua termodinamika',
    uploadedAt: '28 Februari 2026',
    file: 'Termodinamika_Dasar.pdf',
  },
  {
    id: '2',
    judul: 'Usaha dan Energi',
    deskripsi: 'Pembahasan lengkap tentang konsep usaha dan energi kinetik',
    uploadedAt: '25 Februari 2026',
    file: 'Usaha_dan_Energi.pdf',
  },
  {
    id: '3',
    judul: 'Gerak Melingkar Beraturan',
    deskripsi: 'Analisis gerak melingkar dan gaya sentripetal',
    uploadedAt: '20 Februari 2026',
    file: 'GMB.pdf',
  },
]

const pekerjaanList: Pekerjaan[] = [
  {
    id: '1',
    judul: 'Soal Latihan Termodinamika',
    deskripsi: 'Kerjakan soal-soal pilihan ganda dan essay tentang termodinamika',
    deadline: '5 Maret 2026',
    uploadedAt: '28 Februari 2026',
  },
  {
    id: '2',
    judul: 'Tugas Kelompok Usaha dan Energi',
    deskripsi: 'Buat presentasi tentang penerapan usaha dan energi dalam kehidupan sehari-hari',
    deadline: '10 Maret 2026',
    uploadedAt: '25 Februari 2026',
  },
]

export default function GuruKelasDetailPage() {
  const kelasId = '1'
  const kelasNama = 'XII MIPA 1'
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'materi' | 'pekerjaan'>('materi')
  const [formData, setFormData] = useState({ judul: '', deskripsi: '', file: null })

  const handleOpenModal = (type: 'materi' | 'pekerjaan') => {
    setModalType(type)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setShowModal(false)
    setFormData({ judul: '', deskripsi: '', file: null })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/guru/kelas"
          className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar Kelas
        </Link>
        <h1 className="text-3xl font-bold text-black">{kelasNama}</h1>
        <p className="text-gray-600 mt-1">Kelola materi dan pekerjaan kelas</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Materi Column */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-black mb-4">Materi Pelajaran</h2>
          <div className="space-y-3">
            {materiList.map((materi) => (
              <div
                key={materi.id}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-2">
                  <BookOpen size={20} className="text-green-500 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black text-sm">{materi.judul}</h3>
                    <p className="text-xs text-gray-500 mt-1">{materi.uploadedAt}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{materi.deskripsi}</p>
                {materi.file && (
                  <div className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                    📄 {materi.file}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pekerjaan Column */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-black mb-4">Pekerjaan / Tugas</h2>
          <div className="space-y-3">
            {pekerjaanList.map((pekerjaan) => (
              <Link
                key={pekerjaan.id}
                href={`/guru/kelas/${kelasId}/pekerjaan/${pekerjaan.id}`}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow block cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-2">
                  <FileText size={20} className="text-blue-500 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black text-sm">{pekerjaan.judul}</h3>
                    <p className="text-xs text-gray-500 mt-1">{pekerjaan.uploadedAt}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{pekerjaan.deskripsi}</p>
                <div className="text-xs font-medium text-orange-600">
                  📅 Deadline: {pekerjaan.deadline}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-black mb-4">Tambah Konten Baru</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleOpenModal('materi')}
              className="w-full p-6 bg-white rounded-lg border-2 border-dashed border-green-300 hover:bg-green-50 transition-colors"
            >
              <Plus size={24} className="text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-700 text-sm">Upload Materi</p>
              <p className="text-xs text-gray-600 mt-1">Tambah materi pelajaran baru</p>
            </button>

            <button
              onClick={() => handleOpenModal('pekerjaan')}
              className="w-full p-6 bg-white rounded-lg border-2 border-dashed border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Plus size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-700 text-sm">Buat Pekerjaan</p>
              <p className="text-xs text-gray-600 mt-1">Buat tugas / kuis baru</p>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">
                {modalType === 'materi' ? 'Upload Materi' : 'Buat Pekerjaan'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Judul {modalType === 'materi' ? 'Materi' : 'Pekerjaan'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan judul"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Deskripsi
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Masukkan deskripsi"
                />
              </div>

              {modalType === 'materi' && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    File Materi (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {modalType === 'pekerjaan' && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
