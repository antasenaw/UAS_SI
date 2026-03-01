'use client'

import Link from 'next/link'
import { Users } from 'lucide-react'

interface Kelas {
  id: string
  nama: string
  tingkat: string
  jumlahSiswa: number
}

const kelasWali: Kelas[] = [
  {
    id: '1',
    nama: 'XII MIPA 4',
    tingkat: 'Kelas XII',
    jumlahSiswa: 32,
  },
]

const siswaList = [
  {
    id: '1',
    nama: 'Ahmad Rizki Pratama',
    nis: '123456',
    noUrut: 'I-01',
    rataRataNilai: 85,
    status: 'aktif',
  },
  {
    id: '2',
    nama: 'Siti Rahayu Nurdin',
    nis: '123457',
    noUrut: 'I-02',
    rataRataNilai: 78,
    status: 'aktif',
  },
  {
    id: '3',
    nama: 'Muhammad Fajar Rizky',
    nis: '123458',
    noUrut: 'I-03',
    rataRataNilai: 72,
    status: 'aktif',
  },
  {
    id: '4',
    nama: 'Dewi Kusuma Wardhani',
    nis: '123459',
    noUrut: 'I-04',
    rataRataNilai: 92,
    status: 'aktif',
  },
  {
    id: '5',
    nama: 'Eka Putra Wijaya',
    nis: '123460',
    noUrut: 'I-05',
    rataRataNilai: 65,
    status: 'aktif',
  },
]

export default function GuruWaliKelasPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Kelas Wali Saya</h1>
        <p className="text-gray-600">Data siswa dalam kelas yang Anda dampingi</p>
      </div>

      {/* Kelas Card */}
      <div className="mb-8 grid grid-cols-1 gap-6">
        {kelasWali.map((kelas) => (
          <div key={kelas.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-black">{kelas.nama}</h2>
                <p className="text-gray-600 text-sm mt-1">{kelas.tingkat}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Siswa</p>
                <p className="text-2xl font-bold text-blue-600">{kelas.jumlahSiswa}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daftar Siswa */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Daftar Siswa XII MIPA 4</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  No. Urut
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nama Siswa
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  NIS
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nilai Rata-rata
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {siswaList.map((siswa, idx) => (
                <tr key={siswa.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{idx + 1}</td>
                  <td className="px-6 py-4 font-medium text-black">{siswa.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{siswa.nis}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded font-semibold text-sm">
                      {siswa.rataRataNilai}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/guru/wali-kelas/${siswa.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Lihat Detail →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
