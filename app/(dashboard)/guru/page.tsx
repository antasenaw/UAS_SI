'use client'

import GuruProfileCard from '@/components/guruProfileCard'
import { BookOpen, Users, TrendingUp, AlertCircle } from 'lucide-react'

interface KelasSummary {
  id: string
  nama: string
  jumlahSiswa: number
  topikTerbaru: string
}

interface SiswaAnalisa {
  id: string
  nama: string
  kelas: string
  rataRataNilai: number
  status: 'baik' | 'cukup' | 'kurang'
}

const kelasList: KelasSummary[] = [
  {
    id: '1',
    nama: 'XII MIPA 1',
    jumlahSiswa: 32,
    topikTerbaru: 'Materi Termodinamika - 28 Februari 2026',
  },
  {
    id: '2',
    nama: 'XII MIPA 2',
    jumlahSiswa: 30,
    topikTerbaru: 'Soal Latihan Usaha dan Energi - 27 Februari 2026',
  },
  {
    id: '3',
    nama: 'XII MIPA 3',
    jumlahSiswa: 31,
    topikTerbaru: 'Quiz Mekanika - 26 Februari 2026',
  },
  {
    id: '4',
    nama: 'XII MIPA 4',
    jumlahSiswa: 29,
    topikTerbaru: 'Tugas Kelompok Gelombang - 25 Februari 2026',
  },
]

const siswaAnalisa: SiswaAnalisa[] = [
  {
    id: '1',
    nama: 'Ahmad Rizki Pratama',
    kelas: 'XII MIPA 4',
    rataRataNilai: 85,
    status: 'baik',
  },
  {
    id: '2',
    nama: 'Siti Rahayu Nurdin',
    kelas: 'XII MIPA 4',
    rataRataNilai: 78,
    status: 'cukup',
  },
  {
    id: '3',
    nama: 'Muhammad Fajar Rizky',
    kelas: 'XII MIPA 4',
    rataRataNilai: 65,
    status: 'kurang',
  },
  {
    id: '4',
    nama: 'Dewi Kusuma Wardhani',
    kelas: 'XII MIPA 4',
    rataRataNilai: 92,
    status: 'baik',
  },
  {
    id: '5',
    nama: 'Eka Putra Wijaya',
    kelas: 'XII MIPA 4',
    rataRataNilai: 55,
    status: 'kurang',
  },
]

export default function GuruBeranda() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'baik':
        return 'bg-green-50 text-green-700'
      case 'cukup':
        return 'bg-yellow-50 text-yellow-700'
      case 'kurang':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Selamat Datang, Ibu Siti</h1>
        <p className="text-gray-600">Kelola kelas dan pantau perkembangan siswa Anda</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Right Column - Profile Card */}
        <div className="col-span-1">
          <GuruProfileCard
            nama="Ibu Siti Nurhaliza, S.Pd"
            nip="197503051998032001"
            kelasWali="XII MIPA 4"
            mataPelajaran={['Fisika', 'Praktikum Fisika']}
          />
        </div>

        {/* Left & Center Column */}
        <div className="col-span-3 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Kelas</p>
                  <p className="text-3xl font-bold text-black mt-2">4</p>
                </div>
                <BookOpen size={40} className="text-blue-100" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Siswa</p>
                  <p className="text-3xl font-bold text-black mt-2">122</p>
                </div>
                <Users size={40} className="text-blue-100" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Rata-rata Nilai</p>
                  <p className="text-3xl font-bold text-black mt-2">76.5</p>
                </div>
                <TrendingUp size={40} className="text-blue-100" />
              </div>
            </div>
          </div>

          {/* Kelas Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Kelas yang Anda Ajar</h2>
            <div className="grid grid-cols-2 gap-4">
              {kelasList.map((kelas) => (
                <div
                  key={kelas.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-black">{kelas.nama}</h3>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {kelas.jumlahSiswa} siswa
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{kelas.topikTerbaru}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analisa Siswa Wali Kelas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Analisa Siswa Kelas Wali (XII MIPA 4)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-semibold text-gray-600">Nama Siswa</th>
                    <th className="text-center py-3 font-semibold text-gray-600">Nilai Rata-rata</th>
                    <th className="text-center py-3 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {siswaAnalisa.map((siswa) => (
                    <tr key={siswa.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-medium text-black">{siswa.nama}</td>
                      <td className="py-3 text-center">
                        <span className="font-semibold text-black">{siswa.rataRataNilai}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            siswa.status
                          )}`}
                        >
                          {siswa.status === 'baik' && 'Baik'}
                          {siswa.status === 'cukup' && 'Cukup'}
                          {siswa.status === 'kurang' && 'Perlu Perhatian'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
