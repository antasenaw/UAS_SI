'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Plus, FileText, BookOpen, X } from 'lucide-react'

interface GuruInfo {
  id: string
  name: string
  noInduk: string
}

interface SubjectInfo {
  id: string
  namaMataPelajaran: string
}

interface ClassDetail {
  id: string
  namaKelas: string
  jurusan: string
  angkatan: string
  waliKelas: GuruInfo | null
}

interface StudentInfo {
  id: string
  name: string
  noInduk: string
}

interface ScheduleItem {
  id: string
  subject: SubjectInfo | null
  guruPengajar: GuruInfo | null
  hari: string
  jamMulai: string
  jamSelesai: string
  ruangKelas: string
}

interface TaskInfo {
  id: string
  judul: string
  deskripsi: string
  deadline: string
  mataPelajaran: SubjectInfo | null
  guru: GuruInfo | null
}

interface GuruKelasResponse {
  kelas: ClassDetail | null
  siswa: StudentInfo[]
  jadwal: ScheduleItem[]
  tugas: TaskInfo[]
}

export default function GuruKelasDetailPage() {
  const params = useParams()
  const kelasId = params?.id
  const [data, setData] = useState<GuruKelasResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'materi' | 'pekerjaan'>('materi')
  const [formData, setFormData] = useState({ judul: '', deskripsi: '', file: null })

  useEffect(() => {
    if (!kelasId) return

    const fetchKelasData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/guru/kelas/${kelasId}`)
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Gagal memuat data kelas')
        }

        setData(result.data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Terjadi kesalahan saat memuat data kelas')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchKelasData()
  }, [kelasId])

  const handleOpenModal = (type: 'materi' | 'pekerjaan') => {
    setModalType(type)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowModal(false)
    setFormData({ judul: '', deskripsi: '', file: null })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md border border-red-100 p-8">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Gagal memuat kelas</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link href="/guru/kelas" className="text-blue-600 hover:underline">
            Kembali ke daftar kelas
          </Link>
        </div>
      </div>
    )
  }

  const kelasNama = data?.kelas?.namaKelas ?? 'Detail Kelas'

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/guru/kelas"
          className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar Kelas
        </Link>
        <h1 className="text-3xl font-bold text-black">{kelasNama}</h1>
        <p className="text-gray-600 mt-1">Kelola materi, jadwal, dan tugas kelas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-black mb-4">Jadwal Pelajaran</h2>
          <div className="space-y-3">
            {data?.jadwal.length ? (
              data.jadwal.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <BookOpen size={20} className="text-green-500 shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-sm">
                        {item.subject?.namaMataPelajaran ?? 'Mata pelajaran tidak tersedia'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{item.hari} • {item.jamMulai} - {item.jamSelesai}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Ruang: {item.ruangKelas || '-'}</p>
                  <p className="text-xs font-medium text-gray-700">
                    Guru: {item.guruPengajar?.name ?? '-'}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-600">
                Jadwal pelajaran belum tersedia untuk kelas ini.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-black mb-4">Pekerjaan / Tugas</h2>
          <div className="space-y-3">
            {data?.tugas.length ? (
              data.tugas.map((task) => (
                <Link
                  key={task.id}
                  href={`/guru/kelas/${kelasId}/pekerjaan/${task.id}`}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow block cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <FileText size={20} className="text-blue-500 shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-sm">{task.judul}</h3>
                      <p className="text-xs text-gray-500 mt-1">{task.mataPelajaran?.namaMataPelajaran ?? 'Mata pelajaran tidak tersedia'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{task.deskripsi}</p>
                  <div className="text-xs font-medium text-orange-600">📅 Deadline: {task.deadline}</div>
                  <div className="text-xs text-gray-700 mt-2">Guru: {task.guru?.name ?? '-'}</div>
                </Link>
              ))
            ) : (
              <div className="p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-600">
                Belum ada tugas untuk kelas ini.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-black mb-4">Info Kelas</h2>
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Jurusan</p>
              <p className="text-lg font-semibold text-black">{data?.kelas?.jurusan ?? '-'}</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Angkatan</p>
              <p className="text-lg font-semibold text-black">{data?.kelas?.angkatan ?? '-'}</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Wali Kelas</p>
              <p className="text-lg font-semibold text-black">
                {data?.kelas?.waliKelas?.name ?? 'Belum ditetapkan'}
              </p>
              <p className="text-sm text-gray-600">{data?.kelas?.waliKelas?.noInduk ?? '-'}</p>
            </div>
          </div>

          <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="font-semibold text-black mb-3">Total Siswa</h3>
            <p className="text-4xl font-bold text-blue-600">{data?.siswa.length ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-bold text-black">Daftar Siswa</h2>
          <p className="text-sm text-gray-500">Nama dan NIS siswa yang terdaftar di kelas ini</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama Siswa</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">NIS</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.siswa.length ? (
                data.siswa.map((student) => (
                  <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-black">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.noInduk}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Aktif</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-gray-500">
                    Belum ada siswa terdaftar di kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
