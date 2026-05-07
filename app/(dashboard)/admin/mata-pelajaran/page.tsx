'use client'

import { useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react'
import { useSearch } from '@/app/providers'

interface MataPelajaran {
  id: string
  nama: string
  kode: string
  kategori: 'umum' | 'peminatan'
  jumlahGuru: number
  tingkatan: string[]
}

const mataPelajaranList: MataPelajaran[] = [
  {
    id: '1',
    nama: 'Pendidikan Agama Islam',
    kode: 'PAI',
    kategori: 'umum',
    jumlahGuru: 4,
    tingkatan: ['X', 'XI', 'XII'],
  },
  {
    id: '2',
    nama: 'Pendidikan Pancasila',
    kode: 'PP',
    kategori: 'umum',
    jumlahGuru: 3,
    tingkatan: ['X', 'XI', 'XII'],
  },
  {
    id: '3',
    nama: 'Bahasa Indonesia',
    kode: 'BI',
    kategori: 'umum',
    jumlahGuru: 5,
    tingkatan: ['X', 'XI', 'XII'],
  },
  {
    id: '4',
    nama: 'Bahasa Inggris',
    kode: 'BIG',
    kategori: 'umum',
    jumlahGuru: 5,
    tingkatan: ['X', 'XI', 'XII'],
  },
  {
    id: '5',
    nama: 'Matematika',
    kode: 'MAT',
    kategori: 'umum',
    jumlahGuru: 6,
    tingkatan: ['X', 'XI', 'XII'],
  },
  {
    id: '6',
    nama: 'Fisika',
    kode: 'FIS',
    kategori: 'peminatan',
    jumlahGuru: 4,
    tingkatan: ['X', 'XI', 'XII'],
  },
  {
    id: '7',
    nama: 'Kimia',
    kode: 'KIM',
    kategori: 'peminatan',
    jumlahGuru: 3,
    tingkatan: ['X', 'XI', 'XII'],
  },
  {
    id: '8',
    nama: 'Biologi',
    kode: 'BIO',
    kategori: 'peminatan',
    jumlahGuru: 3,
    tingkatan: ['X', 'XI', 'XII'],
  },
]

export default function AdminMataPelajaranPage() {
  const [filterKategori, setFilterKategori] = useState<'all' | 'umum' | 'peminatan'>('all')

  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchActive = normalizedSearch.length > 0

  const filteredMapel = useMemo(
    () =>
      mataPelajaranList.filter((mapel) => {
        const matchesKategori = filterKategori === 'all' || mapel.kategori === filterKategori
        const query = searchQuery.trim().toLowerCase()
        const matchesSearch =
          query === '' ||
          mapel.nama.toLowerCase().includes(query) ||
          mapel.kode.toLowerCase().includes(query) ||
          mapel.kategori.toLowerCase().includes(query)
        return matchesKategori && matchesSearch
      }),
    [filterKategori, searchQuery]
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Manajemen Mata Pelajaran</h1>
          <p className="text-gray-600">
            {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Kelola data mata pelajaran dan pengajaran'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          <Plus size={20} />
          Tambah Mata Pelajaran
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Total Mata Pelajaran</p>
          <p className="text-3xl font-bold text-black mt-2">{mataPelajaranList.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Mapel Umum</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Mapel Peminatan</p>
          <p className="text-3xl font-bold text-green-600 mt-2">3</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <label className="block text-sm font-medium text-black mb-2">
          Filter Kategori
        </label>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value as 'all' | 'umum' | 'peminatan')}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Kategori</option>
          <option value="umum">Mata Pelajaran Umum</option>
          <option value="peminatan">Mata Pelajaran Peminatan</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nama Mata Pelajaran
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Kode
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Kategori
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Tingkatan
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Jumlah Guru
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMapel.length > 0 ? (
                filteredMapel.map((mapel) => (
                  <tr key={mapel.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-black">{mapel.nama}</td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">{mapel.kode}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          mapel.kategori === 'umum'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {mapel.kategori === 'umum' ? 'Umum' : 'Peminatan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {mapel.tingkatan.map((tingkat, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                          >
                            Kelas {tingkat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded font-semibold">
                        {mapel.jumlahGuru}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-600">
                    Tidak ada mata pelajaran yang sesuai dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
