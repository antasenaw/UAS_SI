'use client'

import { useState } from 'react'
import { useSearch } from '@/app/providers'
import { Plus, Edit2, Trash2, Users } from 'lucide-react'

interface Kelas {
  id: string
  nama: string
  tingkat: string
  jumlahSiswa: number
  waliBakal?: string
}

const kelasList: Kelas[] = [
  { id: '1', nama: 'X IPA 1', tingkat: 'Kelas X', jumlahSiswa: 32, waliBakal: 'Pak Sugeng' },
  { id: '2', nama: 'X IPA 2', tingkat: 'Kelas X', jumlahSiswa: 30, waliBakal: 'Ibu Susi' },
  { id: '3', nama: 'X IPS 1', tingkat: 'Kelas X', jumlahSiswa: 28, waliBakal: 'Pak Hadi' },
  { id: '4', nama: 'XI IPA 1', tingkat: 'Kelas XI', jumlahSiswa: 34, waliBakal: 'Ibu Rosa' },
  { id: '5', nama: 'XI IPA 2', tingkat: 'Kelas XI', jumlahSiswa: 32, waliBakal: 'Pak Budi' },
  { id: '6', nama: 'XI IPS 1', tingkat: 'Kelas XI', jumlahSiswa: 30, waliBakal: 'Ibu Tuti' },
  { id: '7', nama: 'XII IPA 1', tingkat: 'Kelas XII', jumlahSiswa: 32, waliBakal: 'Ibu Siti' },
  { id: '8', nama: 'XII IPA 2', tingkat: 'Kelas XII', jumlahSiswa: 30, waliBakal: 'Pak Doni' },
  { id: '9', nama: 'XII IPA 3', tingkat: 'Kelas XII', jumlahSiswa: 31, waliBakal: 'Ibu Nurma' },
  { id: '10', nama: 'XII IPA 4', tingkat: 'Kelas XII', jumlahSiswa: 29, waliBakal: 'Pak Haji' },
  { id: '11', nama: 'XII IPS 1', tingkat: 'Kelas XII', jumlahSiswa: 28, waliBakal: 'Ibu Citra' },
  { id: '12', nama: 'XII IPS 2', tingkat: 'Kelas XII', jumlahSiswa: 26, waliBakal: 'Pak Agus' },
]

export default function AdminKelasPage() {
  const [showModal, setShowModal] = useState(false)
  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  const filteredKelas = kelasList.filter((kelas) =>
    [kelas.nama, kelas.tingkat, kelas.waliBakal].some((value) =>
      value?.toLowerCase().includes(normalizedSearch)
    )
  )

  const kelasToShow = searchActive ? filteredKelas : kelasList

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Manajemen Kelas</h1>
          <p className="text-gray-600">
            {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Kelola data kelas dan distribusi siswa'}
          </p>
        </div>
        <button
          onClick={() => alert('Fitur tambah kelas sedang dikembangkan. Silakan hubungi administrator.')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus size={20} />
          Tambah Kelas Baru
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Total Kelas</p>
          <p className="text-3xl font-bold text-black mt-2">{kelasList.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Kelas X</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">3</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Kelas XI</p>
          <p className="text-3xl font-bold text-green-600 mt-2">3</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium">Kelas XII</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">6</p>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kelasToShow.length > 0 ? (
          kelasToShow.map((kelas) => (
          <div key={kelas.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-black">{kelas.nama}</h3>
                <p className="text-sm text-gray-500 mt-1">{kelas.tingkat}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={18} className="text-blue-500" />
                <span className="font-medium">{kelas.jumlahSiswa} siswa</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Wali Kelas:</span> {kelas.waliBakal}
              </p>
            </div>
          </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {searchActive ? 'Tidak ada kelas yang sesuai dengan pencarian' : 'Belum ada kelas'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
