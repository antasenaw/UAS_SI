'use client'

import { useState } from 'react'
import { useSearch } from '@/app/providers'
import { Plus, Edit2, Trash2, Calendar, Info } from 'lucide-react'

interface PeriodeAkademik {
  id: string
  tahunAwal: number
  tahunAkhir: number
  semester: '1' | '2'
  status: 'masaDepan' | 'aktif' | 'selesai'
  tanggalMulai: string
  tanggalSelesai: string
  kegiatan: {
    inputNilai: string
    raportSelesai: string
    kelulusanProses: string
  }
}

const periodeList: PeriodeAkademik[] = [
  {
    id: '1',
    tahunAwal: 2025,
    tahunAkhir: 2026,
    semester: '2',
    status: 'aktif',
    tanggalMulai: '2026-01-10',
    tanggalSelesai: '2026-06-30',
    kegiatan: {
      inputNilai: '2026-05-31',
      raportSelesai: '2026-06-05',
      kelulusanProses: '2026-06-10',
    },
  },
  {
    id: '2',
    tahunAwal: 2025,
    tahunAkhir: 2026,
    semester: '1',
    status: 'selesai',
    tanggalMulai: '2025-07-15',
    tanggalSelesai: '2025-12-31',
    kegiatan: {
      inputNilai: '2025-12-15',
      raportSelesai: '2025-12-20',
      kelulusanProses: '2025-12-25',
    },
  },
  {
    id: '3',
    tahunAwal: 2026,
    tahunAkhir: 2027,
    semester: '1',
    status: 'masaDepan',
    tanggalMulai: '2026-07-15',
    tanggalSelesai: '2026-12-31',
    kegiatan: {
      inputNilai: '2026-12-15',
      raportSelesai: '2026-12-20',
      kelulusanProses: '2026-12-25',
    },
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'aktif':
      return 'bg-green-50 text-green-700'
    case 'selesai':
      return 'bg-gray-50 text-gray-700'
    case 'masaDepan':
      return 'bg-yellow-50 text-yellow-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'aktif':
      return 'Aktif'
    case 'selesai':
      return 'Selesai'
    case 'masaDepan':
      return 'Masa Depan'
    default:
      return status
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function AdminPeriodePage() {
  const [selectedPeriode, setSelectedPeriode] = useState<string | null>(null)
  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  const filteredPeriode = periodeList.filter((periode) =>
    [periode.tahunAwal.toString(), periode.tahunAkhir.toString(), periode.semester, periode.status]
      .some((value) => value.toLowerCase().includes(normalizedSearch))
  )

  const periodeToShow = searchActive ? filteredPeriode : periodeList

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Manajemen Periode Akademik</h1>
          <p className="text-gray-600">
            {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Kelola tahun ajaran dan semester'}
          </p>
        </div>
        <button 
          onClick={() => alert('Fitur tambah periode akademik sedang dikembangkan. Silakan hubungi administrator.')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          <Plus size={20} />
          Tambah Periode
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Total Periode</p>
          <p className="text-3xl font-bold text-black mt-2">{periodeList.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Periode Aktif</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {periodeList.filter((p) => p.status === 'aktif').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Periode Selesai</p>
          <p className="text-3xl font-bold text-gray-600 mt-2">
            {periodeList.filter((p) => p.status === 'selesai').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Periode Mendatang</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {periodeList.filter((p) => p.status === 'masaDepan').length}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {periodeToShow.length > 0 ? (
          periodeToShow.map((periode) => (
            <div key={periode.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedPeriode(selectedPeriode === periode.id ? null : periode.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      Tahun Ajaran {periode.tahunAwal}/{periode.tahunAkhir} - Semester {periode.semester}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formatDate(periode.tanggalMulai)} até {formatDate(periode.tanggalSelesai)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(periode.status)}`}>
                    {getStatusLabel(periode.status)}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedPeriode === periode.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h4 className="font-bold text-black mb-4 flex items-center gap-2">
                  <Info size={18} />
                  Jadwal Kegiatan
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm mb-1">Input Nilai Akhir</p>
                    <p className="font-bold text-black">{formatDate(periode.kegiatan.inputNilai)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm mb-1">Raport Selesai</p>
                    <p className="font-bold text-black">{formatDate(periode.kegiatan.raportSelesai)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="text-gray-600 text-sm mb-1">Proses Kelulusan</p>
                    <p className="font-bold text-black">{formatDate(periode.kegiatan.kelulusanProses)}</p>
                  </div>
                </div>

                {/* Settings */}
                {periode.status === 'aktif' && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-bold text-blue-900 mb-3">Pengaturan Periode Aktif</h5>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-blue-900">Izinkan input nilai guru</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-blue-900">Izinkan siswa lihat nilai sementara</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-blue-900">Kunci penilaian (tidak bisa diubah)</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-10 text-center text-gray-600">
            Tidak ada periode yang sesuai dengan pencarian.
          </div>
        )}
      </div>
    </div>
  )
}
