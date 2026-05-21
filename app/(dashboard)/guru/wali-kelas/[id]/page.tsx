'use client'

import Link from 'next/link'
import { ArrowLeft, Heart, Award, TrendingUp, Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'

interface NilaiMataPelajaran {
  mataPelajaran: string
  guru: string
  nilai: number
}

export default function GuruWaliKelasDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const siswaId = params?.id as string
  const [siswaData, setSiswaData] = useState<any>(null)
  const [nilaiMataPelajaran, setNilaiMataPelajaran] = useState<NilaiMataPelajaran[]>([])
  const [catatan, setCatatan] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
        const headers: any = {}
        if (token) headers.Authorization = `Bearer ${token}`

        // Fetch siswa data - assuming there's an API endpoint
        // For now, using dummy data as fallback
        const dummySiswaData = {
          id: siswaId,
          nama: 'Ahmad Rizki Pratama',
          nis: '123456',
          kelas: 'XII MIPA 4',
          noUrut: 'I-01',
          rataRataNilai: 85,
          statusKehadiran: {
            hadir: 95,
            sakit: 2,
            izin: 1,
            bolos: 2,
          },
          catatan: 'Siswa menunjukkan peningkatan akademis yang baik.',
        }

        const dummyNilai: NilaiMataPelajaran[] = [
          { mataPelajaran: 'Pendidikan Agama', guru: 'Pak Haji Mahmud', nilai: 88 },
          { mataPelajaran: 'Pendidikan Pancasila', guru: 'Ibu Susi', nilai: 82 },
          { mataPelajaran: 'Bahasa Indonesia', guru: 'Pak Budi', nilai: 79 },
          { mataPelajaran: 'Bahasa Inggris', guru: 'Ibu Tuti', nilai: 84 },
          { mataPelajaran: 'Matematika', guru: 'Pak Doni', nilai: 91 },
          { mataPelajaran: 'Fisika', guru: 'Ibu Siti', nilai: 85 },
          { mataPelajaran: 'Kimia', guru: 'Pak Wawan', nilai: 80 },
          { mataPelajaran: 'Biologi', guru: 'Ibu Rini', nilai: 87 },
        ]

        setSiswaData(dummySiswaData)
        setNilaiMataPelajaran(dummyNilai)
        setCatatan(dummySiswaData.catatan)
      } catch (err) {
        console.error(err)
        setError('Gagal memuat data siswa')
      } finally {
        setLoading(false)
      }
    }

    if (siswaId) {
      fetchData()
    }
  }, [siswaId])

  const handleSaveCatatan = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const headers: any = {
        'Content-Type': 'application/json',
      }
      if (token) headers.Authorization = `Bearer ${token}`

      // TODO: Implement API endpoint to save catatan
      // For now, just simulate success
      setSuccessMessage('Catatan berhasil disimpan!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error(err)
      setError('Gagal menyimpan catatan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!siswaData) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error || 'Data siswa tidak ditemukan'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/guru/wali-kelas"
          className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar Siswa
        </Link>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Siswa Info Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-l-4 border-blue-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 text-sm font-medium">Nama</p>
            <p className="text-lg font-bold text-black mt-1">{siswaData?.nama}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">NIS</p>
            <p className="text-lg font-bold text-black mt-1">{siswaData?.nis}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Kelas</p>
            <p className="text-lg font-bold text-black mt-1">{siswaData?.kelas}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Rata-rata Nilai</p>
            <p className="text-lg font-bold text-blue-600 mt-1">{siswaData?.rataRataNilai}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Kehadiran</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{siswaData?.statusKehadiran?.hadir}</p>
            </div>
            <Heart size={32} className="text-green-100" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sakit</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{siswaData?.statusKehadiran?.sakit}</p>
            </div>
            <Award size={32} className="text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Izin</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{siswaData?.statusKehadiran?.izin}</p>
            </div>
            <TrendingUp size={32} className="text-yellow-100" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Bolos</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{siswaData?.statusKehadiran?.bolos}</p>
            </div>
            <Award size={32} className="text-red-100" />
          </div>
        </div>
      </div>

      {/* Nilai Mata Pelajaran Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Laporan Nilai Semester</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Mata Pelajaran
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Guru Mata Pelajaran
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Nilai
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Predikat
                </th>
              </tr>
            </thead>
            <tbody>
              {nilaiMataPelajaran.map((item, idx) => {
                let predikat = ''
                let color = ''
                if (item.nilai >= 85) {
                  predikat = 'A'
                  color = 'bg-green-50 text-green-700'
                } else if (item.nilai >= 75) {
                  predikat = 'B'
                  color = 'bg-blue-50 text-blue-700'
                } else if (item.nilai >= 65) {
                  predikat = 'C'
                  color = 'bg-yellow-50 text-yellow-700'
                } else {
                  predikat = 'D'
                  color = 'bg-red-50 text-red-700'
                }

                return (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-black">{item.mataPelajaran}</td>
                    <td className="px-6 py-4 text-gray-600">{item.guru}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded font-semibold">
                        {item.nilai}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${color}`}>
                        {predikat}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Catatan Guru Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-black mb-2">Catatan & Masukan Guru Wali Kelas</h2>
          <p className="text-sm text-gray-600 mb-4">Berikan catatan atau masukan yang akan ditampilkan di halaman analisa siswa</p>
        </div>
        <div>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Masukkan catatan atau masukan untuk siswa ini..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none"
            rows={6}
          />
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => setCatatan('')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Bersihkan
          </button>
          <button
            onClick={handleSaveCatatan}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            <Save size={18} />
            {saving ? 'Menyimpan...' : 'Simpan Catatan'}
          </button>
        </div>
      </div>
    </div>
  )
}
